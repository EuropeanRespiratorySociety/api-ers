const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Respiratory Matters Blog',
  find: {
    description: 'Returns all the article of the Respiratory Matters Blog', 
    summary: 'Get articles relative to a node with the node',
    parameters: [
      params.format,
      params.full,
      params.limit,
      params.skip
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