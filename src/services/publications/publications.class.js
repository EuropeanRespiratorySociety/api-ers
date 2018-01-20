/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    const relatives = this.app.service('relatives');
    return relatives.find({
      path: this.options.name, 
      query:{
        qname:'o:6a934ed625880b7ade96', 
        full: params.query.full || false,
        md: params.query.md || false
      }
    }).then(results => results);
  }

  async get (slug, params) {
    const relatives = this.app.service('relatives');
    return relatives.get(slug, {query: params.query}).then(result => Object.assign(result, {_sys:{status:200}}));
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
