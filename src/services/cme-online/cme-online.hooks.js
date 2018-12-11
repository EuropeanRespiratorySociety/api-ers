const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');
const { iff, isProvider } = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');

module.exports = {
  before: {
    all: [],
    find: [
      //redisBeforeHook()
    ],
    get: [
      //redisBeforeHook()
    ],
    create: [],
    update: [],
    patch: [],
    remove: [
      iff(
        isProvider('external'),
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin']
        })
      )]
  },

  after: {
    all: [],
    find: [
       //hookCache({duration: 3600 * 24}), 
       //redisAfterHook()
    ],
    get: [
      //hookCache({duration: 3600 * 24 * 7}), 
      //redisAfterHook()
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
