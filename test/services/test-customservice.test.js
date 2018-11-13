const assert = require('assert');
const app = require('../../src/app');

describe('\'test-customservice\' service', () => {
  it('registered the service', () => {
    const service = app.service('test-customservice');

    assert.ok(service, 'Registered the service');
  });
});
