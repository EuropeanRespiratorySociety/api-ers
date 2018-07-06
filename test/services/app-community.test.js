const assert = require('assert');
const app = require('../../src/app');

describe('\'app-community\' service', () => {
  it('registered the service', () => {
    const service = app.service('app-community');

    assert.ok(service, 'Registered the service');
  });
});
