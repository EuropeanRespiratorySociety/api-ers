const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const { iff, isProvider } = require('feathers-hooks-common');
const addReviewer = require('../../hooks/add-reviewer');
const test = require('../../hooks/test');
const { before, after } = require('../../hooks/training-aggs');

module.exports = {
  before: {
    all: [],
    find: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin', 'myERS']
        }),
        before(),
        test()
      ])
    ],
    get: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin', 'myERS']
        })
      ])
    ],
    create: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin']
        })
      ])
    ],
    update: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin']
        })
      ])
    ],
    patch: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin', 'myERS']
        }),
        addReviewer()
      ])],
    remove: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin']
        })
      ])
    ]
  },

  after: {
    all: [],
    find: [after()],
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
