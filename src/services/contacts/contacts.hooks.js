const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const { iff, isProvider } = require('feathers-hooks-common');
const { crmAuth } = require('../../hooks/crmAuth');
const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');

module.exports = {
  before: {
    all: [ 
      crmAuth(), 
      iff(isProvider('external'), [
        authenticate('jwt'), 
        checkPermissions({
          roles: ['admin:*']
        }),
        redisBeforeHook()
      ])
    ],
    find: [ 
      crmAuth(), 
      iff(isProvider('external'), [
        authenticate('jwt'), 
        checkPermissions({
          roles: ['admin:*', 'crm-user:*']
        }),
        redisBeforeHook()
      ])
    ],
    get: [ 
      crmAuth(), 
      iff(isProvider('external'), [
        authenticate('jwt'), 
        checkPermissions({
          roles: ['admin:*', 'crm-user:*, myERS:*']
        }),
        redisBeforeHook()
      ])
    ],
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
