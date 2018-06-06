const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');
const { oneArticle, manyArticle } = require('../../hooks/add-journal-article');

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
      manyArticle(),
      hookCache({duration: 3600 * 24}), 
      redisAfterHook()
    ],
    get: [
      oneArticle(),
      hookCache({duration: 3600 * 24 * 7}), 
      redisAfterHook()
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
