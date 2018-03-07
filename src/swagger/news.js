const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Get ERS news',
  find: {
    description: 'This enpoint is the news feed of the ERS. Every thing that is published as a news is returned by it', 
    summary: 'Get all ordered news', 
    parameters: [
      params.full,
      params.sortBy,
      params.filterBy,
      params.direction,
      params.format,
      params.limit,
      params.skip,
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  },
  get: {
    id: 'slug',
    description: 'Returns an object with the content of the article based on the slug or alias of the article. Full is set to true by default, it can be overwritten if necessary by setting it to false',
    summary: 'Get an article from its slug/alias',
    parameters: [
      params.slug,
      params.full,
      params.format
    ],
    responses: {
      '200': {
        description: 'sucessful operation',
        schema: {
          type: 'object',
          example: {
            data: {},
            status: 200
          }
        }
      },
      '404': responses.notFound
    }
  }
};