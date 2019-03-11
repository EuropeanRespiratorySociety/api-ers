const assert = require('assert');
const app = require('../../src/app');

describe('\'respiratory-digest\' service', () => {
  it('registered the service', () => {
    const service = app.service('respiratory-digest');

    assert.ok(service, 'Registered the service');
  });
});
