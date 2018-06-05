const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'ERS App Highlights',
  find: {
    description: 'Returns all Highlight content for the App', 
    summary: '',
    parameters: [
      params.full,
      params.format,
      params.skip,
      params.limit
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  },
  get: {
    id: 'slug',
    description: 'Returns a highlight object based on the slug or alias of the article. Full is set to true by default, it can be overridden if necessary by setting it to false',
    summary: 'Get a course from its slug/alias',
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