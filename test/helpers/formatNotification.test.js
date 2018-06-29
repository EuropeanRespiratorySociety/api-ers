const m = require('moment');
const chai = require('chai');
const expect = chai.expect;

const s = require('../../src/helpers/formatNotification');
const mock = require('../mocks/notification.json');
const mockWithError = require('../mocks/notificationWithError.json');
const mockPush = require('../mocks/pushNotification.json');
const mockPushToUrl = require('../mocks/pushNotificationToUrl.json');

describe('\'formatNotification\' helper', () => {
  it('is correctly imported', () => {
    expect(s).to.be.a('function');
  });

  it('[and] formats a scheduled notification', () => {
    const valid = {
      params: {
        body: 'This is the body of the notification',
        targets: [
          { 
            'interest:Epidemiology': true,
            'interest:Pulmonary function testing': true,
            'interest:Paediatric respiratory diseases': true,
            'interest:Respiratory critical care': true,
            'interest:Respiratory infections': true,
            'logged_in_with_ers': true,
            'MbshipStatus': true
          }
        ],
        title: 'This is a test notification',
        slug: 'new-cme-online-module-a-case-of-difficult-asthma',
        channel: 'alerts',
        mode: 'schedule',
        send_at: m('06/30/2018 14:22:21', 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD[T]HH:mm')
      }
    };
    const r = s(mock, true);
    expect(r).to.be.an('object')
      .to.haveOwnProperty('params')
      .to.be.an('object');
    expect(r.params.body).to.equal(valid.params.body);
    expect(r.params.channel).to.equal(valid.params.channel);
    expect(r.params.title).to.equal(valid.params.title);
    expect(r.params.mode).to.equal(valid.params.mode);
    expect(r.params.send_at).to.equal(valid.params.send_at);
    expect(r.params.slug).to.equal(valid.params.slug);
    expect(r.params.targets[0])
      .to.be.an('object')
      .to.haveOwnProperty('interest:Epidemiology')
      .to.be.ok;
    expect(r.params.targets[0]['interest:Paediatric respiratory diseases']).to.be.ok;
    expect(r.params.targets[0]['interest:Pulmonary function testing']).to.be.ok;
    expect(r.params.targets[0]['interest:Respiratory critical care']).to.be.ok;
    expect(r.params.targets[0]['interest:Respiratory infections']).to.be.ok;
    expect(r.params.targets[0]['logged_in_with_ers']).to.be.ok;
    expect(r.params.targets[0]['MbshipStatus']).to.be.ok;
    expect(r.params.url).to.be.undefined;
  });

  it('[or] formats a scheduled notification', () => {
    const valid = {
      params: {
        body: 'This is the body of the notification',
        targets: [
          {
            'interest:Epidemiology': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          },
          {
            'interest:Pulmonary function testing': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          },
          {
            'interest:Paediatric respiratory diseases': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          },
          {
            'interest:Respiratory critical care': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          },
          {
            'interest:Respiratory infections': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          }
        ],
        title: 'This is a test notification',
        slug: 'new-cme-online-module-a-case-of-difficult-asthma',
        channel: 'alerts',
        mode: 'schedule',
        send_at: m('06/30/2018 14:22:21', 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD[T]HH:mm')
      }
    };
    const r = s(mock);
    expect(r).to.be.an('object')
      .to.haveOwnProperty('params')
      .to.be.an('object');
    expect(r.params.body).to.equal(valid.params.body);
    expect(r.params.channel).to.equal(valid.params.channel);
    expect(r.params.title).to.equal(valid.params.title);
    expect(r.params.mode).to.equal(valid.params.mode);
    expect(r.params.send_at).to.equal(valid.params.send_at);
    expect(r.params.slug).to.equal(valid.params.slug);
    expect(r.params.targets).to.be.an('array').to.have.lengthOf(5);
    expect(r.params.targets[3]['interest:Epidemiology']).to.be.ok;
    expect(r.params.targets[3]['logged_in_with_ers']).to.be.ok;
    expect(r.params.targets[3]['MbshipStatus']).to.be.ok;
    expect(r.params.targets[0]['interest:Paediatric respiratory diseases']).to.be.ok;
    expect(r.params.targets[0]['logged_in_with_ers']).to.be.ok;
    expect(r.params.targets[0]['MbshipStatus']).to.be.ok;
    expect(r.params.targets[4]['interest:Pulmonary function testing']).to.be.ok;
    expect(r.params.targets[4]['logged_in_with_ers']).to.be.ok;
    expect(r.params.targets[4]['MbshipStatus']).to.be.ok;
    expect(r.params.targets[1]['interest:Respiratory critical care']).to.be.ok;
    expect(r.params.targets[1]['logged_in_with_ers']).to.be.ok;
    expect(r.params.targets[1]['MbshipStatus']).to.be.ok;
    expect(r.params.targets[2]['interest:Respiratory infections']).to.be.ok;
    expect(r.params.targets[2]['logged_in_with_ers']).to.be.ok;
    expect(r.params.targets[2]['MbshipStatus']).to.be.ok;
    expect(r.params.url).to.be.undefined;
  });

  it('[or] formats a push notification', () => {
    const valid = {
      params: {
        body: 'This is the body of the notification',
        targets: [
          {
            'interest:Epidemiology': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          },
          {
            'interest:Pulmonary function testing': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          },
          {
            'interest:Paediatric respiratory diseases': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          },
          {
            'interest:Respiratory critical care': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          },
          {
            'interest:Respiratory infections': true,
            'MbshipStatus': true,
            'logged_in_with_ers': true
          }
        ],
        title: 'This is a test notification',
        slug: 'new-cme-online-module-a-case-of-difficult-asthma',
        channel: 'alerts',
        mode: 'push',
        send_at: m('06/30/2018 14:22:21', 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD[T]HH:mm')
      }
    };
    const r = s(mockWithError);
    expect(r).to.be.an('object')
      .to.haveOwnProperty('params')
      .to.be.an('object');
    expect(r.params.body).to.equal(valid.params.body);
    expect(r.params.channel).to.equal(valid.params.channel);
    expect(r.params.title).to.equal(valid.params.title);
    expect(r.params.mode).to.equal(valid.params.mode);
    expect(r.params.slug).to.equal(valid.params.slug);
    expect(r.params.targets).to.be.an('array').to.have.lengthOf(5);
    expect(r.params.targets[0]['interest:Paediatric respiratory diseases']).to.be.ok;
    expect(r.params.url).to.be.undefined;
    expect(r.params.send_at).to.be.undefined;
  });

  it('[and] formats a push notification', () => {
    const valid = {
      params: {
        body: 'This is the body of the notification',
        targets: [
          { 
            'interest:Epidemiology': true,
            'interest:Pulmonary function testing': true,
            'interest:Paediatric respiratory diseases': true,
            'interest:Respiratory critical care': true,
            'interest:Respiratory infections': true,
            'logged_in_with_ers': true,
            'MbshipStatus': true
          }
        ],
        title: 'This is a test notification',
        slug: 'new-cme-online-module-a-case-of-difficult-asthma',
        channel: 'alerts',
        mode: 'push',
      }
    };
    const r = s(mockPush, true);
    expect(r).to.be.an('object')
      .to.haveOwnProperty('params')
      .to.be.an('object');
    expect(r.params.channel).to.equal(valid.params.channel);
    expect(r.params.mode).to.equal(valid.params.mode);
    expect(r.params.targets[0])
      .to.be.an('object')
      .to.haveOwnProperty('interest:Paediatric respiratory diseases')
      .to.be.ok;
    expect(r.params.url).to.be.undefined;
    expect(r.params.send_at).to.be.undefined;
  });

  it('[and] formats a push notification to an url', () => {
    const valid = {
      params: {
        body: 'This is the body of the notification',
        targets: [
          { 
            'interest:Epidemiology': true,
            'interest:Pulmonary function testing': true,
            'interest:Paediatric respiratory diseases': true,
            'interest:Respiratory critical care': true,
            'interest:Respiratory infections': true,
            'logged_in_with_ers': true,
          }
        ],
        title: 'This is a test notification', 
        url: 'http://link.somewhere.com',
        channel: 'alerts',
        mode: 'push',
      }
    };
    const r = s(mockPushToUrl, true);
    expect(r).to.be.an('object')
      .to.haveOwnProperty('params')
      .to.be.an('object');
    expect(r.params.channel).to.equal(valid.params.channel);
    expect(r.params.mode).to.equal(valid.params.mode);
    expect(r.params.url).to.equal(valid.params.url);
    expect(r.params.slug).to.be.undefined;
    expect(r.params.send_at).to.be.undefined;
  });

  it('[and] does not format the notification it is not published', () => {
    const r = s({_cloudcms:{node:{object:{published:false}}}}, true);
    expect(r).not.to.be.ok;
  });

  it('[and] does not format the notification publication status is not available', () => {
    const r = s({_cloudcms:{node:{object:{}}}}, true);
    expect(r).not.to.be.ok;
  });
});