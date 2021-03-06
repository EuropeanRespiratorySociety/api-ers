const assert = require('assert');
const formatJournal = require('../../src/hooks/format-journal');
const m = require('moment');

describe('\'formatJournal\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {
      method: 'get',
      result: {
        publication_date: '2017-12-31T23:00:00.000Z'
      }
    };
    // Initialize our hook with no options
    const hook = formatJournal();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('formats the date for a single article', () =>{
    const date = m().format();
    const mock = {
      method: 'get',
      result: {
        publication_date: date
      }
    };

    const hook = formatJournal();

    return hook(mock).then(result => {
      assert.equal(result.result.publication_date, m(date).format('D MMMM, YYYY'));
    });
  });

  it('does not break if no date on a single article', () =>{
    const mock = {
      method: 'get',
      result: {
        no_date: 'indeed'
      }
    };

    const hook = formatJournal();

    return hook(mock).then(result => {
      assert.equal(result.result.no_date, 'indeed');
    });
  });

  it('formats the date for a list of articles', () =>{
    const date = m().format();
    const mock = {
      method: 'find',
      result: {
        data: [
          {
            publication_date: date
          },
          {
            publication_date: date
          }
        ]  
      }
    };

    const hook = formatJournal();

    return hook(mock).then(result => {
      assert.equal(result.result.data[0].publication_date, m(date).format('D MMMM, YYYY'));
      assert.equal(result.result.data[1].publication_date, m(date).format('D MMMM, YYYY'));
    });
  });

  it('it does not break if no publication date', () =>{
    const mock = {
      method: 'find',
      result: {
        data: [
          {
            no_date: 'indeed'
          },
          {
            no_date: 'indeed'
          }
        ]  
      }
    };

    const hook = formatJournal();

    return hook(mock).then(result => {
      assert.equal(result.result.data[0].no_date, 'indeed');
    });
  });
});
