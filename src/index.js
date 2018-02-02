/* eslint-disable no-console */
const chalk = require('chalk');
const logger = require('winston');
const dotenv = require('dotenv');
const app = require('./app');
const port = app.get('port');
dotenv.load();

const gitana = require('gitana');

// connect to Cloud CMS
// this looks for gitana.json in local directory
gitana.connect({
  clientKey: process.env.clientKey,
  clientSecret: process.env.clientSecret,
  username: process.env.CCusername,
  password: process.env.CCpassword,
  baseURL: process.env.baseURL,
  application: process.env.application
}, function(err) {

  if (err) {
    console.log('');
    console.log(chalk.red('There was a problem connecting to Cloud CMS'));
    if(process.env.NODE_ENV === 'test'){
      // Limiting what is publicly displayed on travis 
      if(err) console.log(chalk.red('---- Error report ----'));
      console.log('Status text: ', err.statusText);
      console.log('Status code: ', err.status);
      console.log('Error type code: ', err.errorType);
    } else {
      console.log(err);
    }
    process.exit(1);
  }

  // read the master branch
  this.datastore('content').readBranch('master').then(function() {
    global.cloudcms = this;
    console.log('');
    console.log(chalk.yellow('--------------------------------------'));
    console.log('');
    console.log(chalk.yellow('  Connected to Cloud CMS, Branch set'));
    console.log('');
    console.log(chalk.yellow('--------------------------------------'));
    startServer();
  });          
});

function startServer() {
  const server = app.listen(port);

  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  );

  server.on('listening', () => {
    console.log('');
    console.log(chalk.green('--------------------------------------'));
    console.log('');
    console.log(chalk.green(`  ERS API started on ${app.get('host')}:${port}`));
    console.log('');
    console.log(chalk.green('--------------------------------------'));
  }
  );
}



