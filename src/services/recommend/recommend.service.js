// Initializes the `recommend` service on path `/recommend`
const createService = require('./recommend.class.js');
const hooks = require('./recommend.hooks');

const docs = require('../../swagger/recommend');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/recommend', Object.assign(createService(options), {
    docs
  }));

  // Get our initialized service so that we can register hooks
  const service = app.service('recommend');

  service.hooks(hooks);
};
