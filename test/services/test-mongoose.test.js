const assert = require('assert');
const app = require('../../src/app');

describe('\'test-mongoose\' service', () => {
  it('registered the service', () => {
    const service = app.service('test-mongoose');

    assert.ok(service, 'Registered the service');
  });
});
