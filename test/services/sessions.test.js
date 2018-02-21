const assert = require('assert');
const app = require('../../src/app');

describe('\'sessions\' service', () => {
  it('registered the service', () => {
    const service = app.service('congress/sessions');

    assert.ok(service, 'Registered the service');
  });
});
