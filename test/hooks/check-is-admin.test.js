const assert = require('assert');
const checkIsAdmin = require('../../src/hooks/check-is-admin');

const chai = require('chai');

const expect = chai.expect;
const hook = checkIsAdmin();

describe('\'checkIsAdmin\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      params: {
        user: {
          permissions: ['test']
        }
      }
    };

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('prevents to add any permissions', () => {
    const mock = {
      params: {
        user: {
          permissions: ['test']
        }
      },
      data: {
        permissions: ['admin']
      }
    };
    return hook(mock).catch(err => {
      expect(err.message).to.equal('You are not allowed to add permissions');
    });
  });

  it('Admins can add permissions', () => {
    const mock = {
      params: {
        user: {
          permissions: ['test', 'admin']
        }
      },
      data: {
        permissions: ['test2']
      }
    };
    return hook(mock).then(results => {
      // if permissions untouched it means it is ok to continue.
      expect(results.data.permissions).includes('test2');
    });
  });
});
