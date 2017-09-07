/* eslint-disable no-unused-vars */

const axios = require('axios');

const baseUrl = 'https://www.ersnet.org/api';

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find() {
    return new Promise((resolve, reject) => {
      axios
        .get(baseUrl + '/metanav')
        .then(response => {
          // status: 200 is legacy
          resolve({menu: response.data.menu, status: 200, _sys: { status: 200} });
        })
        .catch(error => {
          reject(error);
        });
    });  
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
