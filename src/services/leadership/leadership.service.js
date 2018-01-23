// Initializes the `leadership` service on path `/leadership`
const createService = require('./leadership.class.js');
const hooks = require('./leadership.hooks');

const docs = require('../../swagger/leadership');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'leadership',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/leadership', Object.assign(createService(options), { docs }));
  delete app.docs.paths['/leadership'].get.parameters;

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('leadership');

  service.hooks(hooks);
};
