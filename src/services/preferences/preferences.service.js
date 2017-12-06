// Initializes the `preferences` service on path `/preferences`
const createService = require('feathers-mongoose');
const createModel = require('../../models/preferences.model');
const hooks = require('./preferences.hooks');
const filters = require('./preferences.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'preferences',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/preferences', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('preferences');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
