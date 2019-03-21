/**
 * Given a filter string, set the filters for diseases and methods
 * @param {string} filter - Airway diseases,Public health
 */
const setFilter = (filter) => {
  /* eslint-disable indent */
  const f = filter ? filter.split(',').map(item => item.trim()) : [];
  return f.length > 0 && !f.includes('highlights') && !f.includes('no-highlights') && !f.includes('main-news') ? {
      $or: [{
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
    } :
    f.length > 0 && f.includes('highlights') ? {
      'availableOnHomepage': 'true', // this will need to change for a boolean
      'mainNews': {
        '$ne': true
      }
    } :
    f.length > 0 && f.includes('no-highlights') ? {
      'availableOnHomepage': {
        '$ne': 'true'
      }, // @TODO this will need to change for a boolean
      'mainNews': {
        '$ne': true
      }
    } :
    f.length > 0 && f.includes('main-news') ? {
      'mainNews': true
    } : {};
  /* eslint-enable indent */
};

/**
 * Set the filters for diseases and methods, Cme Type and Category
 * @param {string} interest - Airway diseases,Public health
 * @param {string} type - Case or Topic
 * @param {string} categories - COPD
 */
const setCmeOnlineFilter = (interest, type, categories) => {
  let filters = setFilter(interest);
  if (type) {
    filters['cmeType'] = type;
  }
  if (categories) {
    filters['cmeCategories'] = {
      $in: categories.split(',').map(item => item.trim())
    };
  }
  return filters;
};

module.exports = {
  setFilter,
  setCmeOnlineFilter
};
