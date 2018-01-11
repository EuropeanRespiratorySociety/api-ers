const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks');
const { iff, isProvider }= require('feathers-hooks-common');
const isOwner = require('../../hooks/isOwner').isOwner;
const addId = require('../../hooks/add-id');

const restrict = [
  authenticate('jwt'),
  isOwner()
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
    get: [iff(isProvider('external'), ...restrict)],
    create: [authenticate('jwt'), addId()],
    update: [...restrict],
    patch: [...restrict],
    remove: [...restrict]
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
