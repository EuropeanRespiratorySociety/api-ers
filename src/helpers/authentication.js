const Feathers = require('@feathersjs/feathers');
const authentication = require('@feathersjs/authentication-client');
const rest = require('@feathersjs/rest-client');
const axios = require('axios');

// Configure Feathers client
const restClient = rest(process.env.HOST || 'http://localhost:3030');
const feathers = Feathers()
  .configure(restClient.axios(axios))
  .configure(authentication());

module.exports = feathers;
