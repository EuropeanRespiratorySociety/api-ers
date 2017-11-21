const assert = require('assert');
const app = require('../../src/app');

describe('\'sleepandbreathing\' service', () => {
  it('registered the service', () => {
    const service = app.service('sleepandbreathing');

    assert.ok(service, 'Registered the service');
  });
});
