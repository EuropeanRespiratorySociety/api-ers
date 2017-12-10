const assert = require('assert');
const { ccParserCategory, ccParserItem } = require('../../src/hooks/sb-parser');
// const chai = require('chai');

//use http plugin
// const expect = chai.expect;

const baseMock = {
  params: {
    query: { full: 'true' }
  },
  result: { 
    item: [{title: 'A category'}],
    items: [
      { title: 'title 1' },
      { title: 'title 2' }
    ],
    status: 200 
  }
};

describe('\'sb-parser\': category hook', () => {
  it('runs hook', () => {
    // A mock hook object
    const mock = baseMock;
    // Initialize our hook with no options
    const hook = ccParserCategory();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs hook with full param set to true', () => {
    // A mock hook object
    const mock = baseMock;
    // Initialize our hook with no options
    const hook = ccParserCategory();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs hook with param full set to \'true\' (string)', () => {
    // A mock hook object
    const mock = baseMock;
    // Initialize our hook with no options
    const hook = ccParserCategory();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs hook with param md set to \'true\' (string)', () => {
    // A mock hook object
    const mock = Object.assign(baseMock, {params: {query:{md:'true'}}});
    // Initialize our hook with no options
    const hook = ccParserCategory();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs hook with param md set to true', () => {
    // A mock hook object
    const mock = Object.assign(baseMock, {params: {query:{md: true }}});
    // Initialize our hook with no options
    const hook = ccParserCategory();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});

describe('\'sb-parser\': item hook', () => {
  it('runs hook', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {}
      },
      result: { 
        item: [{title: 'A title'}],
        status: 200 
      }
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
  
  it('runs hook with full set to false', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { full: false }
      },
      result: { 
        item: [{title: 'A title'}],
        status: 200 
      }
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


  it('runs hook with full set to \'false\' (string)', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { full: 'false' }
      },
      result: { 
        item: [{title: 'A title'}],
        status: 200 
      }
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



  it('runs hook with md set to \'true\' (string)', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { md: 'true' }
      },
      result: { 
        item: [{title: 'A title'}],
        status: 200 
      }
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

  it('runs hook with md set to true', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { md: true }
      },
      result: { 
        item: [{title: 'A title'}],
        status: 200 
      }
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


  it('runs hook not found.', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { full: true }
      },
      result: { 
        item: [{title: 'A title'}],
        status: 404 
      }
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