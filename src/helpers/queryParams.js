/**
 * Set the query object
 * @param {string} qname - qname of the category to query
 * @param {object} [query] - optional query params (full, md, skip, limit)
 * @param {int} [paginate] - optional default:25
 */
const setQueryParams = (qname, query = {}, paginate = 25) => {
  return {
    qname, 
    full: query.full || false, 
    md: query.md || false,
    skip: parseInt(query.skip) || 0,
    limit: parseInt(query.limit) || paginate
  };
};

module.exports = setQueryParams;