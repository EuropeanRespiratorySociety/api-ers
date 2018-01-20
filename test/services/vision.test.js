const assert = require('assert');
const app = require('../../src/app');

describe('\'vision\' service', () => {
  it('registered the service', () => {
    const service = app.service('vision');

    assert.ok(service, 'Registered the service');
  });
});
