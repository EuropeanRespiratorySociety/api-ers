const { authenticate } = require('@feathersjs/authentication').hooks;
const { when, discard, iff, isProvider }= require('feathers-hooks-common');
const { restrictToOwner, restrictToRoles } = require('feathers-authentication-hooks');
const checkIsAdmin = require('../../hooks/check-is-admin');

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
      restrictToRoles({
        roles: ['admin'],
        fieldName: 'permissions'
      }) 
    ],
    get: [ ...restrict ],
    create: [ 
      authenticate('jwt'),
      restrictToRoles({
        roles: ['admin'],
        fieldName: 'permissions'
      }),
      hashPassword(),

    ],
    update: [ ...restrict, hashPassword() ],
    patch: [ 
      iff(isProvider('external'), ...restrict, checkIsAdmin()), 
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
