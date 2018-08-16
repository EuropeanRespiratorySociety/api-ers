const h = require('../../helpers/requests');

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    // o:f730239a8b20c4024d7f programme category
    // o:120ab483a2d8502c4947 home
    return h.relatives(global.cloudcms, params.query.qname, 'sb:article-category', params.query);
  }

  get(id, params) {
    return h.item(global.cloudcms, id);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
