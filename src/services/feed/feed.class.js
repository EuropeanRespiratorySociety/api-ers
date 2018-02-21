const F = require('ers-utils').Format;
const format = new F();

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    const q = params.query;
    const direction = parseInt(q.sortDirection) || -1;
    const sortBy = q.sortBy || '_system.created_on.ms';
    const limit = format.setLimit(q.limit, this.options.paginate);
    const body = Object.assign(params.body || {}, {
      _type: q.type || 'ers:article',
      unPublished: { $ne: true}
    });

    const opts = {
      //"full": false,
      metadata: true,
      limit: limit,
      skip: parseInt(q.skip) || 0,
      sort: { [sortBy]: direction }
    };
    
    params.options = opts;

    return new Promise((resolve, reject) => {
      const nodes = global.cloudcms.queryNodes(body, opts)        
        .trap(function(e){
          resolve({message:e.message, status: e.status});
        })
        .then(function(){
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
              const news = JSON.parse(JSON.stringify(nodes.asArray()));
              // status is there only for leagcy reasons.
              resolve({
                item: [],
                items: news, 
                status: 200,
                total: total,
                _sys: {status:200}
              });
            });
        });
    });
  }  

  // async get (id, params) {
  //   return {
  //     id, text: `A new message with ID: ${id}!`
  //   };
  // }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
