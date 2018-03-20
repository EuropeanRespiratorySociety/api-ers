// const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

// The error in the view happen because the responses are missing
module.exports = {
  description: 'Search (Alpha)',
  find: {
    description: 'Search - search across all indices or configure wich one to search',
    summary: 'Search (not all indices enabled)',
    parameters: [
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    }
  }
};