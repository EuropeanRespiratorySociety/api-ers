const chai = require('chai');
const m = require('moment');
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
      loc: {},
      registerButton: {
        link: false,
        text: false,
      }
    };

    const parsed = u.parse(mock);
    expect(parsed).to.be.an('object')
      .to.include({
        _doc: 'thisIsAStringId-123456',
        hasAuthor: false,
        hasRelatedArticles: false,
      });

    expect(parsed).to.be.an('object')
      .not.to.include({
        shouldNotbeInclueded: 'yes, we do not want this in ES',
        norThat: false,
        faculty: false,
      });
    expect(parsed.tags).to.be.undefined;
    expect(parsed.loc).to.be.undefined;
    expect(parsed.registerButton).to.be.undefined;

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
    expect(u.hasLocation({ loc: {} })).to.be.false;
  });


  it('checks a location object with props set to false', () => {
    expect(u.hasLocation({ loc: { lat: false, long: false } })).to.be.false;
  });

  it('checks if a property is true', () => {
    expect(u.isTrue(false)).to.be.false;
    expect(u.isTrue('should be true')).to.be.true;
  });

  it('checks if an opertation is sucessful', () => {
    expect(u.isSucess({ stats: { result: 'updated' } })).to.be.true;
    expect(u.isSucess({ stats: { result: 'created' } })).to.be.true;
    expect(u.isSucess({ stats: { result: 'error' } })).to.be.false;
  });

  it('sets the _doc property (and removes the _id)', () => {
    // to improve this test we could have here a mongo id obj
    const r = u.setDocProperty({ _id: '123456' });
    expect(r)
      .to.include({ _id: undefined })
      .to.haveOwnProperty('_doc')
      .to.be.a('string')
      .to.equal('123456');
    expect(r.references).to.be.an('array');

  });

  it('sets properties found in an array', () => {
    const arrayOfIds = ['123456', '123457'];
    const arrayOfProps = [
      {
        id: '123456',
        some: 'propoperty',
        something: 'else'
      },
      {
        id: '123457',
        some: 'propoperty2',
        something: 'else2'
      },
      {
        id: 'abcdefg',
        some: 'propoperty3',
        something: 'else3'
      }

    ];
    const r = u.setProperties(arrayOfIds, arrayOfProps);
    expect(r).to.be.an('array');
    expect(r[0]).to.include({
      id: '123456',
      some: 'propoperty',
      something: 'else'
    });
    expect(r[1]).to.include({
      id: '123457',
      some: 'propoperty2',
      something: 'else2'
    });
    expect(r).not.to.deep.include({
      id: 'abcdefg',
      some: 'propoperty3',
      something: 'else3'
    });
  });

  it('sets properties found in an array with another id than the default\'s', () => {
    const arrayOfIds = ['123456', '123457'];
    const arrayOfProps = [
      {
        guid: '123456',
        some: 'propoperty',
        something: 'else'
      },
      {
        guid: '123457',
        some: 'propoperty2',
        something: 'else2'
      },
      {
        guid: 'abcdefg',
        some: 'propoperty3',
        something: 'else3'
      }

    ];
    const r = u.setProperties(arrayOfIds, arrayOfProps, 'guid');
    expect(r).to.be.an('array');
    expect(r[0]).to.include({
      guid: '123456',
      some: 'propoperty',
      something: 'else'
    });
    expect(r[1]).to.include({
      guid: '123457',
      some: 'propoperty2',
      something: 'else2'
    });
    expect(r).not.to.deep.include({
      guid: 'abcdefg',
      some: 'propoperty3',
      something: 'else3'
    });
  });

  it('parses a date', () => {
    const date = '/Date(1504535577940)/';
    // 
    expect(u.parseDate(date)).to.equal(m(date).format());
  });

  it('Does not parse a date', () => {
    const date = null;
    expect(u.parseDate(date)).to.equal(null);
  });

  it('Sets a register button', () => {
    const item = {
      registerButton: {
        link: 'http://link.some.where',
        text: 'Go there'
      }
    };
    const r = u.setRegisterButton(item);
    expect(r).to.be.an('object').to.deep.equal({
      link: 'http://link.some.where',
      text: 'Go there'
    });
  });

  it('Sets a register button (link only)', () => {
    const item = {
      registerButton: {
        link: 'http://link.some.where',
        text: false
      }
    };
    const r = u.setRegisterButton(item);
    expect(r).to.be.an('object').to.deep.equal({
      link: 'http://link.some.where'
    });
  });

  it('Unsets a register button property', () => {
    const item = {
      registerButton: {
        link: false,
        text: 'some text'
      }
    };
    const r = u.setRegisterButton(item);
    expect(r).to.be.undefined;
  });

});