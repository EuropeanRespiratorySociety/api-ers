// Initializes the `users` service on path `/users`
const createService = require('feathers-mongoose');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

const def = require('../../swagger/users');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'users',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/users', Object.assign(createService(options), {
    docs: def,
    id: '_id' 
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('users');

  service.hooks(hooks);
};

