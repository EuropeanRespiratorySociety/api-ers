const axios = require('axios');
const errors = require('@feathersjs/errors');
const client = require('../../helpers/authentication');
const conf = require('./login.conf').join(',');

// @TODO async/await #26
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
      const payload = Object.assign({},{ include: conf }, data);
      axios
        .post('https://crmapi.ersnet.org/Contacts/Authenticate', 
          payload, 
          {
            headers: { Authorization: `Bearer ${params.crmToken}` 
            } // The token is generated/set by a hook
          })
        .then(response => {
          if(response.data){
            const data = response.data;
            const contactId = data.ContactId;
            const users = this.app.service('users');
            const params = {
              query: {
                ersId: contactId
              },
              mongoose: { upsert: true }
            };
            
            const user = {
              email: data.SmtpAddress1,
              ersId: contactId,
              password: payload.password,
              permissions: 'myERS'
            };

            // Update or create the user (upsert)
            users.patch(null, user, params).then( u => {
              if(u && u.length === 0) {
                reject(new errors.NotFound(data));
              }

              // automatically authenticate the user
              client.authenticate({
                email: data.SmtpAddress1,
                password: payload.password,
                strategy: 'local'
              }).then(r => {
                const apiUserId = u[0]._id.toString();
                const preferences = this.app.service('preferences');
                preferences.get(apiUserId).then(p => {
                // @TODO #25 we need to merge the preferences with myCRM store preferences
                  resolve(Object.assign({data: data}, r, { apiUserId: apiUserId, preferences: p }));
                }).catch(err => {
                  resolve(Object.assign({data: data}, r, { apiUserId: apiUserId, preferences: {} }));
                });
              });
            }).catch(e => {
              reject(new errors.GeneralError(e));
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
