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
        { $unwind: { path: '$contentReviewers' } },
        { $unwind: { path: '$contentReviewers.diseases' } },
        {
          $group: {
            _id: '$contentReviewers.diseases',
            count: { $sum: 1 },
            ids: { $addToSet: '$_doc' }
          }
        }
      ];

      if ('_totals' in hook.params.query) {
        hook.service.Model.aggregate(pipelineReviewers).then(r => {
          hook.result = r;
          resolve(hook);
        });
      } else if ('_classified' in hook.params.query) {
        delete hook.params.query._classified;
        hook.params.query['$or'] = [
          { contentReviewers: { $exists: true } },
          { titleReviewers: { $exists: true } }
        ];
        resolve(hook);
        // hook.pamams.query
      } else {
        hook.service.Model.aggregate(pipelineReviewers).then(r => {
          // Let's reset query and set some defaults
          const query = {
            $limit: 1,
            'contentReviewers.ersId': { '$ne': hook.params.user.ersId },
            'titleReviewers.ersId': { '$ne': hook.params.user.ersId },
            'skippedBy': { '$ne': hook.params.user.ersId },
            '$or': [
              { reviewers: { $size: 2 } },
              { reviewers: { $size: 1 } },
              { reviewers: { $size: 0 } },
              { reviewers: { $exists: false } }
            ]
          };

          hook.params.query = query;
          // let's find out which class is less represented
          // we have 8 diseases
          if (r.length < 8) {
            const classesToExclude = r.reduce((a, i) => {
              a.push(i._id);
              return a;
            }, []);
            hook.params.query['classifiers.diseases'] = { '$nin': classesToExclude };
            resolve(hook);
          } else {
            const classToLookup = r.reduce((a, i) => {
              if (i.count < a.count) a = i;
              return a;
            });
            hook.params.query['classifiers.diseases'] = { '$in': classToLookup._id === 'Paediatric respiratory diseases' ? 'Paediatric lung diseases' : classToLookup._id };
            resolve(hook);
          }

          reject('something went wrong');
        });
      }
    });
  };
};

const after = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    if (!('_totals' in hook.params.query || '_classified' in hook.params.query) && hook.result.data[0].classifiers) {
      hook.result.data[0].classifiers = hook.result.data[0].classifiers.map(c => {
        if (c.diseases.length === 0) {
          const r = c.predictions.reduce((a, i) => {
            if (a.probability < i.probability) a = i;
            return a;
          });
          c.diseases.push(r.label);
        }
        return c;
      });
    }

    return Promise.resolve(hook);
  };
};

module.exports = {
  before,
  after
};
