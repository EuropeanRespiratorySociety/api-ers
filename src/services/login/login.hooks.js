const {
  crmAuth
} = require('../../hooks/crmAuth');
const crmInterests = require('../../hooks/crm-interests');
// const { hookCache, redisAfterHook, redisBeforeHook } = require('feathers-hooks-rediscache');

module.exports = {
  before: {
    all: [
      crmAuth(),
      crmInterests()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
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
