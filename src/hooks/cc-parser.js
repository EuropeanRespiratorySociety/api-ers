'use strict';

// src/services/content/hooks/cc-parser.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html


const defaults = {};
const Article = require('../models/Article');
const Lead = require('../models/Lead');
const config = require('./cc-parser-config');

const { Composition, Format } = require('ers-utils');
const cp = new Composition();
const format = new Format();

exports.ccParserCategory = function(options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return function(hook) {
    const full = hook.params.query.full || false;
    const md = hook.params.query.md == 'true' ? true : false;

    const cache = hook.result.cache || {cached:false};
    if(hook.result.status === 200 && !cache.cached) {
      hook.result = {
        data: parse(hook.result.items, full, md),
        category: parse(hook.result.item, true, md),
        _sys:{
          status: hook.result.status,
          total: hook.result.total
        }
      };  
    }
    return Promise.resolve(hook);
  };
};

exports.ccParserItem = function(options) { // eslint-disable-line no-unused-vars
  options = Object.assign({}, defaults, options);

  return function(hook) {
    //by default it returns a full article.
    const full = hook.params.query.full == 'false' ? false : true;
    const md = hook.params.query.md == 'true' ? true : false;

    if(hook.result.status === 200) {
      hook.result = {
        data: parse(hook.result.item, full, md)[0],
        status: hook.result.status
      };  
    } else {
      hook.result = {
        data: [],
        message: hook.result.message,
        status: hook.result.status
      };
    }
    return Promise.resolve(hook);
  };
};

/**
 * Parses each items
 * @param {Object[]} array 
 * @param { boolean} full - Full or Lead content
 * @param { boolean} md - Html or Markdown
 */
function parse(array, full, md){
  full = full || false;

  if(!full){
    array = array.map(item => format.filter(item, config.lead));
  }  

  return array
    .map(item => cp.formatProperties(config, md)(item))
    .map(item => full ? format.mapModel(Article, item): format.mapModel(Lead, item));
}





