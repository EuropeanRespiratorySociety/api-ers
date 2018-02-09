const errors = require('@feathersjs/errors');
const elasticsearch = require('elasticsearch');
const dotenv = require('dotenv');
dotenv.load();

const user = process.env.ESUSERNAME;
const pw = process.env.ESPASSWORD;
const url = process.env.ESBASEURL;

console.log(user, pw, url)

// add configuration option

const client = new elasticsearch.Client({
  host: `https://${user}:${pw}@${url}`,
  log: process.env.NODE_ENV === 'production' ? 'error' : 'trace'
});

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