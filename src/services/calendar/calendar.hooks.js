const prepareCalendar = require('../../hooks/prepare-calendar');
// const { iff } = require('feathers-hooks-common');
const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');

module.exports = {
  before: {
    all: [],
    find: [redisBeforeHook()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      hookCache({duration: 3600 * 24 * 7}), 
      redisAfterHook(),
      prepareCalendar()
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
