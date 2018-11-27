/* eslint-disable no-unused-vars */
const sureThing = require('../../helpers/sureThing');
const { recommenderClient } = require('../../helpers/HTTP');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    const {
      abstract = false,
      similarityOnly = false,
      interests = [] } = data;
    // This is an example on how to get a service from a service
    // const abstractService = this.app.service('congress/abstracts');
    if (abstract) {
      const r = await recommenderClient.post('/recommend', {
        interests,
        abstract,
        user: similarityOnly ? `${-1}` : `${params.user.ersId}`
      });
      return r.data;

    }

    return [];
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
