const assert = require('assert');
const app = require('../../src/app');

describe('\'leadership\' service', () => {
  it('registered the service', () => {
    const service = app.service('leadership');

    assert.ok(service, 'Registered the service');
  });
});
