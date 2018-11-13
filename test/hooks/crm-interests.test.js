const crmInterests = require('../../src/hooks/crm-interests');
const chai = require('chai');
const redis = require('redis');
const client = redis.createClient();

//use http plugin
const expect = chai.expect;

describe('\'crmInterests\' hook', () => {
  after(function () {
    client.del('crmInterests');
  });

  it('runs the hook', () => {
    // Initialize our hook with no options
    const hook = crmInterests();
    expect(hook).to.be.a('function');
  });

  it('returns a saved object', () => {
    const mock = {
      params: {}
    };
    client.del('crmInterests');
    client.set('crmInterests', JSON.stringify({
      diseases: [
        {
          DiseaseId: 6,
          Name: 'Sleep and Breathing disorders',
          Order: 7,
          IsActive: true
        }
      ],
      methods: [
        {
          MethodId: 14,
          Name: 'Transplantation',
          Order: 11,
          IsActive: true
        }
      ]
    }));
    const hook = crmInterests();
    return hook(mock).then(result => {
      const i = result.params.crmInterests;
      expect(i).to.be.an('object')
        .to.haveOwnProperty('diseases')
        .to.be.an('array');
      expect(i).to.be.an('object')
        .to.haveOwnProperty('methods')
        .to.be.an('array');
      expect(i.diseases[0].DiseaseId).to.equal(6);
      expect(i.methods[0].MethodId).to.equal(14);
    });
  });

  // @TODO need to mock crmAuth hook to add other tests
});
