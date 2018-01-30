const assert = require('assert');
const app = require('../../src/app');

const service = app.service('sleepandbreathing');

const chai = require('chai');
const expect = chai.expect;

describe('\'sleepandbreathing\' service', () => {
  it('registered the service', () => {

    assert.ok(service, 'Registered the service');
  });

  it('has methods find() and get() available', () => {
    expect(service).to.respondTo('find');
    expect(service).to.respondTo('get');
  });
});
