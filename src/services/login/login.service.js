// Initializes the `login` service on path `/ers/contacts/login`
const createService = require('./login.class.js');
const hooks = require('./login.hooks');
const docs = require('../../swagger/contacts');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'login',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ers/contacts/login', Object.assign(createService(options), { docs }));

  // Manually adding swagger docs
  app.docs.paths['/ers/contacts/login'].post = Object.assign({}, app.docs.paths['/ers/contacts/login'].post, docs.post);

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ers/contacts/login');

  service.hooks(hooks);
};
