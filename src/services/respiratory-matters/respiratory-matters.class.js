/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    const relatives = this.app.service('relatives');    
    return relatives.find({query:{qname:'o:d571c1fa5c4b8ed6d7ac', full: params.query.full || false}}).then(results => results);
  }

  get(slug, params) {
    const relatives = this.app.service('relatives');    
    return relatives.get(slug, {query: params.query}).then(result => {
      //second query to get details of the author. Not nice...
      return new Promise((resolve, reject) => {
        relatives.find({query:{qname: result.data.author.qname, full: true}}).then(results => {
          result.data.author.slug = results.category[0].slug;
          result.data.author.uri = results.category[0].uri;
          resolve(result);
        });
      });
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
