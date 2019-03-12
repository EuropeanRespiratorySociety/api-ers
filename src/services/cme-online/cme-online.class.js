/*eslint-disable */
const setFilters = require('../../helpers/setFilters');
const r = require('../../helpers/requests');
const setCmeOnlineFilter = setFilters.setCmeOnlineFilter;

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const {
      query
    } = params;
    const filters = setCmeOnlineFilter(query.filterBy || false, query.type || false, query.category || false);
    return await r.relatives(global.cloudcms, 'o:8e1f9c610877206a850e', 'ers:category-association', {
      body: filters
    });
  }

  async get(slug) {
    return await r.item(global.cloudcms, slug);
  }

  // async create(data, params) {
  //   data._type = 'ers:article';
  //   data.imported = true;
  //   data.category = {
  //     id: '8e1f9c610877206a850e',
  //     ref: 'node://18dbd4f08d5f428ba9c2/607e97e4474d46e40345/b4fb47ddf6c57cff771c/8e1f9c610877206a850e',
  //     title: 'CME Online',
  //     qname: 'o:8e1f9c610877206a850e',
  //     typeQName: 'ers:category'
  //   };

  //   return new Promise((resolve, reject) => {
  //     global.cloudcms
  //       .trap(function (e) {
  //         resolve({
  //           message: e.message,
  //           status: e.status
  //         });
  //       })
  //       .createNode(data)
  //       .then(function () {
  //         resolve({
  //           status: 201
  //         });
  //       });
  //   });
  // }

  // async update (id, data, params) {
  //   return data;
  // }

  // async patch (id, data, params) {
  //   return data;
  // }

  // async remove(slug, params){
  //   return new Promise((resolve, reject) => {
  //     global.cloudcms
  //     .trap(function(e){
  //       resolve({message:e.message, status: e.status});
  //     })
  //     .then(function(){
  //       this.queryNodes({slug})
  //       .then(function(){
  //         this.del()
  //         .then(function(){
  //           resolve({status:200});
  //         });
  //       });
  //     });
  //   })
  // }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
