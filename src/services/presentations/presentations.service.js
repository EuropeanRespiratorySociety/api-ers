// Initializes the `presentations` service on path `/congress/presentations`
const createService = require('feathers-mongoose');
const createModel = require('../../models/presentations.model');
const hooks = require('./presentations.hooks');

const def = require('../../swagger/presentations');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'presentations',
    Model,
    paginate,
    id: 'id'
  };

  // Initialize our service with any options it requires
  app.use('/congress/presentations', Object.assign(createService(options), {
    docs: def,
    id: 'id' 
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('congress/presentations');

  service.hooks(hooks);
};
