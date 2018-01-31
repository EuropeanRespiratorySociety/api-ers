'use strict';

// src/services/content/hooks/cc-parser.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html


const defaults = {};
const F = require('ers-utils').Format;
const format = new F();

exports.sortBy = options => {
  options = Object.assign({}, defaults, options);

  return async hook => {
    hook.result.data = hook.result._sys.status === 200 
      ? format.sortBy(hook.result.data, options.sortBy) 
      : hook.result.data;
    return hook;
  };
};


