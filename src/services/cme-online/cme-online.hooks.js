/*eslint-disable */
// const {
//   hookCache,
//   redisAfterHook,
//   redisBeforeHook
// } = require('feathers-hooks-rediscache');
const {
  iff,
  isProvider
} = require('feathers-hooks-common');
const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const {
  ccParserListItems,
  ccParserItem
} = require('../../hooks/cmeOnline-parser');
const {
  metadata
} = require('../../hooks/metadata');

module.exports = {
  before: {
    all: [],
    find: [
      // redisBeforeHook()
    ],
    get: [
      // redisBeforeHook()
    ],
    create: [iff(
      isProvider('external'),
      authenticate('jwt'),
      checkPermissions({
        roles: ['admin', 'cloudcms:cme']
      })
    )],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      ccParserListItems(),
      metadata()
      // hookCache({
      //   duration: 3600 * 24
      // }),
      // redisAfterHook()
    ],
    get: [
      //iff(hook => !hook.result.cache, [ccParserItem()]),
      ccParserItem()
      // hookCache({
      //   duration: 3600 * 24 * 7
      // }),
      // redisAfterHook()
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
