// Initializes the `feed` service on path `/feed`
const createService = require('./feed.class.js');
const hooks = require('./feed.hooks');

const docs = require('../../swagger/feed');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'feed',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/feed', Object.assign(createService(options), { docs }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('feed');

  service.hooks(hooks);
};
