/*eslint-disable */
const {
  hookCache,
  redisAfterHook,
  redisBeforeHook
} = require('feathers-hooks-rediscache');
const {
  iff,
  isProvider
} = require('feathers-hooks-common');
const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const {
  ccParserCategory,
  ccParserItem
} = require('../../hooks/cc-parser');
const {
  metadata
} = require('../../hooks/metadata');

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
      // iff(
      //   isProvider('external'),
      //   authenticate('jwt'),
      //   checkPermissions({
      //     roles: ['admin']
      //   })
      // )
    ]
  },

  after: {
    all: [],
    find: [
      ccParserCategory()
      //hookCache({duration: 3600 * 24}), 
      //redisAfterHook()
    ],
    get: [
      ccParserItem()
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
