/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* eslint-disable no-unused-vars */
const nodemailer = require('nodemailer');
let deniedUsers = () => {
  const denied = process.env.DIGEST_ARTICLE_DENIED_USERS;
  if (denied) {
    return denied.split(',');
  }
  return [];
};

class Digest {
  async sendNotificationUpdate(data) {
    const item = data._cloudcms.node.object;
    console.log(JSON.stringify(item));
    // if (deniedUsers().includes(item._system.modified_by_principal_id)) {
    //   let html = '<p>Hello</p><p>This digest has been updated on CloudCMS:' + item.title + '</p>';
    //   let text = 'Hello, this digest has been updated on CloudCMS:' + item.title;
    //   let transporter = nodemailer.createTransport({
    //     pool: true,
    //     host: 'mailsrv3.ersnet.org',
    //     port: 25,
    //     secure: false
    //   });

    //   // verify connection configuration
    //   transporter.verify(function (error, success) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       let message = {
    //         from: 'webmaster@ersnet.org',
    //         to: 'florence.blocklet@ersnet.org',
    //         subject: 'CloudCMS: Digest Article Updated',
    //         text: text,
    //         html: html
    //       };
    //       transporter.sendMail(message, (err, info) => {
    //         console.log(err);
    //         console.log(info.envelope);
    //         console.log(info.messageId);
    //       });
    //     }
    //   });
    //}
  }
}

module.exports = new Digest();
