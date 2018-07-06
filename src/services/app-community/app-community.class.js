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

  find(params) {
    const q = params.query || {};
    const direction = parseInt(q.sortDirection) || -1;
    const sortBy = q.sortBy || '_system.created_on.ms';
    const limit = format.setLimit(q.limit, this.options.paginate);
    const body = Object.assign(
      params.body || {}, 
      {
        postInAppCommunity: true,
        unPublished: { $ne: true } 
      }
    );

    const opts = {
      // full: true,
      metadata: true,
      limit: limit,
      skip: parseInt(q.skip) || 0,
      sort: { [sortBy]: direction }
    };
    
    params.options = opts;
    params.path = this.options.name;

    return new Promise((resolve, reject) => {
      global.cloudcms.queryNodes(body, opts)
        .trap(function(e){
          resolve({message:e.message, status: e.status});
        })
        .each(function(){
          this._system = this.getSystemMetadata();
        })
        .then(function(){
          const total = this.__totalRows();
          const items = JSON.parse(JSON.stringify(this.asArray()));
          resolve({
            item: [],
            items,
            status: 200,
            total,
            _sys: {status:200}
          });
        });
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
