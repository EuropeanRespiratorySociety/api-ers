// const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Authentication service (need to request credentials)',
  post: {
    description: 'Returns a token based on the credentials of the user. These credentials can be obtained by contactin the developper (ERS Webmaster)', 
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
            data: {
              _id: 'your-id-string',
              email: 'your@email.com',
              permissions: 'registered',
              __v: 0
            }
          }
        }    
      },
      '401': responses.invalidLogin
    },    
    produces: ['application/json']
  }
};