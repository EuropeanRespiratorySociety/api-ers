const assert = require('assert');
const app = require('../../src/app');

describe('\'cpd\' service', () => {
  it('registered the service', () => {
    const service = app.service('cpd');

    assert.ok(service, 'Registered the service');
  });
});
