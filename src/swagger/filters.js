const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Built URL Filters ',
  get: {
    id: 'endpoint',
    description: 'Returns ready to use filters for an endpoint as full url. The response returns two types of filters: users and system. The system filters do not have a label as they are not meant for users but rather to return specific data to display somewhere else',
    summary: 'Get available filters for an endpoint',
    parameters: [
      params.endpoint
    ],
    responses: {
      '200': {
        description: 'sucessful operation',
        schema: {
          type: 'object',
          example: {
            filters: {
              user: [
                {
                  url: 'string',
                  label: 'string',
                  filter: 'string',
                }
              ],
              system: []
            },  
            _sys: {
              status: 'int'
            }
          }
        }
      },
      '204': responses.successNoResult,
      '404': responses.notFound
    },
    produces: ['application/json']
  }
};