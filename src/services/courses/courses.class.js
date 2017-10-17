/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    //this.app.request.apicacheGroup = 'courses';
    const relatives = this.app.service('relatives');
    const type = params.query.type || 'current';
    
    params.options = {type: type};
    return relatives.find({
      query:{
        qname:'o:f913cff03624ac461283', 
        full: params.query.full || false, 
        md: params.query.md || false
      },
    }).then(results => results);
  }

  get(slug, params) {
    //this.app.request.apicacheGroup = 'courses';
    const relatives = this.app.service('relatives');
    return relatives.get(slug, {query: params.query}).then(result => Object.assign(result, {_sys:{status:200}}));
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
