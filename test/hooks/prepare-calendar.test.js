const assert = require('assert');
const prepareCalendar = require('../../src/hooks/prepare-calendar');
const chai = require('chai');
const expect = chai.expect;

const moment = require('moment');
const minusAWeek = moment().subtract(7, 'days');
const plusAWeek = moment().add(7, 'days');
const plusTwoMonths = moment().add(2, 'months');
const plusAYear = moment().add(1, 'year');
const array = [
  {
    title: 'title 1',
    eventDate: minusAWeek.format('MM/DD/YYYY')
  },
  {
    title: 'title 2',
    eventDate: plusAWeek.format('MM/DD/YYYY')
  },
  {
    title: 'title 3',
    eventDate: plusTwoMonths.format('MM/DD/YYYY')
  },
  {
    title: 'title 4',
    eventDate: plusAYear.format('MM/DD/YYYY')
  },
  {
    title: 'title 5',
    eventDate: false
  }
];

describe('\'prepare calendar\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {}
      },
      result: {
        data: array,
        _sys: {
          status: 200
        }
      }
    };
    // Initialize our hook with no options
    const hook = prepareCalendar();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
      expect(result.result.data).to.be.an('array');
      expect(result.result.data[0]).to.be.an('object');
    });
  });

  it('runs the hook in timeline mode (true === string)', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { timeline: 'true'}
      },
      result: {
        _sys: {
          status: 200
        },
        data: array
      }
    };
    // Initialize our hook with no options
    const hook = prepareCalendar();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
      expect(result.result.data).to.be.an('object');
      expect(result.result.data[minusAWeek.format('YYYY')]).to.be.an('object');
    });
  });

  it('runs the hook in timeline mode (true === boolean)', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { timeline: true}
      },
      result: {
        _sys: {
          status: 200
        },
        data: array
      }
    };
    // Initialize our hook with no options
    const hook = prepareCalendar();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs the hook in timeline mode (false === boolean)', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { timeline: 'false'}
      },
      result: {
        _sys: {
          status: 200
        },
        data: array
      }
    };
    // Initialize our hook with no options
    const hook = prepareCalendar();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
      expect(result.result.data).to.be.an('array');
      expect(result.result.data[0]).to.be.an('object');
    });
  });

  it('runs the hook in timeline mode (false === string)', () => {
    // A mock hook object
    const mock = {
      params: {
        query: { timeline: false}
      },
      result: {
        _sys: {
          status: 200
        },
        data: array
      }
    };
    // Initialize our hook with no options
    const hook = prepareCalendar();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
      expect(result.result.data).to.be.an('array');
      expect(result.result.data[0]).to.be.an('object');
    });
  });

  it('runs the hook reverse order', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {reverse: 'true'}
      },
      result: {
        data: array,
        _sys: {
          status: 200
        }
      }
    };
    // Initialize our hook with no options
    const hook = prepareCalendar();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs the hook with not found set', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {}
      },
      result: {
        data: array,
        _sys: {
          status: 404
        }
      }
    };
    // Initialize our hook with no options
    const hook = prepareCalendar();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});