const errors = require('@feathersjs/errors');
const elasticsearch = require('elasticsearch');
const dotenv = require('dotenv');
dotenv.load();

const user = process.env.ESUSERNAME;
const pw = process.env.ESPASSWORD;
const url = process.env.ESBASEURL;
const logLevel = process.env.ESLOGLEVEL || 'trace';

// add configuration option
const client = new elasticsearch.Client({
  host: `https://${user}:${pw}@${url}`,
  log: process.env.NODE_ENV === 'production' ? 'error' : logLevel
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

const index = async (item, index, id) => {
  try {
    return await client.index({
      index: index || 'content',
      type: '_doc',
      id: id || item._doc,
      body: item
    });
  } catch (e) {
    return e;
  }
};

const unIndex = async (item, index, id) => {
  try {
    return await client.delete({
      index: index || 'content',
      type: '_doc',
      id: id || item._doc
    });
  } catch (e) {
    return e;
  }
};

module.exports = {
  client,
  log,
  index,
  unIndex
};