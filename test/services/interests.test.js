const assert = require('assert');
const app = require('../../src/app');

describe('\'interests\' service', () => {
  it('registered the service', () => {
    const service = app.service('interests');

    assert.ok(service, 'Registered the service');
  });
});
