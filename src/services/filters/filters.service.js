// Initializes the `filters` service on path `/filters`
const createService = require('./filters.class.js');
const hooks = require('./filters.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'filters',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/filters', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('filters');

  service.hooks(hooks);
};
