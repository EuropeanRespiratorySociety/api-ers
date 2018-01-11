const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

// The error in the view happen because the responses are missing
module.exports = {
  description: 'Manage user\'s preferences',
  find: {
    description: 'List all preferences of all users. This endpoint is reserved to user with the correct role (Admin)',
    summary: 'list all users [admin role]',
    parameters:[],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    security: [    {
      bearer: []
    }],
    produces: ['application/json']
  },
  get: {
    id: '_id',
    description: 'Get a user\'s preferences by user ID',
    summary: 'Get preferences [owner]',
    parameters: [{
      name: 'apiUserId',
      description: 'user id of the preferences to delete',
      required: true,
      allowMultiple: false,
      type: 'string',
      in: 'path' }
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    security: [    {
      bearer: []
    }],
    produces: ['application/json']
  },
  create: {
    security: [    {
      bearer: []
    }],
    description: 'Creates a new preference object for a user. The user needs to be a user of the API as the the token will be matched', 
    summary: 'New preference object for a user [owner]',
    parameters: [
      params.preferences
    ],
    responses: {
      '201': responses.successPreferencesCreated,
      '409': responses.conflict,
      '401': responses.invalidLogin
    },
    produces: ['application/json']
  },
  update: {
    summary: 'Update preferences [owner]', 
    description: 'Update user\'s preference by ID',   
    parameters: [
      params.preferences
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    security: [    {
      bearer: []
    }],
    produces: ['application/json']
  },
  patch: {
    id: '_id',
    summary: 'Patch a user\'s preference [owner]', 
    description: 'Patch user\'s preference by ID',     
    parameters: [
      params.preferences
    ],
    responses: {
      '201': responses.successPreferencesCreated,
      '409': responses.conflict,
      '401': responses.invalidLogin
    },
    security: [{
      bearer: []
    }],
    produces: ['application/json']
  },
  remove: {
    id: '_id',
    description: 'Remove a preference object',
    summary: 'Remove a preference object [owner]',
    parameters: [{
      name: 'apiUserId',
      description: 'user id of the preferences to delete',
      required: true,
      allowMultiple: false,
      type: 'string',
      in: 'path' }
    ],
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    produces: ['application/json'],
    security: [    {
      bearer: []
    }]
  }
};