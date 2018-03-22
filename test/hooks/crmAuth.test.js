const assert = require('assert');
const { crmAuth } = require('../../src/hooks/crmAuth');
const chai = require('chai');

const redis = require('redis');
const client = redis.createClient();

//use http plugin
const expect = chai.expect;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

describe('\'crmAuth\' hook', () => {
  it('runs the hook without key', () => {
    // A mock hook object
    const mock = {
      params: {}
    };

    // first delete the key:
    client.del('myCrm_api_key');
    
    // Initialize our hook with no options
    const hook = crmAuth();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
      expect(result.params.crmToken).to.be.a('string');
    });
  });

  it('runs the hook with saved key', () => {
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