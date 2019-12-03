const {
  hookCache,
  redisAfterHook,
  redisBeforeHook
} = require('feathers-hooks-rediscache');
const {
  oneArticle,
  manyArticle
} = require('../../hooks/add-journal-article');
const {
  iff
} = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [
      iff(process.env.CACHE_ENABLED === 'true', redisBeforeHook())
    ],
    get: [iff(process.env.CACHE_ENABLED === 'true', redisBeforeHook())],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      manyArticle(),
      iff(process.env.CACHE_ENABLED === 'true', [hookCache({
        duration: 3600 * 24
      }),
      redisAfterHook()
      ])
    ],
    get: [
      oneArticle(),
      iff(process.env.CACHE_ENABLED === 'true', [hookCache({
        duration: 3600 * 24 * 7
      }),
      redisAfterHook()
      ])
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
