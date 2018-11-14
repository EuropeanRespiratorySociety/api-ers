const assert = require('assert');
const app = require('../../src/app');

describe('\'test-cloudcms\' service', () => {
  it('registered the service', () => {
    const service = app.service('test-cloudcms');

    assert.ok(service, 'Registered the service');
  });
});
