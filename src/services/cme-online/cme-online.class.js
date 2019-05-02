const setFilters = require('../../helpers/setFilters');
const F = require('ers-utils').Format;
const format = new F();

let config = {
  _type: 'ers:cme-online-article'
};

const selectMode = () => {
  if (process.env.activePreview === 'true') {
    return {
      hasPreview: true
    };
  }
  return {
    unPublished: {
      $ne: true
    }
  };
};

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
    this.setFilter = setFilters.setCmeOnlineFilter;
  }

  async find(params) {
    const q = params.query || {};
    const direction = parseInt(q.sortDirection) || -1;
    const sortBy = q.sortBy || '_system.created_on.ms';
    const filters = this.setFilter(
      q.filterBy || false,
      q.types || false,
      q.categories || false
    );
    const body = Object.assign(
      params.body || {}, {
        _type: config._type,
      },
      filters, selectMode()
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
    const body = Object.assign({
      _type: config._type,
      slug: slug
    },
    selectMode()
    );
    return new Promise(resolve => {
      global.cloudcms
        .trap(function (e) {
          resolve({
            message: e.message,
            status: e.status
          });
        })
        .queryNodes(body, {
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

  async create(data, params) {
    data._type = config._type;
    data.hasPreview = true;
    data.unPublished = true;

    return new Promise((resolve, reject) => {
      global.cloudcms
        .trap(function (e) {
          resolve({
            message: e.message,
            status: e.status
          });
        })
        .queryNodes({
          _type: config._type,
          slug: data.slug
        })
        .then(function () {
          if (this.asArray().length > 0) {
            resolve({
              message: `The slug: ${data.slug} already exist`,
              status: 404
            });
          }
          global.cloudcms
            .trap(function (e) {
              resolve({
                message: e.message,
                status: e.status
              });
            })
            .createNode(data)
            .then(function () {
              resolve({
                status: 201
              });
            });
        });
    });
  }

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
