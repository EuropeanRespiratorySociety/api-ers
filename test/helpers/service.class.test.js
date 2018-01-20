const assert = require('assert');
const app = require('../../src/app');

const chai = require('chai');
const expect = chai.expect;

const createService = require('../../src/helpers/service.class');


describe('\'generic\' service', () => {

  const options = {
    name: 'generic',
    qname: 'o:f913cff03624ac461283',
    paginate: {default: 25}
  };

  // we do as if we  create a service.
  app.use('/generic', createService(options));
  const service = app.service('generic');

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it('is correctly constructed', () => {
    expect(service.options.name).to.equal('generic');
    expect(service.options.qname).to.equal('o:f913cff03624ac461283');
    expect(service.options.paginate.default).to.equal(25);
  });

  it('provides method find', () => {
    expect(service).itself.to.respondTo('find');
  });
});

describe('\'generic\' service without option', () => {
  // here we only check the option condition
  // as the service cannot function without
  // qname and other needed options.

  it('does not register the service', () => {
    expect(createService).to.throw('options object is mandatory');
  });


});