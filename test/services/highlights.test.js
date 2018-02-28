const assert = require('assert');
const app = require('../../src/app');

describe('\'highlights\' service', () => {
  it('registered the service', () => {
    const service = app.service('highlights');

    assert.ok(service, 'Registered the service');
  });
});
