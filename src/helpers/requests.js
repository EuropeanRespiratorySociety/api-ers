'use strict';

module.exports = {
  menuItems: (branch, qname) => {
    const body = {
      traverse: {
        associations: {
          'a:parent-menu-association': 'INCOMING'
        },
        depth: 10,
        types: ['custom:menu']
      }
    };

    const opts = {
      metadata: true
    };

    return new Promise((resolve) => {
      branch
        .trap(function (e) {
          resolve({ message: e.message, status: e.status });
        })
        .then(function () {
          const node = this.readNode(qname);
          node.then(function () {
            const nodes = this.subchain(node).find(body, opts);
            nodes.then(function () {
              const r = JSON.parse(JSON.stringify(this.asArray()));
              resolve({ item: node.json(), items: r, status: 200 });
            });
          });
        });
    });
  },

  item: (branch, slug) => {
    return new Promise((resolve) => {
      branch
        .trap(function (e) {
          resolve({ message: e.message, status: e.status });
        })
        .queryNodes({
          slug: slug,
          unPublished: { $ne: true }
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
            const article = JSON.parse(JSON.stringify(this.asArray()));
            resolve({ item: [article[0]], status: 200 });
          }
          resolve({ message: `The slug: ${slug} did not return any result`, status: 404 });
        });
    });
  },

  breadcrumb: (branch, qname) => {
    const body = {
      traverse: {
        associations: {
          'a:menu-association': 'INCOMING',
          'a:parent-menu-association': 'OUTGOING'
          , 'a:category-association': 'OUTGOING'
        },
        depth: 10,
        types: ['custom:menu']
      }
    };
    return new Promise((resolve) => {
      branch
        .trap(function (e) {
          resolve({ message: e.message, status: e.status });
        })
        .then(function () {
          const node = this.readNode(qname);

          node.then(function () {
            const item = this;
            const nodes = this.subchain(node).find(body, { metadata: true });
            nodes
              .each(function () {
                this._stats = this.__stats();
              })
              .then(function () {
                //const total = nodes.__totaRows();
                const r = JSON.parse(JSON.stringify(nodes.asArray()));
                resolve({ item: [item.json()], items: r, status: 200 });
              });
          });
        });
    });
  },

  /** Update a  node with new properties or update current ones
   * @param {Object} branch
   * @param {String} node - the node to update (_doc property)
   * @param {Object} payload - the data that needs to change
   */
  updateNode: (branch, node, payload) => {
    return new Promise(resolve => {
      branch
        .trap(function (e) {
          resolve({ ok: false, message: e.message, status: e.status });
        })
        .readNode(node)
        .then(function () {
          Object.keys(payload).map(key => {
            this[key] = payload[key];
          });
          this.update();
          resolve({ ok: true, node });
        });
    });
  },

  /**
   * Given a branch and a node, a comment is hadded to that node.
   * @param {Object} branch
   * @param {Object} node - the node to which a comment is added
   * @param {String} message - the comment message
   */
  addComment: (branch, node, message) => {
    return new Promise(resolve => {
      branch
        .trap(function (e) {
          resolve({ ok: false, message: e.message, status: e.status });
        }).createNode({
          _type: 'n:comment',
          rating: 0
        })
        .then(function () {
          const commentNode = this;
          this.subchain(branch)
            .readNode(commentNode._doc)
            .attach('default', 'text/plain', message);
          this.subchain(branch)
            .readNode(node._doc)
            .associate(commentNode._doc, 'a:has_comment', { order: 1 })
            .then(function () {
              resolve({ ok: true });
            });
        });
    });
  },

  /**
   * @param {Object} branch - Cloud CMS object (global.cloudcms)
   * @param {String} qname - of the category
   * @param {String} [type] - association to follow
   * @param {Object} [options] - sorting and query options
   */
  relatives: (branch, qname, type = 'ers:category-association', options = {}) => {
    const {
      body = {},
      sortDirection = -1,
      metadata = false,
      full = false,
      sortBy = '_system.modified_on.ms',
      limit = 25,
      skip = 0
    } = options;

    const b = Object.assign(body, {
      unPublished: { $ne: true }
    });

    const config = {
      type
    };

    const opts = {
      metadata: metadata || true,
      limit,
      skip: parseInt(skip) || 0,
      sort: { [sortBy]: parseInt(sortDirection) }
    };

    return new Promise((resolve) => {
      branch
        .trap(function (e) {
          resolve({ message: e.message, status: e.status });
        })
        .then(function () {
          const node = this.readNode(qname);
          node
            .then(function () {
              const nodes = this.subchain(node).queryRelatives(b, config, opts);
              nodes
                .each(function () {
                  this._system = this.getSystemMetadata();
                  if (full) {
                    this._statistics = this.__stats();
                    this._qname = this.__qname();
                  }
                })
                .then(function () {
                  const total = nodes.__totalRows();
                  const relatives = JSON.parse(JSON.stringify(nodes.asArray()));
                  resolve({ item: [node.json()], items: relatives, status: 200, total: total });
                });
            });
        });
    });
  }
};
