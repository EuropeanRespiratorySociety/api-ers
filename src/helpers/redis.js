const redis = require('redis');
const dotenv = require('dotenv');
dotenv.load();
const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1'
});
module.exports = client;