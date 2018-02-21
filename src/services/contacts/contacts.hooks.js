const { authenticate } = require('@feathersjs/authentication').hooks;
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
          roles: ['admin', 'crm-user', 'myERS'],
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
    ],
    find: [      
      hookCache({ duration: 3600 * 24 * 7 }), 
      redisAfterHook()
    ],
    get: [
      hookCache({ duration: 3600 * 24 * 7 }), 
      redisAfterHook()
    ],
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
