const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Get the ERS Calendar',
  find: {
    description: 'Returns the full event calendar of the ERS with internal, external, endorsed events and deadlines. If __no type__ is set, __ERS only events are returned__', 
    summary: 'Get calendar items',
    parameters: [
      params.eventType,
      params.limit,
      params.skip,
      params.full
    ],
    responses: {
      '200': responses.successCalendar,    
      '404': responses.notFound
    }
  }
};