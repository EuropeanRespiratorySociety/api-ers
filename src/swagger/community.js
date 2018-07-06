const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Get post for the app community',
  find: {
    description: 'All posts for the community, ordered by created date, this endpoint is not cached, it can be enabled', 
    summary: 'Get (spotme) community posts', 
    parameters: [
      params.sortBy,
      params.direction,
      params.format,
      params.limit,
      params.skip,
    ],
    responses: {
      '200': responses.successCommunity,
      '404': responses.notFound
    },
    produces: ['application/json']
  }
};