const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'ERS contacts/users [MyERS, MyCRM]',
  find: {
    security: [    {
      bearer: []
    }],
    description: 'Returns ERS contacts - to use this endpoint you need to have a CRM user role', 
    summary: 'Get contacts based on a pattern [admin, crm-user roles]',
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
  post: { //this is for the special post route /contacts/authenticate
    description: 'Checks myERS login credentials and returns the contact details if successful as well as an __API JWT__ token and a __Key 4 Events__ token (used to retrieve the congress calendar). An API user is created based on the ERS user, each time the user logs in the API user is updated if any field has changed, the user\'s permissions is set to __myERS__. <br />the User\'s data is cached (not the token and the rest of the response). When the users changes is myERS profile the cache is busted for that user.', 
    summary: 'Checks login, returns the contact and API token',
    parameters: [
      {        
        name: 'body',
        description: 'credential object',
        required: true,
        schema: {
          properties: {
          },
          example:{
            username: 'myERS username',
            password: 'myERS password'
          },
          type: 'object'
        },
        in: 'body'
      }
    ],
    responses: {
      '200': responses.successMyCRMLogin,
      '404': responses.notFound,
      '401': responses.invalidLogin
    },
    produces: ['application/json']
  },
  get: {
    id: 'contact id',
    security: [{
      bearer: []
    }],
    description: 'Returns a contact object based on the contact id - to use this endpoint you need to have a CRM user role, the user data is cached',
    summary: 'Get a contact based on its id [admin, crm-user, myERS roles]',
    parameters: [
      params.contactId
    ],
    responses: {
      '200': responses.successMyCRMOneItem,
      '404': responses.notFound,
      '401': responses.invalidLogin
    }
  }
};