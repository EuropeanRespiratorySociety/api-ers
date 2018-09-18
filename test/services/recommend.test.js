const assert = require('assert');
const app = require('../../src/app');

describe('\'recommend\' service', () => {
  it('registered the service', () => {
    const service = app.service('recommend');

    assert.ok(service, 'Registered the service');
  });
});
