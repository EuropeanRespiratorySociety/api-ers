const errors = require('@feathersjs/errors');
const elasticsearch = require('elasticsearch');
const dotenv = require('dotenv');
dotenv.load();

const user = process.env.ESUSERNAME;
const pw = process.env.ESPASSWORD;
const url = process.env.ESBASEURL;
const proxy = require('proxy-agent');

// add configuration option
let client;
if(process.env.NODE_ENV !== 'production') {
  client = new elasticsearch.Client({
    host: `https://${user}:${pw}@${url}`,
    log: 'trace'
  });
} else {
  client = new elasticsearch.Client({
    host: `https://${user}:${pw}@${url}`,
    createNodeAgent: () => proxy(process.env.PROD_PROXY),
    log: 'error'
  });
}

const log = async (index, type, body) => {
  try {
    return await client.index({
      index,
      type,
      id: body.timestamp,
      body
    });
  } catch (e) {
    throw new errors.GeneralError('Something went wrong with ES', e);
  }

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