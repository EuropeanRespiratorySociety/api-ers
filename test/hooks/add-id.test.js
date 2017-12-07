const assert = require('assert');
const addId = require('../../src/hooks/add-id');

describe('\'addId\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      data: {},
      params: {
        user: {
          _id: 'a1b2c3d4',
        }
      }
    };
    // Initialize our hook with no options
    const hook = addId();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
