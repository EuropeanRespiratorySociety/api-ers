const assert = require('assert');
const app = require('../../src/app');

describe('\'training-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('training-data');

    assert.ok(service, 'Registered the service');
  });
});
