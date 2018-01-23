const HTTP = require('../../helpers/HTTP');
const map = require('./leadership.map');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
    this.baseUrl = 'https://crmapi.ersnet.org/Roles';
  }

  async find (params) {
    const client = HTTP(this.baseUrl, params.crmToken);

    const a = client.get('/Officers?group=EXE&doiIncluded=true');
    const b = client.get('/Officers?group=CO&type=CHC&doiIncluded=true');
    const t = await Promise.all([a, b]);
    let z = [];
    t.map(i => { i.data.map(i => { z.push(i); }); }); 

    return { data: map.order
      .map(i => {
        const temp = z.filter(ii => {
          if(ii.TypeCode === i.TypeCode && ii.DetailCode === i.ScopeCode) {
            if(ii.Declaration !== undefined) {
              ii.Declaration.Interests.map(iii => {
                iii.description = map
                  .interests.filter(f => iii.SectionCode === f.code)[0].description || '';
                return iii;
              });
            }
            return ii;
          }
        });
        return Object.assign(i, temp[0]);
      }
      )
      .filter(i => i.IsActive)
    };
  } 
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
