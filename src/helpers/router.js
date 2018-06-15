// temporary router intitialization before integrating the logger in feathers-redis-cache
const es = require('./elastic.js');
const chalk = require('chalk');
const m = require('moment');
const routes = require('feathers-hooks-rediscache').cacheRoutes;
const dotenv = require('dotenv');
dotenv.load();

const logger = async (req,res,next) => {
  // eslint-disable-next-line no-console
  const timestamp = m().format('x');
  const log = {
    timestamp,
    date: new Date(),
    ip: req.ip,
    method: req.method,
    url: req.url
  };
  // eslint-disable-next-line no-console
  console.log(chalk.cyan('[cache]'), `- ${req.ip} - [${new Date()}] - "${req.method} ${req.url}"`);
  if(process.env.NODE_ENV === 'production') {
    try {
      await es.log('api-logs', '_doc', log, 'geoip');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
  next();
};

const r = (app) => {
  const router = routes(app);
  // hacky way to add a middelware at first position
  router.stack.unshift(router.use(logger).stack.pop());
  return router;
};

module.exports = r;
