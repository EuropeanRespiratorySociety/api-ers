const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

// The error in the view happen because the responses are missing
module.exports = {
  description: 'Users of the API',
  find: {
    description: 'List all users',
    summary: 'list all users [admin role]',
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    security: [    {
      bearer: []
    }],
  },
  get: {
    summary: 'Get a user [owner]',
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    security: [    {
      bearer: []
    }]
  },
  create: {
    security: [    {
      bearer: []
    }],
    description: 'Creates a new user of the API. Only administrators can create an account.', 
    summary: 'Create a new API user [admin role]',
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
    id: '_id',
    summary: 'Update a user [owner]',
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
    id: '_id',
    summary: 'Patch a user [owner]',
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
    description: 'Remove a user',
    summary: 'Remove a user [owner]',
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    parameters: [{
      name: 'id',
      description: 'Id of the user to delete',
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