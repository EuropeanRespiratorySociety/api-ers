const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Get the ERS Calendar',
  find: {
    description: 'Returns the full event calendar of the ERS with internal, external, endorsed events and deadlines. If __no type__ is set, __ERS only events are returned__  <ul><li>For now pagination cannot be trusted as past events are filtered after querying the CMS, this will be improved soon</li></ul>', 
    summary: 'Get calendar items',
    parameters: [
      params.eventType,
      params.filterBy,
      params.full,
      params.format,
      params.reverse,
      params.timeline,
      params.limit,
      params.skip
    ],
    responses: {
      '200': responses.successCalendar,    
      '404': responses.notFound
    }
  }
};