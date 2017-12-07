const Feathers = require('feathers/client');
const hooks = require('feathers-hooks');
const authentication = require('feathers-authentication/client');
const rest = require('feathers-rest/client');
const axios = require('axios');

// Configure Feathers client
const restClient = rest(process.env.HOST || 'http://localhost:3030');
const feathers = Feathers()
  .configure(restClient.axios(axios))
  .configure(hooks())
  .configure(authentication());

module.exports = feathers;
