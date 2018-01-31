'use strict';

// src/services/calendar/hooks/prepare-calendar.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const D = require('ers-utils').DateUtils;
const date = new D();

const defaults = {};

module.exports = options => { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return async hook => {
    // hook.prepareCalendar = true;
    const timeline = hook.params.query.timeline == 'true';
    const reverse = hook.params.query.reverse == 'true';
    /* eslint-disable indent */
    hook.result.data = !hook.result._sys.status === 200 
      ? {}
      : timeline
      ? date.timeline(hook.result.data)
      : date.prepareCalendar(hook.result.data, reverse);
    /* eslint-enable */

    return hook;
  };
};
