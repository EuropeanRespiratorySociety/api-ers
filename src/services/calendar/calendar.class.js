const setFilterBy = require('../../helpers/setFilters');
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
    const merged = Object.assign({},filter, filteredBy);
    return await relatives.find({
      body: merged,
      path: this.options.name,
      query:{
        qname:'o:cc1c5be57719dade0371',
        full: q.full,
        format: q.format|| 'html',
        sortBy: 'eventDate',
        sortDirection: 1,
        limit: parseInt(q.limit) || 200, //this is a bit off as filtering is done after the fact (isAlreadyPassed)
        skip: parseInt(q.skip) || 0
      }
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;

const setFilter = (type) => {
  //const today = moment().format('DD/MM/YYYY');
  if(type === 'ers'){
    return {
      ersEndorsedEvent: { '$ne': true },
      nonErsCalendarItem: { '$ne': true }
      //eventDate: {'$gte': today}
    };
  }

  if(type === 'deadline'){
    return { ersDeadline: true };
  }

  if(type === 'endorsed'){
    return { ersEndorsedEvent: true };
  }

  if(type === 'non-ers'){
    return { nonErsCalendarItem: true };
  }

  if(type === 'spirometry'){
    return { type: 'Spirometry Programme' };
  }

  if(type === 'hermes'){
    return { type: 'ERS HERMES' };
  }

  return {};
};

