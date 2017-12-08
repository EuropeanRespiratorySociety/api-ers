const responses = require('./helpers/responses');

module.exports = {
  description: 'ERS Interests',
  find: {
    description: 'Returns all ERS Interests, interests are divided in diseases and methods. This endpoint can be used to implement intrests screens for a user.', 
    summary: 'Get all intersts and their limits',
    parameters: [
    ],
    responses: {
      '200': responses.successInterests,
      '404': responses.notFound
    },
    produces: ['application/json']
  }
};