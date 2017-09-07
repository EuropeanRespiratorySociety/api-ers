const axios = require('axios');
const errors = require('feathers-errors');

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  create(data, params) {
    return new Promise((resolve, reject) => {

      axios
        .post('https://crmapi.ersnet.org/contacts/checklogin', data, {
          headers: { Authorization: `Bearer ${params.crmToken}` }
        })
        .then(response => {
          if(response.data){
            const contactId = parseInt(response.data, 10);
            const contacts = this.app.service('ers/contacts');
            const res = contacts.get(contactId);
            resolve(res);
          }
          reject(new errors.NotFound(response.data));
        })
        .catch(error => {
          const rejected = new errors.NotAuthenticated('Invalid credentials ', {errors: {message: error.response.data.Message}});
          reject(rejected);
        });
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
