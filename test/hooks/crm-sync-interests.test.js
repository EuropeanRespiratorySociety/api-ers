const assert = require('assert');
const syncInteresests = require('../../src/hooks/crm-sync-interests');

describe('\'syncInteresests\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      data: {
        interests: []
      },
      params: {
        crmToken: 'thisIsTheToken',
        crmInterests: {
          diseases:[],
          methods:[]
        },
        user: {
          ersId: 123456
        }
      }
    };
    // Initialize our hook with no options
    const hook = syncInteresests();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
