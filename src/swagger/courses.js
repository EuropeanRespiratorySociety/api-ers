const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'ERS Courses',
  find: {
    description: 'Returns all ERS courses', 
    summary: 'Get all courses and the category description',
    parameters: [
      params.limit,
      params.skip,
      params.full,
      params.courseType
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  },
  get: {
    id: 'slug',
    description: 'Returns a course object based on the slug or alias of the article. Full is set to true by default, it can be overridden if necessary by setting it to false',
    summary: 'Get a course from its slug/alias',
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