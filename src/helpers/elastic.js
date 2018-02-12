const errors = require('@feathersjs/errors');
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

const log = async (index, type, body, pipeline) => {
  const config = {
    index,
    pipeline: pipeline === 'geoip' ? 'geoip' : undefined,
    type,
    id: body.timestamp,
    body
  };

  try {
    return await client.index(config);
  } catch (e) {
    throw new errors.GeneralError('Something went wrong with ES', e);
  }

};

const index = async (item) => {
  return await client.index({
    index: 'content',
    type: '_doc',
    id: item._doc,
    body: item
  });
};

module.exports = {
  client,
  log,
  index
};