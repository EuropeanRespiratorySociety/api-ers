const D = require('ers-utils').DateUtils;
const date = new D();

const courses = (options = {}) => { // eslint-disable-line no-unused-vars
  return async context => {
    const data = context.result.data;
    const q = context.params.query;

    if(q.type === 'past') {
      context.result.data = data.filter(i => date.isAlreadyPassed(i.eventDate));
      return context;
    }

    if(q.type === 'all') {
      context.result.data = data;
      return context;
    }

    context.result.data = data.filter(i => !date.isAlreadyPassed(i.eventDate));
    return context;

  };
};

module.exports = courses;
