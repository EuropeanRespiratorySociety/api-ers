const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'CME Online',
  find: {
    description: 'Returns list of CME Online Module',
    summary: 'Get list of CME Online Module',
    parameters: [
      params.full,
      params.sortBy,
      params.filterBy,
      params.cmeTypes,
      params.cmeCategories,
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
  create: { //this is for the special post route /contacts/authenticate
    security: [{
      bearer: []
    }],
    description: 'Create a new CME Online Module',
    summary: 'Create a new CME Online Module - Role [admin, cmeModule]',
    parameters: [{ // @TODO #101 : Change with the good JSON   
      name: 'body',
      description: 'credential object',
      required: true,
      schema: {
        properties: {},
        example: {},
        type: 'object'
      },
      in: 'body'
    }],
    responses: {
      '200': responses.success,
      '404': responses.notFound,
      '401': responses.invalidLogin
    },
    produces: ['application/json']
  },
  get: {
    id: 'slug',
    description: 'Returns an object with the content of the cme module based on the slug or alias of the module. Full is set to true by default, it can be overwritten if necessary by setting it to false',
    summary: 'Get a cme module from its slug/alias',
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
