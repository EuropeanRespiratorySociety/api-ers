/* eslint-disable no-console */
const chalk = require('chalk');
const logger = require('winston');
const app = require('./app');
const port = app.get('port');

module.exports = () => {
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
};
