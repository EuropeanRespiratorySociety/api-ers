const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const routes = require('feathers-hooks-rediscache').cacheRoutes;
const redisClient = require('feathers-hooks-rediscache').redisClient;

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const swagger = require('feathers-swagger');
const swOptions = require('./swagger/swagger');

const authentication = require('./authentication');
const mongodb = require('./mongodb');

const app = feathers();

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up cache routes
// configure the redis client
app.configure(redisClient);
app.use('/cache', routes(app));

// Set up Plugins and providers
app.configure(mongodb);
app.configure(hooks());
app.configure(rest());
app.configure(socketio());

// Configure Swagger
app.configure(swagger(swOptions));

app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

module.exports = app;
