// const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Recommend',
  find: {
    description: 'Returns recommendations based on what is passed',
    summary: 'Get recommended articles',
    parameters: [
      // params.qname,
      // params.full,
      // params.format,
      // params.limit,
      // params.skip
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  }
};