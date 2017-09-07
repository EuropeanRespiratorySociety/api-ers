const assert = require('assert');
const app = require('../../src/app');

describe('\'contacts\' service', () => {
  it('registered the service', () => {
    const service = app.service('ers/contacts');

    assert.ok(service, 'Registered the service');
  });
});
