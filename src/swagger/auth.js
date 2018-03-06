// const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: '[API] Authentication service (need to request credentials)',
  post: {
    description: 'Returns a token based on the credentials of the user. These credentials can be obtained by contactin the developper (ERS Webmaster), there are two strategies: local and local-username, of course if the strategy is loca-username change the email to username in the sent object', 
    summary: 'Get a token to authenticate.',
    parameters: [
      {        
        name: 'body',
        description: 'credential object',
        required: true,
        schema: {
          properties: {
          },
          example:{
            strategy: 'local',
            email: 'your@email.com',
            password: 'your-password'
          },
          type: 'object'
        },
        in: 'body'
      }
    ],
    responses: {
      '200': {
        description: 'successful operation',
        schema: {
          type: 'object',
          example:{
            accessToken: '<huge-token-string>',
          }
        }    
      },
      '401': responses.invalidLogin
    },    
    produces: ['application/json']
  }
};