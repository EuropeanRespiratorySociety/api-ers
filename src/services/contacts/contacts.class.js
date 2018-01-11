const axios = require('axios');
const errors = require('@feathersjs/errors');

// This is mendatory until we change the certificate
// But we trust the server... it is ours.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find(params) {
    return new Promise((resolve, reject) => {
      const pattern = params.query.pattern;
      if(!pattern){reject(new errors.BadRequest('A pattern parameter is mandatory'));}
      axios
        .get('https://crmapi.ersnet.org/contacts?pattern=' + pattern, {
          headers: { Authorization: `Bearer ${params.crmToken}` }
        })
        .then(response => {
          if(response.data.length > 0){
            const res = {data: response.data, status: 200};
            resolve(res);
          }
          reject(new errors.NotFound('Contact not found'));
        })
        .catch(error => {
          // console.log(error);
          // console.log(error.response.data);
          reject(new errors.GeneralError('Something went wrong, check the logs.', error.response.data));
        });
    });
  }

  get(id, params) {
    return new Promise((resolve, reject) => {
      axios
        .get('https://crmapi.ersnet.org/contacts/' + id, {
          headers: { Authorization: `Bearer ${params.crmToken}` }
        })
        .then(response => {
          if(response.data.ContactId){
            const res = {data: response.data, status: 200};
            resolve(res);
          }
          reject(new errors.NotFound('Contact not found'));
        })
        .catch(error => {
          // console.log(error.response.data);
          reject(new errors.NotFound('Contact not found', error.response.data));
        });
    });
  }
}  

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
