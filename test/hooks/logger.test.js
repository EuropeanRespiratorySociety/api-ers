const assert = require('assert');
const logger = require('../../src/hooks/logger');
// const chai = require('chai');
// const expect = chai.expect;

describe('\'logger\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      data: {},
      params: {},
      type: 'test',
      path: '/test/path',
      method: 'GOTIT',
      error: {}
    };
    // Initialize our hook with no options
    const hook = logger();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    const result = hook(mock);
    assert.equal(result, mock, 'Returns the expected hook object');
  });

  it('loggs an error', () => {
    // A mock hook object
    const mock = {
      data: {},
      params: {},
      type: 'error',
      path: '/test/path',
      method: 'GOTIT',
      error: { message: 'this is an error'}
    };
    // Initialize our hook with no options
    const hook = logger();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    const result = hook(mock);
    assert.equal(result, mock, 'Returns the expected hook object');
  });

  it('handles result', () => {
    // A mock hook object
    const mock = {
      data: {},
      params: {},
      result: {data: [{title: 'this is a title'}]},
      type: 'error',
      path: '/test/path',
      method: 'GOTIT',
      error: { message: 'this is an error'}
    };
    // Initialize our hook with no options
    const hook = logger();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    const result = hook(mock);
    assert.equal(result, mock, 'Returns the expected hook object');
  });
});
