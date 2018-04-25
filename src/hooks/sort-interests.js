// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { Format } = require('ers-utils');
const f = new Format();
const _ = f.lodash;

module.exports = (options = {}) => { // eslint-disable-line no-unused-vars
  return async context => {
    const data = context.result.data;

    data.map(i => {
      const sorted = {
        pInterests: {
          title: '1 - Personal interests',
          data: []
        },
        npInterests:{
          title: '2 - Non-Personal interests',
          data: []
        },
        oInterests:{
          title: '3 - Other Interests that may be seen as potential conflicts',
          data: []
        },
        tobacco: {
          title: '4 - Tobacco-Industry related Conflicts of Interests',
          data: ''
        }
      };

      if(i.Declaration !== undefined) {
        i.Declaration.Interests.map(ii => {
          if(['CON', 'BEN', 'TRA', 'SHA'].includes(ii.SectionCode)) {
            sorted.pInterests.data.push(ii);
          }

          if(['NOP'].includes(ii.SectionCode)) {
            sorted.npInterests.data.push(ii);
          }

          if(['OTH'].includes(ii.SectionCode)) {
            sorted.oInterests.data.push(ii);
          }
        });

        if(i.Declaration.HasTobaccoConflict) {
          sorted.tobacco.data = 'Yes. I declare that I have been full or part time employee of, paid consultant or advisor to/received a grant from the tobacco industry at any time after 1.1.2000, for any project or programme.';
        } else {
          sorted.tobacco.data = 'No. I declare that I have not been full or part time employee of, paid consultant or advisor to /received a grant from the tobacco industry at any time after 1.1.2000, for any project or programme.';
        }

      }
      sorted.pInterests.data = _.groupBy(sorted.pInterests.data, 'SectionCode');
      return i.sorted = sorted;

    });

    return context;
  };
};
