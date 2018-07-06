// Initializes the `app-community` service on path `/app-community`
const createService = require('./app-community.class.js');
const hooks = require('./app-community.hooks');
// const filters = require('./app-community.filters');

const docs = require('../../swagger/community');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'app-community',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/app-community', Object.assign(createService(options), { docs }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('app-community');

  service.hooks(hooks);
};
