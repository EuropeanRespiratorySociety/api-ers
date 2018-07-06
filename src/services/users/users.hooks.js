const { authenticate } = require('@feathersjs/authentication').hooks;
const { when, discard, iff, isProvider }= require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const checkPermissions = require('feathers-permissions');
// const checkIsAdmin = require('../../hooks/check-is-admin');

const { hashPassword } = require('@feathersjs/authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
];

module.exports = {
  before: {
    all: [],
    find: [ 
      authenticate('jwt'), 
      checkPermissions({
        roles: ['admin']
      }) 
    ],
    get: [ ...restrict ],
    create: [ 
      authenticate('jwt'),
      checkPermissions({
        roles: ['admin']
      }),
      hashPassword(),

    ],
    update: [ ...restrict, hashPassword() ],
    patch: [ 
      iff(
        isProvider('external'),
        authenticate('jwt'),
        checkPermissions({
          roles: ['admin']
        })
      ), 
      hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      when(
        hook => hook.params.provider,
        discard('password')
      )
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
