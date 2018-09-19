const { crmAuth } = require('../../hooks/crmAuth');
const sort = require('../../hooks/sort-interests');
const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');

module.exports = {
  before: {
    all: [],
    find: [
      redisBeforeHook(),
      crmAuth()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      sort(),
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
