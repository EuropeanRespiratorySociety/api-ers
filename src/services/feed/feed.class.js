const F = require('ers-utils').Format;
const format = new F();
const setFilters = require('../../helpers/setFilters');

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
    this.setFilter = setFilter;
    this.setFilters = setFilters.setFilter;
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const q = params.query;
    const direction = parseInt(q.sortDirection) || -1;
    const sortBy = q.sortBy || '_system.created_on.ms';
    const type = q.type || 'ers:article';
    const contentType = q.contentType || 'news';
    const filter = this.setFilter(contentType, type);
    const limit = format.setLimit(q.limit, this.options.paginate);
    const filters = this.setFilters(q.filterBy || false);
    const body = Object.assign(
      params.body || {},
      filter,
      filters
    );

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
        .trap(function (e) {
          resolve({ message: e.message, status: e.status });
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
              const news = JSON.parse(JSON.stringify(nodes.asArray()));
              // status is there only for leagcy reasons.
              resolve({
                item: [],
                items: news,
                status: 200,
                total: total,
                _sys: { status: 200 }
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

const setFilter = (contentType, type = 'ers:article') => {
  // const base = {eventDate: {'$gte': m().format('MM/DD/YYYY')}};
  // for now date filtering does not work as expected.
  const base = {};
  if (contentType === 'news') {
    return {
      ...base, ...{
        _type: type,
        type: 'News',
        unPublished: { $ne: true }
      }
    };
  }
  // "ERS Course",
  // "ERS HERMES",
  // "ERS Online course",
  // "ERS Skills course",
  // "ERS Training programme",
  // "ERS Endorsed activity",
  // "Hands-on",
  // "e-learning",
  // "Spirometry Programme",
  // "Short Term",
  // "Long Term",
  // "Research Seminar",
  // "Summit",
  // "News",
  // "ERS Vision"
  if (contentType === 'education') {
    return {
      ...base, ...{
        _type: type,
        type: {
          $in: ['ERS Courses',
            'ERS HERMES',
            'ERS Online course',
            'ERS Skills course',
            'ERS Training programme',
            'ERS Endorsed activity',]
        },
        unPublished: { $ne: true }
      }
    };
  }

  if (contentType === 'published') {
    return {
      ...base, ...{
        _type: type,
        unPublished: { $ne: true }
      }
    };
  }

  if (contentType === 'all') {
    return {
      ...base, ...{
        _type: type
      }
    };
  }

  return base;
};
