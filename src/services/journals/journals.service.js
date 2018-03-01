// Initializes the `journals` service on path `/journals`
const createService = require('feathers-mongoose');
const createModel = require('../../models/journals.model');
const hooks = require('./journals.hooks');

const def = require('../../swagger/journals');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'journals',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/journals', Object.assign(createService(options), {
    docs: def,
    id: '_id'
  }));


  // Get our initialized service so that we can register hooks and filters
  const service = app.service('journals');

  service.hooks(hooks);
};
