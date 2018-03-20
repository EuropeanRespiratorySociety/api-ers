// Initializes the `search` service on path `/search`
const createService = require('./search.class.js');
const hooks = require('./search.hooks');

const def = require('../../swagger/search');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'search',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/search', Object.assign(createService(options), {
    docs: def
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('search');

  service.hooks(hooks);
};
