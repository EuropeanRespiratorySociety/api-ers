const assert = require('assert');
const isOwner = require('../../src/hooks/isOwner').isOwner;

// const chai = require('chai');
// const expect = chai.expect;

describe('\'isOwner\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      id: '1',
      params: {
        user: {
          _id: 1
        }
      },
      error: {}
    };
    // Initialize our hook with no options
    const hook = isOwner();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});