
const { ccParserCategory } = require('../../hooks/cc-parser');
const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');
const { metadata } = require('../../hooks/metadata');

module.exports = {
  before: {
    all: [],
    find: [
      redisBeforeHook()
    ],
    get: [redisBeforeHook()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      ccParserCategory(),
      metadata(),
      hookCache({duration: 3600 * 24 * 7}),
      redisAfterHook()
    ],
    get: [
      hookCache({duration: 3600 * 24 * 7}), // items are parsed in relatives service
      redisAfterHook()],
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
