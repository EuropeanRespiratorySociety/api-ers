module.exports = {
  description: 'Get the ERS metanavigation',
  find: {
    description: 'returns the html and css to integrate the "metanavigation" a navigation that is common to ERS websites. [Find out more...](https://github.com/EuropeanRespiratorySociety/ERSTemplate-dev)',
    summary: 'Get the metanavigation',
    parameters:[],
    responses: {
      '200': {
        description: 'successful operation',
        schema: {
          type: 'object',
          example: {
            menu: 'html string',
            status: 200
          }
        },
      },
      '404': {
        description: 'not found',
        schema: {
          type: 'string'
        }
      }
    },
    produces: ['application/json']
  }
}; 