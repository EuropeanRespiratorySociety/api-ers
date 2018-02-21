const params = require('./helpers/parameters');
const responses = require('./helpers/responses');

// The error in the view happen because the responses are missing
module.exports = {
  description: 'Congress Programme',
  find: {
    description: 'List all sessions of the congress, the year param or the K4 events is required in order list content from only one congress.<br><br>__important__: this service let you add any property as parameter, this allows for filtering based on a property. it is recommended to use the `year=2018` or the `k4EventNumber=90` to filter the events as the database stores all of our events.<br><br>Any property can be used to __filter__ items. It is used as follow: `?$sort[startTimeDate]=1` ascending: 1, descending: -1<br><br>__Typical request__: `/presentations?sessionID=5554&$sort[startDateTime]=1`<br><br>The parameter `$select` can be used to return only the properties of interest: `&$select[]=Content` the interal `_id` and only the `Content` property will be returned',
    summary: 'list congress sessions',
    responses: {
      '200': responses.successProgramme,
      '404': responses.notFound
    }
  },
  get: {
    summary: 'Get a session',
    responses: {
      '200': responses.successProgrammeItem,
      '404': responses.notFound
    }
  },
  create: {
    security: [    {
      bearer: []
    }],
    description: 'Creates a new sessions', 
    summary: 'Create a new sessions [admin role]',
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
    summary: 'Update a session [admin role]',
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
    summary: 'Patch a session [admin role]',
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
    description: 'Remove a session',
    summary: 'Remove a sessions [admin role]',
    responses: {
      '200': responses.success,
      '404': responses.notFound
    },
    parameters: [{
      name: 'id',
      description: 'Id of the session to delete',
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