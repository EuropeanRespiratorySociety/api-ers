const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Relatives',
  find: {
    description: 'Returns the category (node) and its outgoing relatives with the association ers:article. Full is set to false by default for the items, can be set to true if necessary. The category is returns all its data', 
    summary: 'Get articles relative to a node with the node',
    parameters: [
      params.qname,
      params.limit,
      params.skip,
      params.full,
      params.format
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
  },
  patch: {
    security: [    {
      bearer: []
    }],
    description: 'Update some of the properties of the object.',
    summary: 'Updates some of the properties of the object',
    parameters: [
      params.object
    ],
    consumes: [
      'application/json'
    ],
    responses: {
      '200': {
        description: 'sucessful operation',
      },
    }
  }
};