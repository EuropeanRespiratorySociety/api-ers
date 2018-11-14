// Initializes the `test-customservice` service on path `/test-customservice`
const createService = require('./test-customservice.class.js');
const hooks = require('./test-customservice.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/test-customservice', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-customservice');

  service.hooks(hooks);
};
