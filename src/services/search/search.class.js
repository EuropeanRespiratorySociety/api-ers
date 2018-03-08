/* eslint-disable no-unused-vars */
const { client } = require('../../helpers/elastic.js');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const q = params.query || {};
    const i = q.i || 'all';

    const results = await client.search({
      index: indices(i),
      body: query(q.q, 0)
    });

    const r = results.hits.hits.map(i => {
      const c = i._source;
      return {
        title: c.title,
        access: c.access || false,
        url: c.url || c.canonical,
        journal: c.journal_name || false,
        category: c.category ? c.category.title  : false,
        authors: c.authors ? c.authors.join(', ') : false
      };
    });
    return { results: r, aggs: results.aggregations, total: results.hits.total };

  }

  // async get (id, params) {
  //   return {
  //     id, text: `A new message with ID: ${id}!`
  //   };
  // }

  // async create (data, params) {
  //   if (Array.isArray(data)) {
  //     return await Promise.all(data.map(current => this.create(current)));
  //   }

  //   return data;
  // }

  // async update (id, data, params) {
  //   return data;
  // }

  // async patch (id, data, params) {
  //   return data;
  // }

  // async remove (id, params) {
  //   return { id };
  // }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;

const indices = (param) => {
  const i = ['content','journals','presentations-congress-2017'];
  /* eslint-disable indent */
  return param == 'content'
  ? i[0]
  : param == 'journals'
  ? i[1]
  : param == 'congress'
  ? i[2]
  : i.join(',');
  /* eslint-enable */
};

const query = (query, skip) => {
  return {
    from: skip, 
    query: {
      bool: {
        should: [
          {
            multi_match: {
              query,
              fields: ['abstract', 'full_available_text', 'subjects.text']
            }
          },
          {
            multi_match: {
              query,
              fields: ['authorText', 'authors'],
              boost: 4
            }
          },
          {
            multi_match: {
              query,
              fields: ['body', 'leadParagraph', 'title', 'diseases', 'methods'],
              boost: 10

            }
          }
        ]
      }
    },
    aggs:{ 
      source: {
        terms: {
          field: '_index'
        }
      },
      journals: {
        terms:{
          field: 'publisher.keyword'
        }
      }
    }  
  };
};
