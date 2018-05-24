//  const axios = require('axios');
const errors = require('@feathersjs/errors');
const client = require('../../helpers/authentication');
const sureThing = require('../../helpers/sureThing');
const { HTTP, k4Client } = require('../../helpers/HTTP');
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

  async create(data, params) {
    return new Promise(async (resolve, reject) => {
      const payload = Object.assign({},{ include: conf }, data);
      const crmEndpoint = '/Contacts/Authenticate';
      const crmClient = HTTP('https://crmapi.ersnet.org', params.crmToken);
      const k4Endpoint = '/Agenda/ConferenceCompassAuthentification';
      const k4Request = `${k4Endpoint}?user[username]=${payload.username}&user[password]=${payload.password}`;

      const [myCRM, key4] = await Promise.all([
        sureThing(crmClient.post(crmEndpoint, payload)),
        sureThing(k4Client.get(k4Request))
      ]);

      /* eslint-disable indent */
      const key4Token = key4.ok && key4.response.data.user
        ? key4.response.data.user.token
        : key4.ok && key4.response.data.error
        ? key4.response.data.error
        : 'Something went wrong with Key4 server'; // The key4 error is html... 
      /* eslint-enable indent */

      if (!myCRM.ok) {
        const rejected = myCRM.error.response.status === 500
          ? new errors.GeneralError('MyCRM API is probably down, no way to check credentials, please contact the ERS with this message.', { errors: { message: myCRM.error.response.statusText }})
          : new errors.NotAuthenticated('Invalid credentials ', { errors: { message: myCRM.error.response.statusText }});
        reject(rejected);
      }
      
      if(myCRM.ok){
        const data = myCRM.response.data;
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
          key4Token,
          password: payload.password,
          $addToSet: { permissions: ['myERS'] }
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
            const spotmeId = u[0].spotmeId || '';
            const permissions = u[0].permissions;
            const preferences = this.app.service('preferences');
            const result = Object.assign(
              { data },
              r,
              { 
                apiUserId, 
                key4Token, 
                spotmeId,
                permissions, 
                preferences: {} 
              }
            );

            preferences.get(apiUserId).then(p => {
            // @TODO #25 we need to merge the preferences with myCRM store preferences
              result.preferences = p;
              resolve(result);
            }).catch(err => {
              resolve(result);
            });
          });
        }).catch(e => {
          reject(new errors.GeneralError(e));
        });
      } else {
        reject(new errors.NotFound(myCRM.data));
      }
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
