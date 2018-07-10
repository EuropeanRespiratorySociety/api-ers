// Initializes the `training-data` service on path `/training-data`
const createService = require('feathers-mongoose');
const createModel = require('../../models/training-data.model');
const hooks = require('./training-data.hooks');
// const filters = require('./training-data.filters');

const docs = require('../../swagger/training');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'training-data',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/training-data', Object.assign(createService(options), {
    docs
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('training-data');

  service.hooks(hooks);

  // if (service.filter) {
  //   service.filter(filters);
  // }
};
