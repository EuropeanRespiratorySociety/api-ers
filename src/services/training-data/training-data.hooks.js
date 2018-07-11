const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const { iff, isProvider } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin', 'training']
        })
      ])
    ],
    get: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin', 'training']
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
          roles: ['admin', 'training']
        })
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
