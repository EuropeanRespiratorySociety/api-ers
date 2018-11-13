// Initializes the `test-cloudcms` service on path `/test-cloudcms`
const createService = require('./test-cloudcms.class.js');
const hooks = require('./test-cloudcms.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/test-cloudcms', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-cloudcms');

  service.hooks(hooks);
};
