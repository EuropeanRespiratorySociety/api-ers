// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('@feathersjs/errors');
const { Format } = require('ers-utils');
const f = new Format();
const _ = f.lodash;

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    return new Promise((resolve, reject) => { 
      const isAdmin = hook.params.user.permissions.includes('admin');
      if (!isAdmin) _.map(hook.data, (v, i) => {
        if(i === 'permissions' || v.permissions) {
          reject(er('admin'));
        }  
      });
      resolve(hook);
    });
  };
}; 

function er() {
  throw new errors.Forbidden('You are not allowed to add permissions');
}