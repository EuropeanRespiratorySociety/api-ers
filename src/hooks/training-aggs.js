// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const before = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    // classifier results

    return new Promise((resolve, reject) => {
      // const pipeline = [
      //   { $unwind: {  path: '$classifiers'} }, 
      //   { $unwind: {  path: '$classifiers.diseases'} }, 
      //   { 
      //     $group: {
      //       _id: '$classifiers.diseases',  
      //       count: {$sum:1},  
      //       ids: {$addToSet: '$_doc'}
      //     }
      //   }  
      // ];

      // reviewers results
      const pipelineReviewers = [
        { $unwind: {  path: '$reviewers'} }, 
        { $unwind: {  path: '$reviewers.diseases'} }, 
        { 
          $group: {
            _id: '$reviewers.diseases',  
            count: {$sum:1},  
            ids: {$addToSet: '$_doc'}
          }
        }  
      ];

      hook.service.Model.aggregate(pipelineReviewers).then(r => {
        // let's find out which class is less represented
        hook.params.query.$limit = 1;
        hook.params.query['reviewers.ersId'] = {'$ne': hook.params.user.ersId};
        // we have 8 diseases
        if (r.length < 8) {
          const classesToExclude = r.reduce((a, i) => {
            a.push(i._id);
            return a;
          }, []);
          hook.params.query['classifiers.diseases'] = {'$nin': classesToExclude};
          resolve(hook);
        } else {
          const classToLookup = r.reduce((a,i) => {
            if (i.count < a.count) a = i;
            return a;
          });
          hook.params.query['classifiers.diseases'] = {'$in': classToLookup._id};
          resolve(hook);
        }

        reject('something went wrong');
      });
    });
  };
};

const after = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    hook.result.data[0].classifiers = hook.result.data[0].classifiers.map(c => {
      if(c.diseases.length === 0) {
        const r = c.predictions.reduce((a, i) => {
          if(a.probability < i.probability) a = i;
          return a;
        });
        c.diseases.push(r.label);
      }
      return c;
    });

    return Promise.resolve(hook);
  };
};

module.exports = {
  before,
  after
};
