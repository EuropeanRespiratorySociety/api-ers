const assert = require('assert');
const app = require('../../src/app');

describe('\'publications\' service', () => {
  it('registered the service', () => {
    const service = app.service('publications');

    assert.ok(service, 'Registered the service');
  });
});
