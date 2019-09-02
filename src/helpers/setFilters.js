/**
 * Given a filter string, set the filters for diseases and methods
 * @param {string} filter - Airway diseases,Public health
 * highlights - no-highlights - main-news are independant filter, you can choose just one
 * available seat and interests can be combine with the others filters
 */
const setFilter = filter => {
  /* eslint-disable indent */
  let f = filter ? filter.split(',').map(item => item.trim()) : [];
  let buildFilter = {};

  if (f.includes('highlights')) {
    buildFilter = {
      availableOnHomepage: 'true',
      mainNews: {
        $ne: true
      }
    };
    f = arrayRemove(f, 'highlights');
  } else if (f.includes('no-highlights')) {
    buildFilter = {
      availableOnHomepage: {
        $ne: 'true'
      },
      mainNews: {
        $ne: true
      }
    };
    f = arrayRemove(f, 'no-highlights');
  } else if (f.includes('main-news')) {
    buildFilter = {
      mainNews: true
    };
    f = arrayRemove(f, 'main-news');
  }
  if (f.includes('available-seat')) {
    buildFilter = {
      ...buildFilter,
      ...{
        'fullyBooked': {
          $ne: true
        }
      }
    };
    f = arrayRemove(f, 'available-seat');
  }
  if (f.length > 0) {
    buildFilter = {
      ...buildFilter,
      ...{
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
      }
    };
  }
  return buildFilter;
};

/**
 * Set the filters for diseases and methods, Cme Type and Category
 * @param {string} interest - Airway diseases,Public health
 * @param {string} type - Case or Topic
 * @param {string} categories - COPD
 */
const setCmeOnlineFilter = (interest, types, categories) => {
  let filters = setFilter(interest);
  if (types) {
    filters['cmeType'] = {
      $in: types.split(',').map(item => item.trim())
    };
  }
  if (categories) {
    filters['cmeCategories'] = {
      $in: categories.split(',').map(item => item.trim())
    };
  }
  return filters;
};

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });

}

module.exports = {
  setFilter,
  setCmeOnlineFilter
};
