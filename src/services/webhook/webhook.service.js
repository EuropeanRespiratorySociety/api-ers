// Initializes the `webhook` service on path `/webhook`
const createService = require('./webhook.class.js');
const hooks = require('./webhook.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'webhook',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/webhook', createService(options));
  delete app.docs.paths['/webhook'].post.parameters;

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('webhook');

  service.hooks(hooks);
};
