const { crmAuth } = require('../../hooks/crmAuth');
const crmInterests = require('../../hooks/crm-interests');
// const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');

module.exports = {
  before: {
    all: [
      crmAuth(),
      crmInterests(), 
      // redisBeforeHook()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      // hookCache({ duration: 3600 * 24 }), 
      // redisAfterHook()
    ],
    find: [],
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
