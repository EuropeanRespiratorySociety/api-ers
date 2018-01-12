const courses = require('../../src/hooks/courses');

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

describe('\'courses\' hook', () => {
  it('runs the hook with defaults (returns only future events)', () => {
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
    const hook = courses();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.result.data).to.be.an('array');
      expect(result.result.data).to.have.lengthOf(3);
      expect(result.result.data[0]).to.be.an('object');
    });
  });

  it('returns all events', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {
          type: 'all'
        }
      },
      result: {
        data: array,
        _sys: {
          status: 200
        }
      }
    };
    // Initialize our hook with no options
    const hook = courses();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.result.data).to.be.an('array');
      expect(result.result.data).to.have.lengthOf(5);
      expect(result.result.data[0]).to.be.an('object');
    });
  });

  it('returns only past events', () => {
    // A mock hook object
    const mock = {
      params: {
        query: {
          type: 'past'
        }
      },
      result: {
        data: array,
        _sys: {
          status: 200
        }
      }
    };
    // Initialize our hook with no options
    const hook = courses();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      expect(result.result.data).to.be.an('array');
      expect(result.result.data).to.have.lengthOf(2);
      expect(result.result.data[0]).to.be.an('object')
        .to.haveOwnProperty('title').to.equal('title 1');
    });
  });
});
