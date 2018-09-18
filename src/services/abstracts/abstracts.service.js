// Initializes the `abstracts` service on path `/congress/abstracts`
const createService = require('feathers-mongoose');
const createModel = require('../../models/abstracts.model');
const hooks = require('./abstracts.hooks');

const def = require('../../swagger/abstracts');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'abstracts',
    Model,
    paginate,
    id: '_id'
  };

  // Initialize our service with any options it requires
  app.use('/congress/abstracts', Object.assign(createService(options), {
    docs: def,
    id: 'id'
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('congress/abstracts');

  service.hooks(hooks);
};
