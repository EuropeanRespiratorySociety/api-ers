'use strict';

// src/services/content/hooks/cc-parser.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html


const defaults = {};
const Article = require('../models/CmeOnlineArticle');
const Lead = require('../models/CmeOnlineLead');
const config = require('./cmeOnline-parser-config');

const {
  Composition,
  Format
} = require('ers-utils');
const cp = new Composition();
const format = new Format();

exports.ccParserListItems = function (options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return async hook => {
    const q = Object.assign({}, hook.params.query);
    const full = q.full || false;
    const type = q.format || 'html';

    const cache = hook.result.cache || {
      cached: false
    };

    if (hook.result.status === 200 && !cache.cached) {
      hook.result = {
        data: parse(hook.result.items, full, type),
        _sys: {
          status: hook.result.status,
          total: hook.result.total
        }
      };
    }
    return hook;
  };
};

exports.ccParserItem = function (options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return async hook => {
    //by default it returns a full article.
    const full = hook.params.query.full || true;
    const type = hook.params.query.format || 'html';

    hook.result.status === 200 ?
      hook.result = {
        data: parse(hook.result.item, full, type)[0],
        status: hook.result.status
      } :
      hook.result = {
        data: [],
        message: hook.result.message,
        status: hook.result.status
      };

    return hook;
  };
};

/**
 * Parses each items
 * @param {Object[]} array 
 * @param { boolean} full - Full or Lead content
 * @param { boolean} type - Html, Markdown or Raw
 */
function parse(array, full = false, type) {

  if (!full) array = array.map(item => format.filter(item, config.lead));

  return array
    .map(item => cp.formatProperties(config, type)(item))
    .map(item => !full ? format.mapModel(Lead, item) : format.mapModel(Article, item));
}
