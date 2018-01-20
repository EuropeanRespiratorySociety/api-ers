// Initializes the `publications` service on path `/publications`
const createService = require('./publications.class.js');
const hooks = require('./publications.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'publications',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/publications', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('publications');

  service.hooks(hooks);
};
