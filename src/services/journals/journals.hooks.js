const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider }= require('feathers-hooks-common');
const checkPermissions = require('feathers-permissions');
// const addJournalLink = require('../../hooks/add-journal-link');
const formatJournal = require('../../hooks/format-journal');

const restrict = [ 
  authenticate('jwt'), 
  checkPermissions({
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
    find: [formatJournal()],
    get: [formatJournal()],
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
