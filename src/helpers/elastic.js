const elasticsearch = require('elasticsearch');
const dotenv = require('dotenv');
dotenv.load();

const user = process.env.ESUSERNAME;
const pw = process.env.ESPASSWORD;
const url = process.env.ESBASEURL;

// add configuration option

const client = new elasticsearch.Client({
  host: `https://${user}:${pw}@${url}`,
  log: process.env.NODE_ENV === 'production' ? 'error' : 'trace'
});

const log = async (index, type, body) => {
  return await client.index({
    index,
    type,
    id: body.timestamp,
    body
  });
};

const index = async (item) => {
  return await client.index({
    index: 'content',
    type: 'item',
    id: item._doc,
    body: item
  });
};

module.exports = {
  client,
  log,
  index
};