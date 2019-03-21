/*eslint-disable */
const setFilters = require("../../helpers/setFilters");
const F = require("ers-utils").Format;
const format = new F();

let config = {
  _type: "ers:cme-online-article"
};

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
    this.setFilter = setFilters.setCmeOnlineFilter;
  }

  async find(params) {
    debugger;
    const q = params.query || {};
    const direction = parseInt(q.sortDirection) || -1;
    const sortBy = q.sortBy || "_system.created_on.ms";
    const filters = this.setFilter(q.filterBy || false, q.type || false, q.categories || false);
    const body = Object.assign(
      params.body || {}, {
        _type: config._type,
        unPublished: {
          $ne: true
        }
      },
      filters
    );

    const opts = {
      metadata: true,
      limit: format.setLimit(q.limit, this.options.paginate),
      skip: parseInt(q.skip) || 0,
      sort: {
        [sortBy]: direction
      }
    };

    return new Promise(resolve => {
      const nodes = global.cloudcms
        .queryNodes(body, opts)
        .trap(function (e) {
          resolve({
            message: e.message,
            status: e.status
          });
        })
        .then(function () {
          nodes
            .each(function () {
              this._system = this.getSystemMetadata();
              if (params.query.full) {
                this._statistics = this.__stats();
                this._qname = this.__qname();
              }
            })
            .then(function () {
              const total = nodes.__totalRows();
              const cmeOnlines = JSON.parse(JSON.stringify(nodes.asArray()));
              // status is there only for leagcy reasons.
              resolve({
                item: [],
                items: cmeOnlines,
                status: 200,
                total: total,
                _sys: {
                  status: 200
                }
              });
            });
        });
    });
  }

  async get(slug) {
    return new Promise(resolve => {
      global.cloudcms
        .trap(function (e) {
          resolve({
            message: e.message,
            status: e.status
          });
        })
        .queryNodes({
          _type: config._type,
          slug: slug,
          unPublished: {
            $ne: true
          }
        }, {
          metadata: true
        })
        .each(function () {
          this._system = this.getSystemMetadata();
          this._statistics = this.__stats();
          this._qname = this.__qname();
        })
        .then(function () {
          if (this.asArray().length > 0) {
            const cmeOnline = JSON.parse(JSON.stringify(this.asArray()));
            resolve({
              item: [cmeOnline[0]],
              status: 200
            });
          }
          resolve({
            message: `The slug: ${slug} did not return any result`,
            status: 404
          });
        });
    });
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
