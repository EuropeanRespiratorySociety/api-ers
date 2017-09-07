const assert = require('assert');
const app = require('../../src/app');

describe('\'metanav\' service', () => {
  it('registered the service', () => {
    const service = app.service('metanav');

    assert.ok(service, 'Registered the service');
  });
});
