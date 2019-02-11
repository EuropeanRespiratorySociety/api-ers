// Initializes the `cme-online` service on path `/cme-online`
const createService = require('./cme-online.class.js');
const hooks = require('./cme-online.hooks');

//add documetation
const docs = require('../../swagger/cme-online');
module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  //add documetation
  app.use('/cme-online', Object.assign(createService(options), {
    docs,
    id: 'slug'
  }));

  // Get our initialized service so that we can register hooks
  const service = app.service('cme-online');

  service.hooks(hooks);
};
