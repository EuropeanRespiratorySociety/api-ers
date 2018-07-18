const assert = require('assert');
const addReviewer = require('../../src/hooks/add-reviewer');

describe('\'add-reviewer\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      data: {},
      params: {user: {ersId: 123456}}
    };
    // Initialize our hook with no options
    const hook = addReviewer();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
