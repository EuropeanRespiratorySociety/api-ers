const data = require('./data/abstracts.json');
const sureThing = require('../../helpers/sureThing');

/*eslint no-console: off*/
const abstracts = async (app) => {
  const s = app.service('congress/abstracts');
  return await Promise.all(data.map(async (i, k) => {
    console.log(i.title);
    const { diseases, methods } = i;
    const { ok, response, error } = await sureThing(s.patch(
      null,
      {
        diseases,
        methods: methods.map(i => {
          if (i === 'Pulmonary function testing (incl. gas exchange)') return 'Pulmonary function testing';
          return i;
        })
      },
      {
        query: { abstractTitle: i.title }
      }
    ));
    if (response[0] && response[0].id) {
      console.log({ ok, response: response[0].id, error });
      return { ok, response, error };
    } else {
      return { ok, message: 'not in the accepted abstracts' };
    }
  }));
};

module.exports = abstracts;
