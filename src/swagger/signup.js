const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Alias endpoint',
  create: {
    security: [    {
      bearer: []
    }],
    description: 'Creates a new user of the API. Administrator role mendatory.', 
    summary: 'Create a new API user',
    parameters: [
      params.user
    ],
    responses: {
      '201': responses.successUserCreated,
      '409': responses.conflict,
      '401': responses.invalidLogin
    },
    produces: ['application/json']
  }
};