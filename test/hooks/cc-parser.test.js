const assert = require('assert');
const { ccParserCategory, ccParserItem } = require('../../src/hooks/cc-parser');
const chai = require('chai');
const expect = chai.expect;

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

describe('\'cc-parser\': category hook', () => {
  it('runs hook', () => {
    // A mock hook object
    const mock = baseMock;
    // Initialize our hook with no options
    const hook = ccParserCategory();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
      expect(result.result.data).to.be.an('array');
      expect(result.result.data[0]).to.be.an('object');
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

  it('runs hook with param type set to \'html\' (string)', () => {
    // A mock hook object
    const mock = Object.assign(baseMock, {params: {query:{type:'html'}}});
    // Initialize our hook with no options
    const hook = ccParserCategory();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      // eslint-disable-next-line no-console
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs hook with param type set to raw', () => {
    // A mock hook object
    const mock = Object.assign(baseMock, {params: {query:{type: 'raw' }}});
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

describe('\'cc-parser\': item hook', () => {
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

  it('runs hook with format set to markdown', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { format: 'markdown' }
      },
      result: { 
        item: [
          {
            title: 'A title',
            body: '### this is a body subtitle'
          }
        ],
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
      expect(result.result.data.body).to.equal('### this is a body subtitle');
    });
  });

  it('runs hook with format set to raw', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { format: 'raw' }
      },
      result: { 
        item: [
          {
            title: 'A title',
            body: '### this is a body subtitle'
          }
        ],
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
      expect(result.result.data.body).to.equal('this is a body subtitle\n');
    });
  });

  it('runs hook with format set to html', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { format: 'html' }
      },
      result: { 
        item: [
          {
            title: 'A title',
            body: '### this is a body subtitle'
          }
        ],
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
      expect(result.result.data.body).to.equal('<h3>this is a body subtitle</h3>\n');
    });
  });

  it('runs hook - returns html as it is set by default', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {}
      },
      result: { 
        item: [
          {
            title: 'A title',
            body: '### this is a body subtitle'
          }
        ],
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
      expect(result.result.data.body).to.equal('<h3>this is a body subtitle</h3>\n');
    });
  });

  it('runs Item hook not found.', () => {
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