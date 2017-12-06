const assert = require('assert');
const app = require('../../src/app');

describe('\'preferences\' service', () => {
  it('registered the service', () => {
    const service = app.service('preferences');

    assert.ok(service, 'Registered the service');
  });
});
