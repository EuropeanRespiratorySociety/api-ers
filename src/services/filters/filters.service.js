// Initializes the `filters` service on path `/filters`
const createService = require('./filters.class.js');
const hooks = require('./filters.hooks');

const docs = require('../../swagger/filters');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'filters',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/filters', Object.assign(createService(options), { docs, id: 'endpoint' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('filters');

  service.hooks(hooks);
};
