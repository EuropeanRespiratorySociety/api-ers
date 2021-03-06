const m = require('moment');

/**
 * Given a CloudCMS Object, formats it as a Spotme notification
 * @param {*} obj 
 * @param {*} and 
 */
const formatNotification = (obj, and = false) => {
  const {
    published = false,
    body,
    title,
    channel,
    article = false, 
    link = false,
    notificationType,
    diseases = false,
    methods = false,
    members = false,
    myERS = false,
    sendDateTime = false
  } = obj._cloudcms.node.object;
  let targetsArray = [];
  let targetObj = {};

  if (diseases) {
    diseases.map(i => {
      and 
        ? targetObj[`interest:${i}`] = true
        : targetsArray.push({ [`interest:${i}`]: true });
    });
  }

  if (methods) {
    methods.map(i => {
      and
        ? targetObj[`interest:${i}`] = true
        : targetsArray.push({ [`interest:${i}`]: true });
    });
  }

  if (members) {
    and
      ? targetObj['MbshipStatus'] = members
      : targetsArray.forEach(i => i['MbshipStatus'] = members );
  }

  if (myERS) {
    and
      ? targetObj['logged_in_with_ers'] = true
      : targetsArray.forEach(i => i['logged_in_with_ers'] = true );
  }

  if (myERS && !diseases && !methods) {
    targetsArray.push({ ['logged_in_with_ers']: true });
  }

  if (members && !diseases && !methods) {
    targetsArray.push({ ['MbshipStatus']: true });
  }
  

  if (and) targetsArray.push(targetObj);

  // targetObj['ers_id'] = 203041;

  const basic = { 
    params: {
      mode: notificationType,
      body,
      title,
      channel,
      slug: article ? article.slug : undefined,
      url: link ? link : undefined,
      send_at: sendDateTime && notificationType !== 'push' ? m(sendDateTime, 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD[T]HH:mm') : undefined,
      targets: myERS || members || diseases || methods ? targetsArray : undefined
    }
  };

  return published
    ? basic
    : false;
};

module.exports = formatNotification;