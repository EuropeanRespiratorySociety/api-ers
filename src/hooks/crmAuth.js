'use strict';
const defaults = {};
const errors = require('@feathersjs/errors');
const qs = require('querystring');
const axios = require('axios');
const client = require('../helpers/redis');
const dotenv = require('dotenv');
dotenv.load();

const data = qs.stringify({
  grant_type: 'password',
  username: process.env.CRM_USER,
  password: process.env.CRM_PW
});

// This is mendatory until we change the certificate
// But we trust the server... it is ours.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

/* eslint-disable no-console */
const crmAuth = function (options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return function (hook) {
    return new Promise((resolve, reject) => {
      client.get('myCrm_api_key', (err, reply) => {
        if (reply) {
          //console.log("response from redis: ", reply)
          hook.params.crmToken = reply;
          resolve(hook);
        } else {
          axios
            .post('https://crmapi.ersnet.org/Token', data)
            .then(response => {
              client.set('myCrm_api_key', response.data.access_token);
              client.expire('myCrm_api_key', response.data.expires_in - 30);
              hook.params.crmToken = response.data.access_token;
              resolve(hook);
            })
            .catch(error => {
              console.log('CRM Hook: ', error);
              reject(new errors.GeneralError('MyCRM is probably down, please contact the ERS with this message.'));
            });
        }
      });
    });
  };
};

/* eslint-disable no-console */
const verifyUser = function (options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return function (hook) {
    return new Promise((resolve, reject) => {
      const isAdmin = hook.params.user.permissions.reduce((a, i) => {
        return i.includes('admin') ? true : a;
      }, false);
      if (hook.params.user.ersId === parseInt(hook.id) || isAdmin) {
        resolve(hook);
      }
      reject(new errors.Forbidden('You are not allowed to view this ressource'));
    });
  };
};

module.exports = {
  crmAuth,
  verifyUser
};

