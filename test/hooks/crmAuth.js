const assert = require('assert');
const { crmAuth } = require('../../src/hooks/crmAuth');
const chai = require('chai');

//use http plugin
const expect = chai.expect;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

describe('\'crmAuth\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      params: {}
    };
    // Initialize our hook with no options
    const hook = crmAuth();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
      expect(result.params.crmToken).to.be.a('string');
    });
  });
});