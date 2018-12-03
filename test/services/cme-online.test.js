const assert = require('assert');
const app = require('../../src/app');

describe('\'cme-online\' service', () => {
  it('registered the service', () => {
    const service = app.service('cme-online');

    assert.ok(service, 'Registered the service');
  });

});
