const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');

module.exports = {
  before: {
    all: [redisBeforeHook()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [hookCache({duration: 3600 * 24 * 7 * 52}), redisAfterHook()],
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
