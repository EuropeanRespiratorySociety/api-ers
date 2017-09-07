/* eslint-disable no-unused-vars */

const def = require('../../swagger/relatives');
const F = require('ers-utils').Format;
const format = new F();

let config = {
  type: 'ers:category-association'
};

class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }  

  /**
   * Internal request can pass an aditional body object to customize the request to cloudcms
   */
  find(params) {
    params.query.full = params.query.full == 'true';
    const q = params.query;
    const direction = parseInt(q.sortDirection) || -1;
    const sortBy = q.sortBy || '_system.modified_on.ms';
    const body = Object.assign(params.body || {}, {
      unPublished: { $ne: true}
    });
    const opts = {
      //"full": false,
      metadata: true,
      limit: format.setLimit(q.limit, this.options.paginate),
      skip: parseInt(q.skip) || 0,
      sort: { [sortBy]: direction }
    };

    params.options = opts;
    return new Promise((resolve, reject) => {
      global.cloudcms
        .trap(function(e){
          resolve({message:e.message, status: e.status});
        })
        .then(function() {
          const node = this.readNode(q.qname);
          node.then(function(){
            const nodes = this.subchain(node).queryRelatives(body, config, opts);
            nodes
              .each(function(){
                this._system = this.getSystemMetadata();
                if(params.query.full){
                  this._statistics = this.__stats();
                  this._qname = this.__qname();
                }
              })
              .then(function(){
                const total = nodes.__totalRows();
                const relatives = JSON.parse(JSON.stringify(nodes.asArray()));
                resolve({item: [node.json()], items: relatives, status: 200, total: total});
              });
          });
        });
    });      
  }

  get(slug, params) {
    //params.query.full = params.query.full == 'true';
    return new Promise((resolve, reject) => {
      global.cloudcms
        .trap(function(e){
          resolve({message:e.message, status: e.status});
        })
        .queryNodes({
          slug: slug,
          unPublished: { $ne: true }
        },{
          metadata: true
        })
        .each(function(){
          this._system = this.getSystemMetadata();
          this._statistics = this.__stats();
          this._qname = this.__qname();
        })
        .then(function(){
          if(this.asArray().length > 0) {
            const article = JSON.parse(JSON.stringify(this.asArray()));
            resolve({item: [article[0]], status: 200});
          }
          resolve({message: `The slug: ${slug} did not return any result` , status: 404});
        });
    }); 
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
