const chai = require('chai');
const expect = chai.expect;

const u = require('../../src/services/webhook/webhook.utils');


describe('\'webhook\' utils', () => {
  it('is correctly imported', () => {
    expect(u).to.be.an('object');
  });
  
  it('gives access to methods', () => {
    expect(u).to.respondTo('parse');
    expect(u).to.respondTo('hasLocation');
    expect(u).to.respondTo('isTrue');
    expect(u).to.respondTo('isSucess');
    expect(u).to.respondTo('getAsync');
    expect(u).to.respondTo('setAsync');
  });

  it('parses an item', () => {
    const mock = {
      _doc: 'thisIsAStringId-123456',
      shouldNotbeInclueded: 'yes, we do not want this in ES',
      norThat: false,
      faculty: false,
      hasAuthor: 0,
      hasRelatedArticles: 0,
      tags: [],
      loc: {}
    };

    expect(u.parse(mock)).to.be.an('object')
      .to.include({
        _doc: 'thisIsAStringId-123456',
        hasAuthor: false,
        hasRelatedArticles: false,
      })
      .but.not.include({
        shouldNotbeInclueded: 'yes, we do not want this in ES',
        norThat: false,
        faculty: false,
        tags: [],
        loc: {}
      });
  });

  it('parses an item (with author and related articles)', () => {
    const mock = {
      _doc: 'thisIsAStringId-123456',
      shouldNotbeInclueded: 'yes, we do not want this in ES',
      norThat: false,
      faculty: false,
      hasAuthor: 1,
      hasRelatedArticles: 1,
      tags: [],
      loc: {}
    };

    expect(u.parse(mock)).to.be.an('object')
      .to.include({
        _doc: 'thisIsAStringId-123456',
        hasAuthor: true,
        hasRelatedArticles: true,
      })
      .but.not.include({
        shouldNotbeInclueded: 'yes, we do not want this in ES',
        norThat: false,
        faculty: false,
        tags: [],
        loc: {}
      });
  });

  it('parses an item (with location)', () => {
    const mock = {
      _doc: 'thisIsAStringId-123456',
      loc: {
        lat: 10.00,
        long: 10.01
      }
    };

    expect(u.parse(mock)).to.be.an('object')
      .to.deep.include({
        _doc: 'thisIsAStringId-123456',
        loc: {
          lat: 10.00,
          lon: 10.01
        }
      });
  });

  it('checks location object', () => {
    expect(u.hasLocation({
      loc: {
        lat: 10.00,
        long: 10.01
      }
    })).to.be.true;
  });

  it('checks an empty location object', () => {
    expect(u.hasLocation({loc:{}})).to.be.false;
  });

  it('checks if a property is true', () => {
    expect(u.isTrue(false)).to.be.false;
    expect(u.isTrue('should be true')).to.be.true;
  });

  it('checks if an opertation is sucessful', () => {
    expect(u.isSucess({stats:{result: 'updated'}})).to.be.true;
    expect(u.isSucess({stats:{result: 'created'}})).to.be.true;
    expect(u.isSucess({stats:{result: 'error'}})).to.be.false;
  });

  it('sets the _doc property (and removes the _id)', () => {
    // to improve this test we could have here a mongo id obj
    expect(u.setDocProperty({_id: '123456'}))
      .to.include({_id: undefined})
      .to.haveOwnProperty('_doc')
      .to.be.a('string')
      .to.equal('123456');

  });
});