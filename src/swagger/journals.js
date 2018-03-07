const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

// The error in the view happen because the responses are missing
module.exports = {
  description: 'Journals [Beta]',
  find: {
    description: 'List journals articles, only abstracts. Mainly ERS Journals such as the _European Respiratory Journal_, _Breathe_, the _European Respiratory Review_, the _ERJ Open Research_, but also related abstracts from a series of medical journals.',
    summary: 'list Journals articles (abstracts)',
    parameters: [
      params.$any,
      params.$limit,
      params.$skip,
      params.$sort,
      params.$select,
      params.$lt,
      params.$gt,
      params.$in,
      params.$or,
      params.$ne
    ],
    responses: {
      '200': responses.successProgramme,
      '404': responses.notFound
    }
  },
  get: {
    summary: 'Get a journal abstract',
    id: '_id',
    responses: {
      '200': responses.successProgrammeItem,
      '404': responses.notFound
    }
  },
  create: {
    security: [    {
      bearer: []
    }],
    description: 'Creates a new journal abstract', 
    summary: 'Create a new journal abstract [admin role]',
    parameters: [
      params.user
    ],
    responses: {
      '201': responses.successUserCreated,
      '409': responses.conflict,
      '401': responses.invalidLogin
    },
    produces: ['application/json']
  },
  update: {
    id: 'id',
    summary: 'Update a journal abstract [admin role]',
    parameters:[],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    security: [    {
      bearer: []
    }]
  },
  patch: {
    id: 'id',
    summary: 'Patch a journal abstract [admin role]',
    parameters:[],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    security: [    {
      bearer: []
    }]
  },
  remove: {
    description: 'Remove a journal abstract',
    summary: 'Remove a journals [admin role]',
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    parameters: [{
      name: '_id',
      description: 'Id of the abstract to delete',
      required: true,
      allowMultiple: false,
      type: 'string',
      in: 'path' }
    ],
    produces: ['application/json'],
    security: [    {
      bearer: []
    }]
  }
};