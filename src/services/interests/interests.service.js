// Initializes the `interests` service on path `/interests`
const createService = require('./interests.class.js');
const hooks = require('./interests.hooks');
const filters = require('./interests.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'interests',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/interests', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('interests');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
