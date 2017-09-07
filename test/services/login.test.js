const assert = require('assert');
const app = require('../../src/app');

describe('\'login\' service', () => {
  it('registered the service', () => {
    const service = app.service('ers/contacts/login');

    assert.ok(service, 'Registered the service');
  });
});
