const { authenticate } = require('feathers-authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const { iff, isProvider } = require('feathers-hooks-common');
const { crmAuth } = require('../../hooks/crmAuth');
const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');

module.exports = {
  before: {
    all: [ 
      crmAuth(), 
      iff(isProvider('external'), [
        authenticate('jwt'), 
        restrictToRoles({
          roles: ['admin', 'crm-user'],
          fieldName: 'permissions'
        }),
        redisBeforeHook()
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
    all: [
      hookCache({ duration: 3600 * 24 * 7 }), 
      redisAfterHook()
    ],
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
