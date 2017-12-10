const assert = require('assert');
const prepareCalendar = require('../../src/hooks/prepare-calendar');

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
      data: array,
      params: {
        query: {}
      },
      result: {
        _sys: 200
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

  it('runs the hook in timeline mode', () => {
    // A mock hook object
    const mock = {
      data: array,
      params: {
        query: { timeline: 'true'}
      },
      result: {
        _sys: 200
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

  it('runs the hook reverse order', () => {
    // A mock hook object
    const mock = {
      data: array,
      params: {
        query: {reverse: 'true'}
      },
      result: {
        _sys: 200
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
      data: array,
      params: {
        query: {}
      },
      result: {
        _sys: 404
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