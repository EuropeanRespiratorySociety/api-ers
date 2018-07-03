// const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Notification',
  create: {
    description: 'Receives a Cloud CMS object and submits a notification to the app', 
    summary: 'Send a notification',
    parameters: [
    ],
    responses: { 
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  }
};