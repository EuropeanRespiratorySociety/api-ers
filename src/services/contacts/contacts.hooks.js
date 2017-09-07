const { authenticate } = require('feathers-authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const { iff, isProvider } = require('feathers-hooks-common');
const { crmAuth } = require('../../hooks/crmAuth');

module.exports = {
  before: {
    all: [ 
      crmAuth(), 
      iff(isProvider('external'), [
        authenticate('jwt'), 
        restrictToRoles({
          roles: ['admin', 'crm-user'],
          fieldName: 'permissions'
        })
      ])
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
