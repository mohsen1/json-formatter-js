'use strict';

/*
 * Escapes `"` charachters from string
 *
 * @param {string} str
 * @returns {string}
*/
function escapeString(str) {
  return str.replace('"', '\"');
}

/*
 * Determines if a value is an object
 *
 * @param {any} value
 *
 * @returns {boolean}
 *
*/
export function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object');
}

/*
 * Gets constructor name of an object.
 * From http://stackoverflow.com/a/332429
 *
 * @param {object} object
 *
 * @returns {string}
 *
*/
export function getObjectName(object) {
  if (object === undefined) {
    return '';
  }
  if (object === null) {
    return 'Object';
  }
  if (typeof object === 'object' && !object.constructor) {
      return 'Object';
  }

  const funcNameRegex = /function (.{1,})\(/;
  const results = (funcNameRegex).exec((object).constructor.toString());
  if (results && results.length > 1) {
    return results[1];
  } else {
    return '';
  }
}

/*
 * Gets type of an object. Returns "null" for null objects
 *
 * @param {object} object
 *
 * @returns {string}
*/
export function getType(object) {
  if (object === null) { return 'null'; }
  return typeof object;
}

/*
 * Generates inline preview for a JavaScript object based on a value
 * @param {object} object
 * @param {string} value
 *
 * @returns {string}
*/
export function getValuePreview (object, value) {
  var type = getType(object);

  if (type === 'null' || type === 'undefined') { return type; }

  if (type === 'string') {
    value = '"' + escapeString(value) + '"';
  }
  if (type === 'function'){

    // Remove content of the function
    return object.toString()
        .replace(/[\r\n]/g, '')
        .replace(/\{.*\}/, '') + '{…}';
  }
  return value;
}

/*
 * Generates inline preview for a JavaScript object
 * @param {object} object
 *
 * @returns {string}
*/
export function getPreview(object) {
  let value = '';
  if (isObject(object)) {
    value = getObjectName(object);
    if (Array.isArray(object))
      value += '[' + object.length + ']';
  } else {
    value = getValuePreview(object, object);
  }
  return value;
}