const redis = require('redis');
const dotenv = require('dotenv');
dotenv.load();
const client = redis.createClient();
client.auth(process.env.REDISPW);

module.exports = client;