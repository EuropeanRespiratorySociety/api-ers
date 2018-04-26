/* eslint-disable no-unused-vars */
const { client } = require('../../helpers/elastic.js');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const q = params.query || {};
    const i = q.i || 'all';
    const a = q.a == 'true' ? true : false;
    const skip = parseInt(q.s) || 0;
    const search = query(q.q, skip);

    const results = await client.search({
      index: indices(i),
      body: a ? Object.assign({size: 0}, search, getAggs()) : search
    });

    const r = results.hits.hits.map(i => {
      const c = i._source;
      const h = i.highlight;
      return {
        title: hasHighlight(h, c, 'title', 'name' ),
        lead: hasHighlight(h, c, 'leadParagraph'),
        type: setType(i._index),
        _id: i._id,
        access: c.access || false,
        url: c.url || c.canonical,
        image: c.image || false,
        registerButton: c.registerButton || false,
        journal: c.journal_name || false,
        category: c.category ? c.category.title  : false,
        /* eslint-disable indent */
        authors: c.authors 
          ?  c.authors.join(', ')
          : c.authorText
          ? hasHighlight(h, c, 'authorText')
          : false,
        speakers: hasHighlight(h, c, 'speakerText'),
        chairs: hasHighlight(h, c, 'chairText'),
        abstract: c.Content 
          ? c.Content.AbstractText 
          : c.abstract 
          ? c.abstract 
          : false,
        year: c.year || false
        /* eslint-enable indent */
      };
    });
    const aggs = 
    a
      ? results.aggregations.source.buckets.reduce((a, i) => {
        if (i.key.includes('journals')) a.journal = i.doc_count;
        if (i.key.includes('content')) a.web = i.doc_count;
        if (i.key.includes('congress')) a.congress = a.congress + i.doc_count;
        return a;
      }, {journal:0,web:0,congress:0})
      : undefined;

    return { results: r, aggs, total: results.hits.total };

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
  const i = ['content','journals','presentations-congress-2017', 'sessions-congress-2017'];
  /* eslint-disable indent */
  return param == 'web'
  ? i[0]
  : param == 'journals'
  ? i[1]
  : param == 'congress'
  ? `${i[2]},${i[3]}`
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
              fields: ['authorText', 'authors', 'aims', 'audience', 'chairText', 'name', 'subtitle'],
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
    }
    // highlight : {
    //   fields: {
    //     title : setHighlightTag(),
    //     name : setHighlightTag(),
    //     leadParagraph : setHighlightTag(),
    //     abstract : setHighlightTag(),
    //     authors : setHighlightTag(),
    //     authorText : setHighlightTag(),
    //     achairText : setHighlightTag()
    //   }
    // },
  
  };
};

const getAggs = () => {
  return {
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

function hasHighlight (highlight, source, key, alt = null) {
  /* eslint-disable indent */
  key = source.hasOwnProperty(alt)
    ? alt
    : source.hasOwnProperty(key)
    ? key
    : false;
  /* eslint-enable indent */
  return highlight && highlight.hasOwnProperty(key)
    ? highlight[key].join(', ')
    : source[key];
}

// function setHighlightTag () {
//   return { pre_tags : ['<span class="highlight">'], post_tags : ['</span>'] };
// }

function setType (string) {
  /* eslint-disable indent */
  return string.includes('journals')
    ? 'journal' 
    : string.includes('content')
    ? 'web'
    : string.includes('presentations')
    ? 'presentation'
    : string.includes('abstracts')
    ? 'abstracts'
    : string.includes('sessions')
    ? 'session'
    : 'other';
  /* eslint-enable indent */  
}
