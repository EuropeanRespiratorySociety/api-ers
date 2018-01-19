const assert = require('assert');
const app = require('../../src/app');

describe('\'filters\' service', () => {
  it('registered the service', () => {
    const service = app.service('filters');

    assert.ok(service, 'Registered the service');
  });
});
