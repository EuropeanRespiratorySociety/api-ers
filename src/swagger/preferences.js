const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

// The error in the view happen because the responses are missing
module.exports = {
  description: 'Manage user\'s preferences',
  find: {
    description: 'List all preferences of all users. This endpoint is reserved to user with the correct role (Admin)',
    summary: 'list all users [admin role]',
    security: [    {
      bearer: []
    }],
  },
  get: {
    summary: 'Get preferences [owner]',
    security: [    {
      bearer: []
    }]
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
    parameters: [
      params.preferences
    ],
    security: [    {
      bearer: []
    }]
  },
  patch: {
    summary: 'Patch a user\'s preference [owner]',    
    parameters: [
      params.preferences
    ],
    security: [    {
      bearer: []
    }]
  },
  remove: {
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
    produces: ['application/json'],
    security: [    {
      bearer: []
    }]
  }
};