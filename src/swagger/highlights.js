const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'ERS highlights',
  find: {
    description: 'This enpoint is the highlight feed of the ERS. Everything that has been highlighted (manual curration) is returned. The first news, regardless of its publication date is a news that has the property __mainNews__ set to __true__, normally there is only one of such news.', 
    summary: 'Get ERS highlights', 
    parameters: [
      params.limit,
      params.skip,
      params.format
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  },
  get: {
    id: 'slug',
    description: 'Returns an object with the content of the article based on the slug or alias of the article. Full is set to true by default, it can be overwritten if necessary by setting it to false',
    summary: 'Get an article from its slug/alias',
    parameters: [
      params.slug,
      params.full
    ],
    responses: {
      '200': {
        description: 'sucessful operation',
        schema: {
          type: 'object',
          example: {
            data: {},
            status: 200
          }
        }
      },
      '404': responses.notFound
    }
  }
};