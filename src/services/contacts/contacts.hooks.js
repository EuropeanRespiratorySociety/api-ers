const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const { iff, isProvider } = require('feathers-hooks-common');
const { crmAuth, verifyUser } = require('../../hooks/crmAuth');
const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');
// const { restrictToOwner } = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [],
    find: [ 
      crmAuth(), 
      iff(isProvider('external'), [
        authenticate('jwt'), 
        checkPermissions({
          roles: ['admin', 'crm-user']
        }),
        redisBeforeHook()
      ])
    ],
    get: [ 
      crmAuth(), 
      iff(isProvider('external'), [
        authenticate('jwt'),
        verifyUser(),
        checkPermissions({
          roles: ['admin', 'crm-user', 'myERS']
        })
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
