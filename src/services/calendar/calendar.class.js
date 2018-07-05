const setFilterBy = require('../../helpers/setFilters');
// const m = require('moment');
/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.setFilter = setFilter;
    this.filterBy = setFilterBy;
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    const relatives = this.app.service('relatives'); 
    const q = params.query;
    const type = q.type || 'ers';
    const filter = this.setFilter(type);
    const filteredBy = this.filterBy(q.filterBy || false);
    const body = Object.assign({},filter, filteredBy);
    const q1 = {
      qname:'o:cc1c5be57719dade0371',
      full: q.full,
      format: q.format|| 'html',
      sortBy: 'eventDate',
      sortDirection: 1,
      // limit: parseInt(q.limit) || 200, //this is a bit off as filtering is done after the fact (isAlreadyPassed)
      limit: 100, // this is temporary until we have a solution with Cloud CMS
      skip: parseInt(q.skip) || 0
    };

    // Temporary to make sure to get everything
    const q2 = {...q1, ...{skip:100}};
    const q3 = {...q1, ...{skip:200}};

    // Trying to save time querying in parallel

    const [a, b, c] = await Promise.all([
      relatives.find({
        body,
        path: this.options.name,
        query: q1
      }),
      relatives.find({
        body,
        path: this.options.name,
        query: q2
      }),
      relatives.find({
        body,
        path: this.options.name,
        query: q3
      })
    ]);

    return {
      category: a.category,
      data: [...a.data, ...b.data, ...c.data],
      _sys: {
        total: a.data.length + b.data.length + c.data.length,
        status: 200
      }
    };

    // return relatives.find({
    //   body,
    //   path: this.options.name,
    //   query
    // });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;

const setFilter = (type) => {
  // const base = {eventDate: {'$gte': m().format('MM/DD/YYYY')}};
  // for now date filtering does not work as expected.
  const base = {};
  if(type === 'ers'){
    return {...base, ...{
      ersEndorsedEvent: { '$ne': true },
      nonErsCalendarItem: { '$ne': true },
    }};
  }

  if(type === 'deadline'){
    return {...base, ...{ersDeadline: true}};
  }

  if(type === 'endorsed'){
    return {...base, ...{ersEndorsedEvent: true}};
  }

  if(type === 'non-ers'){
    return {...base, ...{nonErsCalendarItem: true}};
  }

  if(type === 'spirometry'){
    return {...base, ...{type: 'Spirometry Programme'}};
  }

  if(type === 'hermes'){
    return {...base, ...{type: 'ERS HERMES'}};
  }

  return base;
};

