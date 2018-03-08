/* eslint-disable no-unused-vars */
const es = require('../../helpers/elastic.js');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const query = params.query || {};
    return [];
  }

  // async get (id, params) {
  //   return {
  //     id, text: `A new message with ID: ${id}!`
  //   };
  // }

  // async create (data, params) {
  //   if (Array.isArray(data)) {
  //     return await Promise.all(data.map(current => this.create(current)));
  //   }

  //   return data;
  // }

  // async update (id, data, params) {
  //   return data;
  // }

  // async patch (id, data, params) {
  //   return data;
  // }

  // async remove (id, params) {
  //   return { id };
  // }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
