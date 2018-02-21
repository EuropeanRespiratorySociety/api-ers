const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

// The error in the view happen because the responses are missing
module.exports = {
  description: 'Webhook - mostly for internal use',
  find: {
    description: 'The webhook is used for notifications, cache invalidation messaging, start processes such as indexing, importing, etc... The webhook is meant mostly for internal use. If you think you need to use it, please contact the developer.',
    summary: 'Handle a webhook payload [admin role]',
    responses: {
      '200': responses.success,
      '404': responses.notFound,
      '401': responses.invalidLogin
    },
    security: [    {
      bearer: []
    }],
  },
  create: {
    security: [    {
      bearer: []
    }],
    description: 'The webhook is used for notifications, cache invalidation messaging, start processes such as indexing, importing, etc... The webhook is meant mostly for internal use. If you think you need to use it, please contact the developer.',
    summary: 'Handle a webhook payload [admin role]',
    parameters: [
      params.user
    ],
    responses: {
      '201': responses.success,
      '409': responses.conflict,
      '401': responses.invalidLogin
    },
    produces: ['application/json']
  },
};