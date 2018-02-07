/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.setFilter = setFilter;
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    const relatives = this.app.service('relatives'); 
    const type = params.query.type || 'ers';
    const filter = this.setFilter(type);
    return await relatives.find({
      body: filter,
      path: this.options.name,
      query:{
        qname:'o:cc1c5be57719dade0371',
        full: params.query.full,
        format: params.query.format|| 'html',
        sortBy: 'eventDate',
        sortDirection: 1,
        limit: parseInt(params.query.limit) || 200, //this is a bit off as filtering is done after the fact (isAlreadyPassed)
        skip: parseInt(params.query.skip) || 0
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

