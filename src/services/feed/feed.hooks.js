const {
  ccParserCategory
} = require('../../hooks/cc-parser');
const {
  hookCache,
  redisAfterHook,
  redisBeforeHook
} = require('feathers-hooks-rediscache');
const {
  metadata
} = require('../../hooks/metadata');
const {
  iff
} = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [
      iff(process.env.CACHE_ENABLED === 'true', redisBeforeHook())
    ],
    get: [],
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
      iff(process.env.CACHE_ENABLED === 'true', [hookCache({
        duration: 3600 * 24 * 7
      }),
      redisAfterHook()
      ])
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
