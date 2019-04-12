/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
const F = require('ers-utils').Format;
const DateUtils = require('ers-utils').DateUtils;
const format = new F();
const setFilters = require('../../helpers/setFilters');
const date = new DateUtils;

let config = {
  _type: 'ers:digest-article'
};

let deniedUsers = () => {
  const denied = process.env.DIGEST_ARTICLE_DENIED_USERS;
  if (denied) {
    return denied.split(',');
  }
  return [];
};



class Service {
  constructor(options) {
    this.options = options || {};
    this.setFilter = setFilters.setFilter;
  }

  find(params) {
    const q = params.query || {};
    q.full = q.full == 'true';
    const direction = parseInt(q.sortDirection) || -1;
    const sortBy = q.sortBy || '_system.created_on.ms';
    const filters = this.setFilter(q.filterBy || false);
    const body = Object.assign(
      params.body || {}, {
        _type: config._type,
        unPublished: {
          $ne: true
        },
        '_system.modified_by_principal_id': {
          $nin: deniedUsers()
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

    return new Promise((resolve) => {
      const nodes = global.cloudcms.queryNodes(body, opts)
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
              const digests = JSON.parse(JSON.stringify(nodes.asArray()));
              // status is there only for leagcy reasons.
              resolve({
                item: [],
                items: digests,
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

  get(slug) {
    return new Promise((resolve) => {
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
          },
          '_system.modified_by_principal_id': {
            $nin: deniedUsers()
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
            const digest = JSON.parse(JSON.stringify(this.asArray()));
            const created = digest[0]._system.created_on;
            digest[0].createdOn = date.ersDate(`${created.month + 1}/${created.day_of_month}/${created.year}`);
            resolve({
              item: [digest[0]],
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
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
