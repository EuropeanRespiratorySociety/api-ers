const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider }= require('feathers-hooks-common');
const { restrictToRoles } = require('feathers-authentication-hooks');

const restrict = [ 
  authenticate('jwt'), 
  restrictToRoles({
    roles: ['admin'],
    fieldName: 'permissions'
  }) 
];

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [iff(isProvider('external'), ...restrict)],
    update: [iff(isProvider('external'), ...restrict)],
    patch: [iff(isProvider('external'), ...restrict)],
    remove: [iff(isProvider('external'), ...restrict)]
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
