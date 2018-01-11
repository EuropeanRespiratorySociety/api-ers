// const params = require('./helpers/parameters');
// const responses = require('./helpers/responses');

module.exports = {
  description: 'GraphQl endpoints',
  post: {
    description: 'Query the whole api with graphQl', 
    summary: 'GraphQL endpoint',
    parameters: [
      {        
        name: 'query',
        description: 'graphQL document',
        required: true,
        schema: {
          properties: {
          },
          example:{
            query: 'query($slug: String!){article(slug:$slug) {title}}',
            variables: {slug: 'sleep-and-breathing-2017-highlights'}
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
            data: {
              article: {
                title: 'Sleep and Breathing 2017: highlights'
              }
            }
          }
        }    
      },
      '401': {
        errors: [
          {
            message: 'Cannot query field "aricle" on type "RootQuery". Did you mean "article"?',
            locations: [
              {
                line: 1,
                column: 22 
              }
            ]
          }
        ]
      }
    },    
    produces: ['application/json']
  },
  get: {
    description: 'Test all GraphQL requests with the visual interface GraphiQL. It let\'s you easily build requests.', 
    summary: 'GraphiQL endpoint',
  }   
};