/**
 * Set the query object
 * @param {string} qname - qname of the category to query
 * @param {object} [query] - optional query params (full, format, skip, limit)
 * @param {int} [paginate] - optional default:25
 */
const setQueryParams = (qname, query = {}, paginate = 25) => {
  return {
    qname, 
    full: query.full || false, 
    filterBy: query.filterBy || false,
    format: query.format || 'html',
    skip: parseInt(query.skip) || 0,
    limit: parseInt(query.limit) || paginate
  };
};

module.exports = setQueryParams;