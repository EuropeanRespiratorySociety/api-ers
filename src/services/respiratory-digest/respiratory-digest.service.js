// Initializes the `respiratory-digest` service on path `/respiratory-digest`
const createService = require('./respiratory-digest.class.js');
const hooks = require('./respiratory-digest.hooks');

const docs = require('../../swagger/respiratory-digest');
module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'respiratory-digest',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/respiratory-digest', Object.assign(createService(options), {
    docs,
    id: 'slug'
  }));

  // Get our initialized service so that we can register hooks
  const service = app.service('respiratory-digest');

  service.hooks(hooks);
};
