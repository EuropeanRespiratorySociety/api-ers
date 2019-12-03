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
  ccParserListItems,
  ccParserItem
} = require('../../hooks/cmeOnline-parser');
const {
  metadata
} = require('../../hooks/metadata');

module.exports = {
  before: {
    all: [],
    find: [
      iff(process.env.CACHE_ENABLED === "true", redisBeforeHook())
    ],
    get: [
      iff(process.env.CACHE_ENABLED === "true", redisBeforeHook())
    ],
    create: [iff(
      isProvider('external'),
      authenticate('jwt'),
      checkPermissions({
        roles: ['admin', 'cloudcms:cme']
      })
    )],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      ccParserListItems(),
      metadata(),
      iff(process.env.CACHE_ENABLED === "true", [hookCache({
          duration: 3600 * 24
        }),
        redisAfterHook()
      ])
    ],
    get: [
      iff(process.env.CACHE_ENABLED === "true", [iff(hook => !hook.result.cache, ccParserItem()), hookCache({
          duration: 3600 * 24
        }),
        redisAfterHook()
      ]).else(ccParserItem())
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
