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
    const { abstract = false, similarityOnly = false } = data;
    const abstractService = this.app.service('congress/abstracts');
    if (abstract) {
      const r = await recommenderClient.post('/recommend', {
        abstract,
        user: similarityOnly ? `${-1}` : `${params.user.ersId}`
      });
      const results = await Promise.all(r.data.papers.map(async (i) => await abstractService.get(i)));
      return results;
    }

    return [];
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
