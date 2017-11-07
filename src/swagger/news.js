const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Get ERS news',
  find: {
    description: 'This enpoint is the news feed of the ERS. Every thing that is published as a news is returned by it', 
    summary: 'This method is now deprecated', 
    parameters: [
      params.limit,
      params.skip,
      params.full,
      params.markdown
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  }
};