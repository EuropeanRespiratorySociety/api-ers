const setQueryParams = require('./queryParams');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    if (options === undefined) throw new Error('options object is mandatory');
    this.options = options;
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    const relatives = this.app.service('relatives');

    return relatives.find({
      path: this.options.name,
      query: setQueryParams(this.options.qname, params.query)
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
