// Initializes the `webhook` service on path `/webhook`
const createService = require('./webhook.class.js');
const hooks = require('./webhook.hooks');

const def = require('../../swagger/webhook');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'webhook',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/webhook', Object.assign(createService(options), {
    docs: def
  }));
  
  app.docs.paths['/webhook'].post.parameters = undefined;

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('webhook');

  service.hooks(hooks);
};
