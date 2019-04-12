const {
  iff
} = require('feathers-hooks-common');
const {
  ccParserListItems,
  ccParserItem
} = require('../../hooks/digest-parser');
const {
  hookCache,
  redisAfterHook,
  redisBeforeHook
} = require('feathers-hooks-rediscache');
const {
  metadata
} = require('../../hooks/metadata');

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
      ccParserListItems(),
      metadata(),
      hookCache({
        duration: 3600 * 24 * 7
      }),
      redisAfterHook()
    ],
    get: [
      iff(hook => !hook.result.cache, [ccParserItem()]),
      hookCache({
        duration: 3600 * 24 * 7
      }),
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
