const assert = require('assert');
const { ccParserCategory, ccParserItem } = require('../../src/hooks/cc-parser');
// const chai = require('chai');

//use http plugin
// const expect = chai.expect;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

describe('\'cc-parser\' hook', () => {
  it('runs Category hook', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {}
      },
      result: {}
    };
    // Initialize our hook with no options
    const hook = ccParserCategory();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs Item hook', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {}
      },
      result: {}
    };
    // Initialize our hook with no options
    const hook = ccParserItem();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
    
  it('runs Item hook', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { full: true }
      },
      result: {},
      item: {title: 'A title'}
    };
    // Initialize our hook with no options
    const hook = ccParserItem();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

});