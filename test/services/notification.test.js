const assert = require('assert');
const app = require('../../src/app');
// const m = require('moment');

const chai = require('chai');
const expect = chai.expect;

// const mock = require('../mocks/notification.json');

describe('\'notification\' service', () => {
  it('registered the service', () => {
    const service = app.service('notification');

    assert.ok(service, 'Registered the service');
  });

  it('checks if user is allowed', async () => {
    const s = app.service('notification');
    try {
      await s.create({body:{_cloudcms:{node:{object:{_system: {
        modified_by_principal_domain_id: '1234',
        modified_by_principal_id: '1234',
        modified_by: 'wrong user' 
      }}}}}});
    } catch (e) {
      expect(e.code).to.equal(403);
      expect(e.data.message).to.equal('wrong user, you are not allowed to send app notifications');
    }    
  });

  it('checks if the notification is published', async () => {
    const s = app.service('notification');
    try {
      await s.create({body:{_cloudcms:{node:{object:{_system: {
        modified_by_principal_domain_id: '869b74f51afe687b5b74',
        modified_by_principal_id: 'b053fcddb8b70b299821',
        modified_by: 'samuel' 
      }}}}}});
    } catch (e) {
      expect(e.code).to.equal(400);
      expect(e.data.message).to.equal('Notifications need to be published');
    }    
  });

  // it('checks if user is allowed', async () => {
  //   const s = app.service('notification');
  //   const r = await s.create(mock);
    
  // });
});
