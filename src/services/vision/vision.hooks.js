const {
  hookCache,
  redisAfterHook,
  redisBeforeHook
} = require('feathers-hooks-rediscache');
const {
  iff
} = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [iff(process.env.CACHE_ENABLED === 'true', redisBeforeHook())],
    get: [iff(process.env.CACHE_ENABLED === 'true', redisBeforeHook())],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [iff(process.env.CACHE_ENABLED === 'true', [hookCache({
      duration: 3600 * 24 * 7
    }), redisAfterHook()])],
    get: [iff(process.env.CACHE_ENABLED === 'true', [hookCache({
      duration: 3600 * 24 * 7
    }), redisAfterHook()])],
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
