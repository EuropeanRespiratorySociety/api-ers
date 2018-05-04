/**
 * Given a filter string, set the filters for diseases and methods
 * @param {string} filter - Airway diseases,Public health
 */
const setFilter = (filter) => {
  /* eslint-disable indent */
  const f = filter ? filter.split(',') : [];
  return f.length > 0 && !f.includes('highlights') && !f.includes('no-highlights') && !f.includes('main-news')
    ? {
        $or: [
          {
            diseases: { 
              $in: f
            }
          },
          {
            methods: {
              $in: f
            }
          }
        ]  
      }
    : f.length > 0 && f.includes('highlights')
    ? {
        'availableOnHomepage' :'true', // this will need to change for a boolean
        'mainNews': {'$ne': true}
      }
    : f.length > 0 && f.includes('no-highlights')
    ? {
        'availableOnHomepage' : { '$ne': 'true'}, // @TODO this will need to change for a boolean
        'mainNews': {'$ne': true}
      }      
    : f.length > 0 && f.includes('main-news')
    ? {
        'mainNews' : true
      }
    : {};
  /* eslint-enable indent */  
};

module.exports = setFilter;