const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'ERS Vision',
  find: {
    description: 'Returns all the article and video from ERS Vision', 
    summary: 'Get ERS Vision items',
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
    description: 'Returns a video from ERS Vision with all the associated text',
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