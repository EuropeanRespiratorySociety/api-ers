// temporary router intitialization bedore integrating the logger in feathers-redis-cache
const es = require('./elastic.js');
const m = require('moment');
const routes = require('feathers-hooks-rediscache').cacheRoutes;
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

  // await es.log('api-logs', 'cache', log);
  
  // eslint-disable-next-line no-console
  console.log(`${req.ip} - [${new Date()}] - "${req.method} ${req.url}"`);
  next();
};

const r = (app) => {
  const router = routes(app);
  // hacky way to add a middelware at first position
  router.stack.unshift(router.use(logger).stack.pop());
  return router;
};

module.exports = r;
