/* eslint-disable no-unused-vars */
const h = require('./webhook.helpers');
const errors = require('@feathersjs/errors');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async create (data, params) {
    const type = params.query.type;
    const pw = params.query.pw;
    if(pw !== process.env.WPW) {
      throw new errors.Forbidden('The password did not match. You are not authorized to use this webhook');
    }
    // if action create
    // -- send to index
    // -- process the data in NLP pipeline
    // write to grakn
    return type === 'cache'
      ? h.cache(data)
      : 'other method not yet implemented';
  }

  // async update (id, data, params) {
  //   return data;
  // }

  // async patch (id, data, params) {
  //   return data;
  // }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;