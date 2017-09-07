const assert = require('assert');
const app = require('../../src/app');

describe('\'calendar\' service', () => {
  it('registered the service', () => {
    const service = app.service('calendar');

    assert.ok(service, 'Registered the service');
  });
});
