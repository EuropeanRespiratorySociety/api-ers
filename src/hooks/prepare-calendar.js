'use strict';

// src/services/calendar/hooks/prepare-calendar.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const D = require('ers-utils').DateUtils;
const date = new D();

const defaults = {};

module.exports = function(options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return function(hook) {
    hook.prepareCalendar = true;
    if(hook.result._sys.status === 200) {
      hook.result = {
        data: date.prepareCalendar(hook.result.data),
        category: 'TODO',
        _sys: hook.result._sys
      };
    }
    return Promise.resolve(hook);
  };
};
