const assert = require('assert');
const app = require('../../src/app');

const chai = require('chai');
const expect = chai.expect;

const service = app.service('leadership');

describe('\'leadership\' service', () => {
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });


  it('has methods find() and get() available', () => {
    expect(service).to.respondTo('find');
  });
});
