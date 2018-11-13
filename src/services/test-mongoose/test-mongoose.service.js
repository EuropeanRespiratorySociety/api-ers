// Initializes the `test-mongoose` service on path `/test-mongoose`
const createService = require('feathers-mongoose');
const createModel = require('../../models/test-mongoose.model');
const hooks = require('./test-mongoose.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/test-mongoose', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-mongoose');

  service.hooks(hooks);
};
