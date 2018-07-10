const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

// The error in the view happen because the responses are missing
module.exports = {
  description: 'Manage classifier training objects',
  find: {
    description: 'List all training objects',
    summary: 'list all training objects [admin]',
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
    description: 'Get a training object by ID',
    summary: 'Get training object [admin]',
    parameters: [],
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
    description: 'Creates a new training object. The user needs to be a user of the API as the the token will be matched', 
    summary: 'New preference object for a user [admin, training]',
    parameters: [
      params.preferences
    ],
    responses: {
      '201': responses.successTrainingCreated,
      '409': responses.conflict,
      '401': responses.invalidLogin
    },
    produces: ['application/json']
  },
  update: {
    summary: 'Update preferences [admin, training]', 
    description: 'Update a training object by ID',   
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
    summary: 'Patch a training object [admin, training]', 
    description: 'Patch a training object by ID',     
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
    description: 'Remove a training object',
    summary: 'Remove a training object [admin]',
    parameters: [],
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