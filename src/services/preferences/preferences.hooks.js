const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const { iff, isProvider }= require('feathers-hooks-common');
const isOwner = require('../../hooks/isOwner').isOwner;
const addId = require('../../hooks/add-id');
const push = require('../../hooks/push-spotmeId-to-array');
const { crmAuth } = require('../../hooks/crmAuth');
const crmInterests = require('../../hooks/crm-interests');
const sync = require('../../hooks/crm-sync-interests');

const restrict = [
  authenticate('jwt'),
  isOwner()
];

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),      
      checkPermissions({
        roles: ['admin'],
        fieldName: 'permissions'
      }) 
    ],
    get: [
      iff(
        isProvider('external'), 
        ...restrict)
    ],
    create: [
      iff(
        isProvider('external'),
        authenticate('jwt'),
        addId()
      )
    ],
    update: [
      crmAuth(),
      crmInterests(), 
      iff(
        isProvider('external'), 
        ...restrict,
        push(),
        sync()
      )
    ],
    patch: [
      crmAuth(),
      crmInterests(), 
      iff(
        isProvider('external'), 
        ...restrict,
        push(),
        sync()
      )
    ],
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
