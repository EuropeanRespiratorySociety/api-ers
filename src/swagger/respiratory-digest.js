const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

module.exports = {
  description: 'Respiratory digest',
  find: {
    description: 'Returns list of respiratory digest',
    summary: 'Get list of respiratory digest',
    parameters: [
      params.full,
      params.sortBy,
      {
        name: 'filterBy',
        description: `Allows to filter content based on diseases and methods:
        <ul>
          <li>chain the diseases and methods that are needed separated by a comma: Airway diseases,Public health</li>
        <ul>
        __Note__: this filter is now generic an matches only methods and diseases, it could also match other fields. If for better filtering, other otpions are needed do not hesitate to contact the developer.
        <pre><code>
          ?filterBy=Airway diseases,Public health
        </code></pre>
        `,
        required: false,
        allowMultiple: false,
        type: 'string',
        in: 'query'
      },
      params.direction,
      params.format,
      params.limit,
      params.skip,
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json']
  },
  get: {
    id: 'slug',
    description: 'Returns an object with the content of the respiratory digest on the slug or alias of the article. Full is set to true by default, it can be overwritten if necessary by setting it to false',
    summary: 'Get a respiratory digest from its slug/alias',
    parameters: [
      params.slug,
      params.full,
      params.format
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
