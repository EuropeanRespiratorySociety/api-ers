'use strict';

module.exports = {
  menuItems: (branch, qname) => {
    const body =  {
      traverse: {
        associations: {
          'a:parent-menu-association': 'INCOMING'
        },
        depth: 10,
        types:['custom:menu']
      }
    };

    const opts = {
      metadata: true
    };

    return new Promise((resolve) => {
      branch
        .trap(function(e){
          resolve({message:e.message, status: e.status});
        })      
        .then(function(){
          const node = this.readNode(qname);              
          node.then(function(){
            const nodes = this.subchain(node).find(body, opts);
            nodes.then(function(){
              const r = JSON.parse(JSON.stringify(this.asArray()));
              resolve({item: node.json(), items: r, status: 200});
            });
          });
        });
    });
  },

  item: (branch, slug) => {
    return new Promise((resolve) => {
      branch
        .trap(function(e){
          resolve({message:e.message, status: e.status});
        })
        .queryNodes({
          slug: slug,
          unPublished: { $ne: true}
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
  },

  breadcrumb: (branch, qname) => {
    const body = {
      traverse:    {
        associations: {
          'a:menu-association': 'INCOMING',
          'a:parent-menu-association': 'OUTGOING'
          ,'a:category-association': 'OUTGOING'
        },
        depth: 10,
        types:['custom:menu']
      }
    };
    return new Promise((resolve) => {
      branch
        .trap(function(e){
          resolve({message:e.message, status: e.status});
        })      
        .then(function(){
          const node = this.readNode(qname);
          
          node.then(function(){
            const item = this;
            const nodes = this.subchain(node).find(body, {metadata:true});
            nodes
              .each(function(){
                this._stats = this.__stats();
              })
              .then(function(){
                //const total = nodes.__totaRows();
                const r = JSON.parse(JSON.stringify(nodes.asArray()));
                resolve({item: [item.json()], items: r, status: 200});
              });
          });
        });
    });
  },

  relatives: (branch, qname, type, options) => {
    const { 
      body = {}, 
      sortDirection = -1, 
      metadata = false,
      full = false, 
      sortBy = '_system.modified_on.ms', 
      limit = 25, 
      skip = 0 
    } = options || {};

    const b = Object.assign(body, {
      unPublished: { $ne: true}
    });

    const config = {
      type: type
    };

    const opts = {
      metadata: metadata || true,
      limit: limit,
      skip: parseInt(skip) || 0,
      sort: { [sortBy]: sortDirection }
    };

    return new Promise((resolve) => {
      branch
        .trap(function(e){
          resolve({message:e.message, status: e.status});
        })
        .then(function(){
          const node = this.readNode(qname);
          node
            .then(function(){
              const nodes = this.subchain(node).queryRelatives(b, config, opts);
              nodes
                .each(function(){
                  this._system = this.getSystemMetadata();
                  if(full){
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
};
