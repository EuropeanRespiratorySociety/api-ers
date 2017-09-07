const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');

module.exports = {
  before: {
    all: [],
    find: [redisBeforeHook()],
    get: [redisBeforeHook()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [hookCache({duration: 3600 * 24 * 7}), redisAfterHook()],
    get: [hookCache({duration: 3600 * 24 * 7}), redisAfterHook()],
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
