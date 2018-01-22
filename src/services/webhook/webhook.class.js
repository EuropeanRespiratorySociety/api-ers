/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async create (data, params) {
    // if (Array.isArray(data)) {
    //   return await Promise.all(data.map(current => this.create(current)));
    // }

    // if action create
    // -- send to index
    // -- process the data in NLP pipeline
    // write to grakn

    if(params.query.type === 'cache') {
      // send the update to the Elastic Search index
      // 
      // send a log to another Elastic Search index
      // clear the cache for group the article belongs to
      // return message
      return { title: data._cloudcms.node.object.title, id: data._cloudcms.node.id };
    }

    return data;
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
