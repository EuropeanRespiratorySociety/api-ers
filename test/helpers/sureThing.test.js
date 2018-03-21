
const chai = require('chai');
const expect = chai.expect;

const s = require('../../src/helpers/sureThing');

describe('\'sureThing\' helper', () => {
  it('is correctly imported', () => {
    expect(s).to.be.a('function');
  });

  it('responds to a resolved promise', async () => {
    const test = () => Promise.resolve('sucess');
    const {ok, response, error} = await s(test());
    expect(ok).to.be.ok;
    expect(response).to.equal('sucess');
    expect(error).to.be.undefined;
  });

  it('responds to a rejected promise', async () => {
    const test = () => Promise.reject({response:{data:'failed'}});
    const {ok, response, error} = await s(test());

    expect(ok).not.to.be.ok;
    expect(response).to.be.undefined;
    expect(error).to.equal('failed');
  });


});