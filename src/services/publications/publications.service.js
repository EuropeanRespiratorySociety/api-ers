// Initializes the `publications` service on path `/publications`
const createService = require('./publications.class.js');
const hooks = require('./publications.hooks');

const docs = require('../../swagger/publications');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'publications',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/publications', Object.assign(createService(options), { docs, id: 'slug' }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('publications');

  service.hooks(hooks);
};
