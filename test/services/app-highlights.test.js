const assert = require('assert');
const app = require('../../src/app');

describe('\'app-highlights\' service', () => {
  it('registered the service', () => {
    const service = app.service('app-highlights');

    assert.ok(service, 'Registered the service');
  });
});
