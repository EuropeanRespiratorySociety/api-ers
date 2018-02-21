// Initializes the `sessions` service on path `/congress/sessions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/sessions.model');
const hooks = require('./sessions.hooks');

const def = require('../../swagger/sessions');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'sessions',
    Model,
    paginate,
    id: 'id'
  };

  // Initialize our service with any options it requires
  app.use('/congress/sessions', Object.assign(createService(options), {
    docs: def,
    id: 'id' 
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('congress/sessions');

  service.hooks(hooks);
};