const assert = require('assert');
const pushToArray = require('../../src/hooks/push-spotmeId-to-array');

const chai = require('chai');
const expect = chai.expect;

describe('\'pushToArray\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      id: 'someId',
      data: {
        spotmeId: ['newId']
      },
      service: {
        get () {
          return { spotmeId: ['123alreadythere'] };
        }
      }
    };
    // Initialize our hook with no options
    const hook = pushToArray();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('ads an id to the array', () => {
    // A mock hook object
    const mock = {
      id: 'someId',
      data: {
        spotmeId: ['newId']
      },
      service: {
        get () {
          return { spotmeId: ['123alreadythere'] };
        }
      }
    };
    // Initialize our hook with no options
    const hook = pushToArray();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.data.spotmeId).to.be.an('array')
        .to.have.lengthOf(2);
    });
  });

  it('manages previously saved data', () => {
    // A mock hook object
    const mock = {
      id: 'someId',
      data: {
        spotmeId: ['newId']
      },
      service: {
        get () {
          return { spotmeId: '123alreadythere' };
        }
      }
    };
    // Initialize our hook with no options
    const hook = pushToArray();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.data.spotmeId).to.be.an('array')
        .to.have.lengthOf(2);
    });
  });

  it('does not add duplicated values', () => {
    // A mock hook object
    const mock = {
      id: 'someId',
      data: {
        spotmeId: ['123alreadythere']
      },
      service: {
        get () {
          return { spotmeId: ['123alreadythere'] };
        }
      }
    };
    // Initialize our hook with no options
    const hook = pushToArray();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.data.spotmeId).to.be.an('array')
        .to.have.lengthOf(1);
    });
  });



  it('does not do anything if no spotmeId found', () => {
    // A mock hook object
    const mock = {
      id: 'someId',
      data: {
        spotmeId: ['newValue']
      },
      service: {
        get () {
          return {};
        }
      }
    };
    // Initialize our hook with no options
    const hook = pushToArray();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.data.spotmeId).to.be.an('array')
        .to.have.lengthOf(1);
      expect(result.data.spotmeId[0]).to.equal('newValue');
    });
  });
});
