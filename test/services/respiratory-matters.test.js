const assert = require('assert');
const app = require('../../src/app');

describe('\'respiratory-matters\' service', () => {
  it('registered the service', () => {
    const service = app.service('respiratory-matters');

    assert.ok(service, 'Registered the service');
  });
});
