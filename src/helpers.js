'use strict';


function escapeString(str) {
  return str.replace('"', '\"');
}

export function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

export function requestAnimationFrame(cb) {
  if (!window.requestAnimationFrame) {
    setTimeout(cb, 0);
  } else {
    window.requestAnimationFrame(cb);
  }
}

// From http://stackoverflow.com/a/332429
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

export function getType(object) {
  if (object === null) { return 'null'; }
  return typeof object;
}

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