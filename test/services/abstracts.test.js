const assert = require('assert');
const app = require('../../src/app');

describe('\'abstracts\' service', () => {
  it('registered the service', () => {
    const service = app.service('congress/abstracts');

    assert.ok(service, 'Registered the service');
  });
});
