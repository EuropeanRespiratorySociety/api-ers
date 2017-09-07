const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'ERS Countries (MyCRM)',
  find: {
    security: [    {
      bearer: []
    }],
    description: 'Returns ERS countries - to use this endpoint you need to have a CRM user role', 
    summary: 'Get all countries',
    parameters: [
      params.pattern
    ],
    responses: {
      '200': responses.successMyCRM,
      '404': responses.notFound,
      '401': responses.invalidLogin
    },
    produces: ['application/json']
  },
  get: {
    security: [    {
      bearer: []
    }],
    id: 'contact id',
    description: 'Returns a country object based on its id - to use this endpoint you need to have a CRM user role',
    summary: 'Get a contact based on its id',
    parameters: [
      params.contactId
    ],
    responses: {
      '200': {
        description: 'sucessful operation',
        schema: {
          type: 'object',
          example: {
            data: {},
            cache: {
              cached: true,
              duration: 'int',
              expires_on: 'string',
              key: 'string'
            },
            status: 200
          }
        }
      },
      '404': responses.notFound,
      '401': responses.invalidLogin
    }
  }
};