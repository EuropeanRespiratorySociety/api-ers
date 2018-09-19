const { HTTP } = require('../../helpers/HTTP');
const map = require('./leadership.map');

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
    this.baseUrl = 'https://crmapi.ersnet.org/Contacts/Roles';
  }

  async find(params) {
    const client = HTTP(this.baseUrl, params.crmToken);

    const a = client.get('/Officers?groups=EXE&doiIncluded=true&doiTolerance=1');
    const b = client.get('/Officers?groups=CO&types=CHC&doiIncluded=true&doiTolerance=1');
    const t = await Promise.all([a, b]);
    let z = [];
    t.map(i => { i.data.map(i => { z.push(i); }); });
    return {
      data: map.order
        .map(i => {
          const temp = z.filter(ii => {
            if (ii.TypeCode === i.TypeCode && (ii.ScopeCode === i.ScopeCode || ii.ScopeCode === undefined)) {
              if (ii.Declaration !== undefined) {
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
