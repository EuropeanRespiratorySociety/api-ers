const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'ERS Contacts (MyCRM)',
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
  post: { //this is for the special post route /contacts/checklogin
    security: [    {
      bearer: []
    }],
    description: 'Checks myERS login credentials and returns the contact details if successful', 
    summary: 'Checks login, returns the contact',
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
    description: 'Returns a contact object based on the contact id - to use this endpoint you need to have a CRM user role',
    summary: 'Get a contact based on its id [admin, crm-user roles]',
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