const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Publications',
  find: {
    description: 'Returns all ERS publications, the link to the actual publication is available in the property \'externalLink\'', 
    summary: 'Get publications',
    parameters: [
      params.limit,
      params.skip,
      params.full
    ],
    responses: { 
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  },
  get: {
    id: 'slug',
    description: 'Returns the description of one publication based on its slug. The link to the actual publication is available in the property \'externalLink\'',
    summary: 'Get an article from its slug/alias',
    parameters: [
      params.slug,
      params.full,
      params.markdown
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