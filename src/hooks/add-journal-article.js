// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('@feathersjs/errors');

const oneArticle = function (options = {}) { // eslint-disable-line no-unused-vars
  return hook => {
    return new Promise(async (resolve, reject) => {
      const  doi = hook.result.data.doi;
      const cached = (hook.result.cache && hook.result.cache.cached) || false;

      if (doi && !cached) {
        const a = await hook.app.service('journals').find({
          query: {
            doi
          }
        });

        const article = a.data[0];

        if (article) {
          hook.result.data.body = `${hook.result.data.body ? hook.result.data.body + '<br />' : ''}${article.abstract}`;
          hook.result.data.title = article.title;
          resolve(hook);
        }

        reject(new errors.NotFound({
          message: 'The DOI did not return any article from any of the ERS journals'
        }));
      }

      resolve(hook);
    });
  };
};

/* eslint-disable */
const manyArticle = function (options = {}) {
  return async hook => {
    return new Promise(async (resolve, reject) => {
      const cached = (hook.result.cache && hook.result.cache.cached) || false;
        const data =  hook.result.data.map(async i => {
          const  doi = i.doi || false;
          if (doi && !cached) {
            const a = await hook.app.service('journals').find({
              query
              : {
                doi
              }
            });

            const article = a.data[0];
            if (article) {
              i.body = `${i.body ? i.body + '<br />' : ''}${article.abstract}`;
              i.title = article.title;
              return i;
            }

            i.body = `${i.body ? i.body + '<br />' : ''} The DOI did not return any article from any of the ERS journals`
            return i;

          }
          return i;
        });
       Promise.all(data).then(r =>
         {
           hook.result.data = r;
           resolve(hook);
        });
    });
  };
};

module.exports = {
  oneArticle,
  manyArticle
};
