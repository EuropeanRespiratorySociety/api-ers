// A hook that logs service method before, after and error
const winston = require('winston');
const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = () => {
  return hook => {
    let message = `${hook.type}: ${hook.path} - Method: ${hook.method}`;

    if (hook.type === 'error') {
      message += ` - Error: ${hook.error.message}`;
    }


    logger.info(message);
    logger.debug('hook.data', hook.data);
    logger.debug('hook.params', hook.params);

    if (hook.result) {
      logger.debug('hook.result', hook.result);
    }

    if (hook.error) {
      logger.error(hook.error);
    }
    return hook;
  };
};

[
  new winston.transports.Console(),
  new winston.transports.File({ filename: 'logfile.log' })
];
