const axios = require('axios');
const errors = require('@feathersjs/errors');
const client = require('../../helpers/authentication');



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
          headers: { Authorization: `Bearer ${params.crmToken}` } // The token is generated/set by a hook
        })
        .then(response => {
          if(response.data){
            const contacts = this.app.service('ers/contacts');
            const contactId = parseInt(response.data, 10);
            const users = this.app.service('users');
            const params = {
              query: {
                ersId: contactId
              },
              mongoose: { upsert: true }
            };
            
            // Getting User data
            contacts.get(contactId).then( res => {
              const user = {
                email: res.data.SmtpAddress1,
                ersId: res.data.ContactId,
                password: data.password,
                permissions: 'myERS'
              };

              // Update or create the user (upsert)
              users.patch(null, user, params).then( u => {
                if(u && u.length === 0) {
                  reject(new errors.NotFound(response.data));
                }

                // automatically authenticate the user
                client.authenticate({
                  email: res.data.SmtpAddress1,
                  password: data.password,
                  strategy: 'local'
                }).then(r => {
                  const apiUserId = u[0]._id;
                  const preferences = this.app.service('preferences');
                  preferences.get(apiUserId).then(p => {
                    resolve(Object.assign(res, r, { apiUserId: apiUserId, preferences: p }));
                  }).catch(err => {
                    resolve(Object.assign(res, r, { apiUserId: apiUserId, preferences: {} }));
                  });
                });
              });
            });
          } else {
            reject(new errors.NotFound(response.data));
          }
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
