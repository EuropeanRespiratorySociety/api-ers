/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find (params) {
    const relatives = this.app.service('relatives'); 
    const type = params.query.type || 'ers';
    const filter = setFilter(type);
    return relatives.find({
      body: filter,
      query:{
        qname:'o:cc1c5be57719dade0371',
        full: params.query.full,
        sortBy: 'eventDate',
        sortDirection: 1,
        limit: params.query.limit || 200, //this is a bit off as filtering is done after the fact (isAlreadyPassed)
        skip: params.query.skip || 0
      }
    }).then(results => results);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


function setFilter(type){
  //const today = moment().format('DD/MM/YYYY');
  if(type === 'ers'){
    return {
      ersEndorsedEvent: {'$ne': true},
      nonErsCalendarItem: {'$ne': true}
      //eventDate: {'$gte': today}
    };
  }

  if(type === 'deadline'){
    return {ersDeadline: true};
  }

  if(type === 'endorsed'){
    return {ersEndorsedEvent: true};
  }

  if(type === 'non-ers'){
    return {nonErsCalendarItem: true};
  }

  return {};
}
