const assert = require('assert');
const app = require('../../src/app');

describe('\'cdp\' service', () => {
  it('registered the service', () => {
    const service = app.service('cdp');

    assert.ok(service, 'Registered the service');
  });
});
