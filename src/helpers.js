'use strict';
/*
 * Escapes `"` charachters from string
 *
 * @param {string} str
 * @returns {string}
*/
function escapeString(str) {
  
  var entitiesMap = {              
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;'
  };
  
  return str.replace('"', '\"').replace(/[&<>]/g, function(key) {
    return entitiesMap[key];
  });
}
/*
 * Determines if a value is an object
 *
 * @param {any} value
 *
 * @returns {boolean}
 *
*/
function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object');
}
exports.isObject = isObject;
/*
 * Gets constructor name of an object.
 * From http://stackoverflow.com/a/332429
 *
 * @param {object} object
 *
 * @returns {string}
 *
*/
function getObjectName(object) {
    if (object === undefined) {
        return '';
    }
    if (object === null) {
        return 'Object';
    }
    if (typeof object === 'object' && !object.constructor) {
        return 'Object';
    }
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((object).constructor.toString());
    if (results && results.length > 1) {
        return results[1];
    }
    else {
        return '';
    }
}
exports.getObjectName = getObjectName;
/*
 * Gets type of an object. Returns "null" for null objects
 *
 * @param {object} object
 *
 * @returns {string}
*/
function getType(object) {
    if (object === null) {
        return 'null';
    }
    return typeof object;
}
exports.getType = getType;
/*
 * Generates inline preview for a JavaScript object based on a value
 * @param {object} object
 * @param {string} value
 *
 * @returns {string}
*/
function getValuePreview(object, value) {
    var type = getType(object);
    if (type === 'null' || type === 'undefined') {
        return type;
    }
    if (type === 'string') {
        value = '"' + escapeString(value) + '"';
    }
    if (type === 'function') {
        // Remove content of the function
        return object.toString()
            .replace(/[\r\n]/g, '')
            .replace(/\{.*\}/, '') + '{…}';
    }
    return value;
}
exports.getValuePreview = getValuePreview;
/*
 * Generates inline preview for a JavaScript object
 * @param {object} any
 *
 * @returns {string}
*/
function getPreview(object) {
    var value = '';
    if (isObject(object)) {
        value = getObjectName(object);
        if (Array.isArray(object))
            value += '[' + object.length + ']';
    }
    else {
        value = getValuePreview(object, object);
    }
    return value;
}
exports.getPreview = getPreview;
