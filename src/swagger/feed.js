const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Get all content',
  find: {
    description: 'All content of the CMS returned chronologically and by type', 
    summary: 'Get all content', 
    parameters: [
      params.contentModel,
      params.sortBy,
      params.direction,
      params.full,
      params.format,
      params.limit,
      params.skip,
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  }
};