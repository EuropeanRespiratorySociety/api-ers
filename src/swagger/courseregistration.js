const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  post: { //this is for the special post route /contacts/registrations
    security: [    {
      bearer: []
    }],
    description: 'Returns all registrations for a contact. The contact is retrieved by its contact id - to use this endpoint you need to have a CRM user role', 
    summary: '(MyCRM) Returns all registrations for a contact',
    parameters: [
      params.id
    ],
    responses: {
      '200': responses.successMyCRM,
      '404': responses.notFound,
      '401': responses.invalidLogin
    },
    produces: ['application/json']
  }
};