const assert = require('assert');
const { before, after } = require('../../src/hooks/training-aggs');

describe('\'training-aggs\' hook', () => {
  it('runs the before hook', () => {
    // A mock hook object
    const mock = {
      params: {
        user: {},
        query: {
          $limit: 25
        }
      },
      service: {
        Model: {
          aggregate: () => {
            return new Promise((resolve) => { resolve([]); });
          }
        }
      }
    };
    // Initialize our hook with no options
    const hook = before();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs the after hook', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {}
      },
      result: {
        data: [
          {
            classifiers: []
          }
        ]
      }
    };
    // Initialize our hook with no options
    const hook = after();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
