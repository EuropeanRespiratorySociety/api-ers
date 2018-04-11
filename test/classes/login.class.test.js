const chai = require('chai');
const expect = chai.expect;

const app = require('../../src/app');
// const paginate = app.get('paginate');

const dotenv = require('dotenv');
dotenv.load();

// const cc = require('../../src/cloudcms');

// Getting the service (we need hooks)
const service = app.service('ers/contacts/login');

describe('Login Class', function() {

  it('is correctly instantiated', () => {
    expect(service).to.be.an('object');
    expect(service).to.respondTo('create');
  });

  it('handles wrong credentials', async () => {
    try {
      await service.create({
        username: 'abcdef',
        password: 'ghijkl'
      });
    } catch (e) {
      expect(e.name).to.equal('NotAuthenticated');
      expect(e.code).to.equal(401);
    }
  }).timeout(10000);

  it('logs in', async () => {
    const payload = {
      username: process.env.CRM_TEST_USER,
      password: process.env.CRM_TEST_PW
    };
    const r = await service.create(payload);

    expect(r).to.haveOwnProperty('data');
    expect(r).to.haveOwnProperty('accessToken');
    expect(r).to.haveOwnProperty('apiUserId');
    expect(r).to.haveOwnProperty('preferences');
    // This test needs a seeded database 
    // expect(r.apiUserId).to.equal(`${r.preferences._id}`);

  }).timeout(4000);

});