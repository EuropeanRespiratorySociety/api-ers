/* eslint-disable no-console */
const chalk = require('chalk');
const gitana = require('gitana');
const dotenv = require('dotenv');
dotenv.load();

const branch = process.env.CCBranch === undefined
  ? 'master'
  : process.env.CCBranch;

module.exports = () => {
  // connect to Cloud CMS
  // this looks for gitana.json in local directory
  gitana.connect({
    clientKey: process.env.clientKey,
    clientSecret: process.env.clientSecret,
    username: process.env.CCusername,
    password: process.env.CCpassword,
    baseURL: process.env.baseURL,
    application: process.env.application
  }, function (err) {

    if (err) {
      console.log('');
      console.log(chalk.red('There was a problem connecting to Cloud CMS'));
      if (process.env.NODE_ENV === 'test') {
        // Limiting what is publicly displayed on travis 
        if (err) console.log(chalk.red('---- Error report ----'));
        console.log('Status text: ', err.statusText);
        console.log('Status code: ', err.status);
        console.log('Error type code: ', err.errorType);
      } else {
        console.log(err);
      }
      process.exit(1);
    }

    // read the master branch
    this.datastore('content').readBranch(branch).then(function () {
      global.cloudcms = this;
      const message = `  Connected to Cloud CMS\n  Branch set (${this.title})`;
      console.log('');
      console.log(chalk.yellow('--------------------------------------'));
      console.log('');
      console.log(chalk.yellow(message));
      console.log('');
      console.log(chalk.yellow('--------------------------------------'));
      process.emit('Cloud CMS connected');
    });
  });
};