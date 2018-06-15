const assert = require('assert');
const addJournalLink = require('../../src/hooks/add-journal-link');

describe('\'addJournalLink\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      params: {}
    };
    // Initialize our hook with no options
    const hook = addJournalLink();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
