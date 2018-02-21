const assert = require('assert');
const app = require('../../src/app');

describe('\'feed\' service', () => {
  it('registered the service', () => {
    const service = app.service('feed');

    assert.ok(service, 'Registered the service');
  });
});
