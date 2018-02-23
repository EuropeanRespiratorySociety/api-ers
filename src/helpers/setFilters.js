/**
 * Given a filter string, set the filters for diseases and methods
 * @param {string} filter - Airway diseases,Public health
 */
const setFilter = (filter) => {
  /* eslint-disable indent */
  const f = filter ? filter.split(',') : [];
  return f.length > 0
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
    : {};
  /* eslint-enable indent */  
};

module.exports = setFilter;