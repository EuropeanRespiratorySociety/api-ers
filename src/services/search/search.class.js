/* eslint-disable no-unused-vars */
const { client } = require('../../helpers/elastic.js');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const q = params.query || {};
    const i = q.i || 'all';
    const f = q.f || false;
    const field = q.field || 'journal_url';
    const a = q.a == 'true' ? true : false;
    const skip = parseInt(q.s) || 0;
    const search = query(q.q, skip, f);
    const results = await client.search({
      index: indices(i, a),
      body: a 
        ? Object.assign(
          {},
          {size: 0}, 
          search, 
          getAggs(),
          f ? setFilters(f, field) : {}
        )
        : Object.assign({}, search, getAggs(), f ? setFilters(f, field) : {})
    });

    const r = results.hits.hits.map(i => {
      const c = i._source;
      const h = i.highlight;
      return {
        _source: i._source,
        title: hasHighlight(h, c, 'title', 'name' ),
        lead: hasHighlight(h, c, 'leadParagraph'),
        type: setType(i._index),
        _id: i._id,
        k4EventNumber: i._source.k4EventNumber || false,
        access: c.access || false,
        url: c.url || c.canonical,
        image: c.image || false,
        registerButton: c.registerButton || false,
        journal: c.journal_name || false,
        dates: c.eventDates || false,
        location: c.eventLocation || false,
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

    // @TODO refactor this
    const source = 
    a
      ? results.aggregations.source.buckets.reduce((a, i) => {
        // Bucket on index name
        if (i.key.includes('journals')) a.journal = i.doc_count;
        if (i.key.includes('content')) a.web = i.doc_count;
        if (i.key.includes('congress')) a.congress = a.congress + i.doc_count;
        if (i.key.includes('sessions')) a.sessions = i.doc_count;
        if (i.key.includes('presentations')) a.presentations = i.doc_count;
        // Bucket on keyword
        return a;
      }, {
        journal: 0,
        web: 0,
        congress: 0,
        sessions: 0,
        presentations: 0
      })
      : undefined;

    const journals = 
      a
        ? results.aggregations.journals.buckets.reduce((a, i) => {
          // Bucket on index name
          if (i.key.includes('erj')) a.erj = i.doc_count;
          if (i.key.includes('err')) a.err = i.doc_count;
          if (i.key.includes('openres')) a.openres = i.doc_count;
          if (i.key.includes('breathe')) a.breathe = i.doc_count;
          // Bucket on keyword
          return a;
        }, {
          erj: 0,
          err: 0, 
          openres: 0, 
          breathe: 0
        })
        : undefined;
    const all = results.aggregations;
    const aggs = { all, ...source, ...journals };
    return { results: r, aggs, total: results.hits.total };

  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;

const indices = (param, aggs = false) => {
  const i = ['content','journals'];
  const ii = {
    'congress-2018': ['presentations-congress-2018', 'sessions-congress-2018'],
    'congress-2017': ['presentations-congress-2017', 'sessions-congress-2017'],
    'congress-2016': ['presentations-congress-2016', 'sessions-congress-2016'],
    'congress-2015': ['presentations-congress-2015', 'sessions-congress-2015']
  };

  /* eslint-disable indent */
  return param === 'web'
  ? i[0]
  : param === 'journals'
  ? i[1]
  : param.includes('congress')
  ? setIndices(param, ii)
  : aggs && param !== 'all'
  ? `${i.join(',')},${setIndices(param, ii)}`
  : `${i.join(',')},${ii['congress-2018'].join(',')}`; //all "normal" queries
  /* eslint-enable */
};

const query = (query, skip) => {
  return {
    from: skip, 
    query: {
      bool: {
        must_not: {
          term: {
            private: true
          }
        },
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
      all: {
        global : {},
        aggs: {
          source: {
            terms: {
              field: '_index'
            }
          },
          publishers: {
            terms:{
              field: 'publisher.keyword'
            }
          },
          journals: {
            terms:{
              field: 'journal_url.keyword'
            }
          }
        }
      },
      source: {
        terms: {
          field: '_index'
        }
      },
      publishers: {
        terms:{
          field: 'publisher.keyword'
        }
      },
      journals: {
        terms:{
          field: 'journal_url.keyword'
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

function setFilters(filters, field) {

  return { 
    post_filter: {
      bool: {
        should: 
        filters.split(',').map(i => {
          const Obj = {term:{}};
          Obj.term[field] = i;
          return Obj;
        })
      }
    }
  };  
}

function setIndices (string, map) {
  return string.split(',').reduce((a, c, k) => {
    return k === 0
      ? a += map[c].join(',')
      : a += `,${map[c].join(',')}`;
  }, '');
}
