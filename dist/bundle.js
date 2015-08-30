(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*
 * Escapes `"` charachters from string
 *
 * @param {string} str
 * @returns {string}
*/
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isObject = isObject;
exports.getObjectName = getObjectName;
exports.getType = getType;
exports.getValuePreview = getValuePreview;
exports.getPreview = getPreview;
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

function isObject(value) {
  var type = typeof value;
  return !!value && type == 'object';
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
  var results = funcNameRegex.exec(object.constructor.toString());
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

function getType(object) {
  if (object === null) {
    return 'null';
  }
  return typeof object;
}

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
    return object.toString().replace(/[\r\n]/g, '').replace(/\{.*\}/, '') + '{…}';
  }
  return value;
}

/*
 * Generates inline preview for a JavaScript object
 * @param {object} object
 *
 * @returns {string}
*/

function getPreview(object) {
  var value = '';
  if (isObject(object)) {
    value = getObjectName(object);
    if (Array.isArray(object)) value += '[' + object.length + ']';
  } else {
    value = getValuePreview(object, object);
  }
  return value;
}

},{}],2:[function(require,module,exports){
'use strict';

/* globals JSONFormatter */

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _templateObject = _taggedTemplateLiteral(['\n          <span class="toggler"></span>\n        '], ['\n          <span class="toggler"></span>\n        ']),
    _templateObject2 = _taggedTemplateLiteral(['\n          <span class="key">', ':</span>\n        '], ['\n          <span class="key">', ':</span>\n        ']),
    _templateObject3 = _taggedTemplateLiteral(['\n            <span>\n              <span class="constructor-name">', '</span>\n\n              ', '\n\n            </span>\n          '], ['\n            <span>\n              <span class="constructor-name">', '</span>\n\n              ', '\n\n            </span>\n          ']),
    _templateObject4 = _taggedTemplateLiteral(['\n                <span><span class="bracket">[</span><span class="number">', '</span><span class="bracket">]</span></span>\n              '], ['\n                <span><span class="bracket">[</span><span class="number">', '</span><span class="bracket">]</span></span>\n              ']),
    _templateObject5 = _taggedTemplateLiteral(['\n\n            <', '\n              class="', ' ', ' ', '"\n              ', '\n            >', '</', '>\n\n          '], ['\n\n            <', '\n              class="', ' ', ' ', '"\n              ', '\n            >', '</', '>\n\n          ']),
    _templateObject6 = _taggedTemplateLiteral(['date'], ['date']),
    _templateObject7 = _taggedTemplateLiteral(['url'], ['url']),
    _templateObject8 = _taggedTemplateLiteral(['href="', '"'], ['href="', '"']),
    _templateObject9 = _taggedTemplateLiteral(['\n          <span class="preview-text">', '</span>\n        '], ['\n          <span class="preview-text">', '</span>\n        ']),
    _templateObject10 = _taggedTemplateLiteral(['object'], ['object']),
    _templateObject11 = _taggedTemplateLiteral(['array'], ['array']),
    _templateObject12 = _taggedTemplateLiteral(['empty'], ['empty']),
    _templateObject13 = _taggedTemplateLiteral(['\n          ', '\n        '], ['\n          ', '\n        ']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _helpersJs = require('./helpers.js');

function hasClass(element, className) {
  return element && element.getAttribute('class') && element.getAttribute('class').indexOf(className) !== -1;
}

/**
 * @class JSONFormatter
 *
 * JSONFormatter allows you to render JSON objects in HTML with a
 * **collapsible** navigation.
*/

var JSONFormatter = (function () {

  /**
   * @param {object} json The JSON object you want to render. It has to be an
   * object or array. Do NOT pass raw JSON string.
   *
   * @param {number} [open=1] his number indicates up to how many levels the
   * rendered tree should expand. Set it to `0` to make the whole tree collapsed
   * or set it to `Infinity` to expand the tree deeply
   *
   * @param {object} [config=defaultConfig] -
   *  defaultConfig = {
   *   hoverPreviewEnabled: false,
   *   hoverPreviewArrayCount: 100,
   *   hoverPreviewFieldCount: 5
   * }
   *
   * Available configurations:
   *  #####Hover Preview
   * * `hoverPreviewEnabled`:  enable preview on hover
   * * `hoverPreviewArrayCount`: number of array items to show in preview Any
   *    array larger than this number will be shown as `Array[XXX]` where `XXX`
   *    is length of the array.
   * * `hoverPreviewFieldCount`: number of object properties to show for object
   *   preview. Any object with more properties that thin number will be
   *   truncated.
   *
   * @param {string} [key=undefined] The key that this object in it's parent
   * context
  */

  function JSONFormatter(json, open, config, key) {
    _classCallCheck(this, JSONFormatter);

    this.json = json;
    this.key = key;
    this.open = open === undefined ? 1 : open;
    this.config = config || {};

    this.config.hoverPreviewEnabled = this.config.hoverPreviewEnabled === undefined ? false : this.config.hoverPreviewEnabled;

    this.config.hoverPreviewArrayCount = this.config.hoverPreviewArrayCount === undefined ? 100 : this.config.hoverPreviewArrayCount;

    this.config.hoverPreviewFieldCount = this.config.hoverPreviewFieldCount === undefined ? 5 : this.config.hoverPreviewFieldCount;

    this.type = (0, _helpersJs.getType)(this.json);
    this.hasKey = typeof this.key !== 'undefined';

    // If 'open' attribute is present
    this.isOpen = this.open > 0;

    if (this.type === 'string') {

      // Add custom type for date
      if (new Date(this.json).toString() !== 'Invalid Date') {
        this.isDate = true;
      }

      // Add custom type for URLs
      if (this.json.indexOf('http') === 0) {
        this.isUrl = true;
      }
    }

    this.isArray = Array.isArray(this.json);
    this.isObject = (0, _helpersJs.isObject)(this.json);

    this.keys = [];
    if (this.isObject) {
      this.keys = Object.keys(this.json).map(function (key) {
        if (key === '') {
          return '""';
        }
        return key;
      });
    }

    this.isEmptyObject = !this.keys.length && this.isOpen && !this.isArray;
    this.onstructorName = (0, _helpersJs.getObjectName)(this.json);
    this.isEmpty = this.isEmptyObject || this.keys && !this.keys.length && this.isArray;

    this.getValuePreview = _helpersJs.getValuePreview;
  }

  // TODO: UMD

  /**
   * Generates inline preview
   *
   * @returns {string}
  */

  _createClass(JSONFormatter, [{
    key: 'getInlinepreview',
    value: function getInlinepreview() {
      var _this = this;

      if (this.isArray) {

        // if array length is greater then 100 it shows "Array[101]"
        if (this.json.length > this.config.hoverPreviewArrayCount) {
          return 'Array[' + this.json.length + ']';
        } else {
          return '[' + this.json.map(_helpersJs.getPreview).join(', ') + ']';
        }
      } else {

        var keys = this.keys;

        // the first five keys (like Chrome Developer Tool)
        var narrowKeys = keys.slice(0, this.config.hoverPreviewFieldCount);

        // json value schematic information
        var kvs = narrowKeys.map(function (key) {
          return key + ':' + (0, _helpersJs.getPreview)(_this.json[key]);
        });

        // if keys count greater then 5 then show ellipsis
        var ellipsis = keys.length >= 5 ? '…' : '';

        return '{' + kvs.join(', ') + ellipsis + '}';
      }
    }

    /**
     * Generates HTML string  for this JSON based on the template
     *
     * @returns {string}
    */
  }, {
    key: 'template',
    value: function template() {

      /*
       * if condition for ES6 template strings
       * to be used only in template string
       *
       * @example mystr = `Random is ${_if(Math.random() > 0.5)`greater than 0.5``
       *
       * @param {boolean} condition
       *
       * @returns {function} the template function
      */
      function _if(condition) {
        return condition ? normal : empty;
      }
      function empty() {
        return '';
      }
      function normal(template) {
        for (var _len = arguments.length, expressions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          expressions[_key - 1] = arguments[_key];
        }

        return template.slice(1).reduce(function (accumulator, part, i) {
          return accumulator + expressions[i] + part;
        }, template[0]);
      }

      var templateString = '\n      <a class="toggler-link">\n        ' + _if(this.isObject)(_templateObject) + '\n\n        ' + _if(this.hasKey)(_templateObject2, this.key) + '\n\n        <span class="value">\n\n          ' + _if(this.isObject)(_templateObject3, this.onstructorName, _if(this.isArray)(_templateObject4, this.json && this.json.length)) + '\n\n          ' + _if(!this.isObject)(_templateObject5, this.isUrl ? 'a' : 'span', this.type, _if(this.isDate)(_templateObject6), _if(this.isUrl)(_templateObject7), _if(this.isUrl)(_templateObject8, this.json), this.getValuePreview(this.json, this.json), this.isUrl ? 'a' : 'span') + '\n\n        </span>\n\n        ' + _if(this.config.hoverPreviewEnabled && this.isObject)(_templateObject9, this.getInlinepreview()) + '\n      </a>\n\n      <div class="children ' + _if(this.isObject)(_templateObject10) + ' ' + _if(this.isArray)(_templateObject11) + ' ' + _if(this.isEmpty)(_templateObject12) + '">\n        ' + _if(this.isOpen)(_templateObject13, this.keys.map(this.childTemplate.bind(this)).join('')) + '\n      </div>\n    ';

      return templateString.replace(/\s*\n/g, '\n'); // clean up empty lines
    }

    /**
     * Generates HTML string for each child of this JSON based on the template
     * and the provided key
     *
     * @param {string} key - the key to select the child
     *
     * @returns {string}
    */
  }, {
    key: 'childTemplate',
    value: function childTemplate(key) {
      var formatter = new JSONFormatter(this.json[key], this.open - 1, this.config, key);

      return '<div class="json-formatter-row">' + formatter.template() + '</div>';
    }

    /**
     * Renders an HTML element and installs event listeners
     *
     * @returns {HTMLDivElement}
    */
  }, {
    key: 'render',
    value: function render() {
      var resultHTML = this.template();

      this.element = document.createElement('div');
      this.element.classList.add('json-formatter-row');

      if (this.isOpen) {
        this.element.classList.add('open');
      }

      this.element.innerHTML = resultHTML;

      // add event listener for toggling
      this.element.addEventListener('click', this.toggleOpen.bind(this));

      return this.element;
    }

    /**
     * Toggles `isOpen` state
     *
     * @param {DOMEvent} event
    */
  }, {
    key: 'toggleOpen',
    value: function toggleOpen(event) {
      var target = event.target;

      while (!hasClass(target, 'json-formatter-row') && target.parentElement) {
        target = target.parentElement;
      }

      var key = null;
      var isOpen = hasClass(target, 'open');

      if (target.querySelector('.key')) {
        key = target.querySelector('.key').innerText.replace(/\:$/, '');
      }

      if (isOpen) {
        this.removeChildren(target);
      } else {
        this.appendChildern(target, key);
      }

      target.classList.toggle('open');
    }

    /**
     * Appends all the children to `<div class="children"></div>` element
     *
     * @param {HTMLElement} element
    */
  }, {
    key: 'appendChildern',
    value: function appendChildern(element, subkey) {
      var _this2 = this;

      var children = element.querySelector('div.children');

      if (!children) {
        return;
      }

      var json = this.json;

      if (subkey) {
        json = json[subkey];
      }

      Object.keys(json).forEach(function (key) {
        var json = json[key];
        var open = _this2.open - 1;
        var formatter = new JSONFormatter(json, open, _this2.config, key);

        children.appendChild(formatter.render());
      });
    }

    /**
     * Removes all the children from `<div class="children"></div>` element
     *
     * @param {HTMLElement} element
    */
  }, {
    key: 'removeChildren',
    value: function removeChildren(element) {
      if (element.querySelector('div.children')) {
        element.querySelector('div.children').innerHTML = '';
      }
    }
  }]);

  return JSONFormatter;
})();

exports['default'] = JSONFormatter;
window.JSONFormatter = JSONFormatter;
module.exports = exports['default'];

},{"./helpers.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9oc2VuL1Byb2plY3RzL2pzb24tZm9ybWF0dGVyLWpzL3NyYy9oZWxwZXJzLmpzIiwiL1VzZXJzL21vaHNlbi9Qcm9qZWN0cy9qc29uLWZvcm1hdHRlci1qcy9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRYixTQUFTLFlBQVksQ0FBQyxHQUFHLEVBQUU7QUFDekIsU0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztDQUMvQjs7Ozs7Ozs7Ozs7QUFVTSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDOUIsTUFBSSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUM7QUFDeEIsU0FBTyxDQUFDLENBQUMsS0FBSyxJQUFLLElBQUksSUFBSSxRQUFRLEFBQUMsQ0FBQztDQUN0Qzs7Ozs7Ozs7Ozs7O0FBV00sU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFO0FBQ3BDLE1BQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUN4QixXQUFPLEVBQUUsQ0FBQztHQUNYO0FBQ0QsTUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ25CLFdBQU8sUUFBUSxDQUFDO0dBQ2pCO0FBQ0QsTUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ25ELFdBQU8sUUFBUSxDQUFDO0dBQ25COztBQUVELE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDO0FBQzNDLE1BQU0sT0FBTyxHQUFHLEFBQUMsYUFBYSxDQUFFLElBQUksQ0FBQyxBQUFDLE1BQU0sQ0FBRSxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN0RSxNQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENB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Q0FBQztPQUN0RDtLQUNGOzs7U0F4VGtCLGFBQWE7OztxQkFBYixhQUFhO0FBNFRsQyxNQUFNLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gKiBFc2NhcGVzIGBcImAgY2hhcmFjaHRlcnMgZnJvbSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGVzY2FwZVN0cmluZyhzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKCdcIicsICdcXFwiJyk7XG59XG5cbi8qXG4gKiBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG4vKlxuICogR2V0cyBjb25zdHJ1Y3RvciBuYW1lIG9mIGFuIG9iamVjdC5cbiAqIEZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMyNDI5XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPYmplY3ROYW1lKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKG9iamVjdCA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnT2JqZWN0JztcbiAgfVxuICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgIW9iamVjdC5jb25zdHJ1Y3Rvcikge1xuICAgICAgcmV0dXJuICdPYmplY3QnO1xuICB9XG5cbiAgY29uc3QgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoLztcbiAgY29uc3QgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKChvYmplY3QpLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpO1xuICBpZiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gcmVzdWx0c1sxXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuLypcbiAqIEdldHMgdHlwZSBvZiBhbiBvYmplY3QuIFJldHVybnMgXCJudWxsXCIgZm9yIG51bGwgb2JqZWN0c1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09PSBudWxsKSB7IHJldHVybiAnbnVsbCc7IH1cbiAgcmV0dXJuIHR5cGVvZiBvYmplY3Q7XG59XG5cbi8qXG4gKiBHZW5lcmF0ZXMgaW5saW5lIHByZXZpZXcgZm9yIGEgSmF2YVNjcmlwdCBvYmplY3QgYmFzZWQgb24gYSB2YWx1ZVxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWVQcmV2aWV3IChvYmplY3QsIHZhbHVlKSB7XG4gIHZhciB0eXBlID0gZ2V0VHlwZShvYmplY3QpO1xuXG4gIGlmICh0eXBlID09PSAnbnVsbCcgfHwgdHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHR5cGU7IH1cblxuICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9ICdcIicgKyBlc2NhcGVTdHJpbmcodmFsdWUpICsgJ1wiJztcbiAgfVxuICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyl7XG5cbiAgICAvLyBSZW1vdmUgY29udGVudCBvZiB0aGUgZnVuY3Rpb25cbiAgICByZXR1cm4gb2JqZWN0LnRvU3RyaW5nKClcbiAgICAgICAgLnJlcGxhY2UoL1tcXHJcXG5dL2csICcnKVxuICAgICAgICAucmVwbGFjZSgvXFx7LipcXH0vLCAnJykgKyAne+KApn0nO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLypcbiAqIEdlbmVyYXRlcyBpbmxpbmUgcHJldmlldyBmb3IgYSBKYXZhU2NyaXB0IG9iamVjdFxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFByZXZpZXcob2JqZWN0KSB7XG4gIGxldCB2YWx1ZSA9ICcnO1xuICBpZiAoaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHZhbHVlID0gZ2V0T2JqZWN0TmFtZShvYmplY3QpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpXG4gICAgICB2YWx1ZSArPSAnWycgKyBvYmplY3QubGVuZ3RoICsgJ10nO1xuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gZ2V0VmFsdWVQcmV2aWV3KG9iamVjdCwgb2JqZWN0KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBnbG9iYWxzIEpTT05Gb3JtYXR0ZXIgKi9cblxuaW1wb3J0IHtcbiAgaXNPYmplY3QsXG4gIGdldE9iamVjdE5hbWUsXG4gIGdldFR5cGUsXG4gIGdldFZhbHVlUHJldmlldyxcbiAgZ2V0UHJldmlld1xufSBmcm9tICcuL2hlbHBlcnMuanMnO1xuXG5mdW5jdGlvbiBoYXNDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgJiZcbiAgICAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykuaW5kZXhPZihjbGFzc05hbWUpICE9PSAtMSlcbn1cblxuLyoqXG4gKiBAY2xhc3MgSlNPTkZvcm1hdHRlclxuICpcbiAqIEpTT05Gb3JtYXR0ZXIgYWxsb3dzIHlvdSB0byByZW5kZXIgSlNPTiBvYmplY3RzIGluIEhUTUwgd2l0aCBhXG4gKiAqKmNvbGxhcHNpYmxlKiogbmF2aWdhdGlvbi5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU09ORm9ybWF0dGVyIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb24gVGhlIEpTT04gb2JqZWN0IHlvdSB3YW50IHRvIHJlbmRlci4gSXQgaGFzIHRvIGJlIGFuXG4gICAqIG9iamVjdCBvciBhcnJheS4gRG8gTk9UIHBhc3MgcmF3IEpTT04gc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gW29wZW49MV0gaGlzIG51bWJlciBpbmRpY2F0ZXMgdXAgdG8gaG93IG1hbnkgbGV2ZWxzIHRoZVxuICAgKiByZW5kZXJlZCB0cmVlIHNob3VsZCBleHBhbmQuIFNldCBpdCB0byBgMGAgdG8gbWFrZSB0aGUgd2hvbGUgdHJlZSBjb2xsYXBzZWRcbiAgICogb3Igc2V0IGl0IHRvIGBJbmZpbml0eWAgdG8gZXhwYW5kIHRoZSB0cmVlIGRlZXBseVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gW2NvbmZpZz1kZWZhdWx0Q29uZmlnXSAtXG4gICAqICBkZWZhdWx0Q29uZmlnID0ge1xuICAgKiAgIGhvdmVyUHJldmlld0VuYWJsZWQ6IGZhbHNlLFxuICAgKiAgIGhvdmVyUHJldmlld0FycmF5Q291bnQ6IDEwMCxcbiAgICogICBob3ZlclByZXZpZXdGaWVsZENvdW50OiA1XG4gICAqIH1cbiAgICpcbiAgICogQXZhaWxhYmxlIGNvbmZpZ3VyYXRpb25zOlxuICAgKiAgIyMjIyNIb3ZlciBQcmV2aWV3XG4gICAqICogYGhvdmVyUHJldmlld0VuYWJsZWRgOiAgZW5hYmxlIHByZXZpZXcgb24gaG92ZXJcbiAgICogKiBgaG92ZXJQcmV2aWV3QXJyYXlDb3VudGA6IG51bWJlciBvZiBhcnJheSBpdGVtcyB0byBzaG93IGluIHByZXZpZXcgQW55XG4gICAqICAgIGFycmF5IGxhcmdlciB0aGFuIHRoaXMgbnVtYmVyIHdpbGwgYmUgc2hvd24gYXMgYEFycmF5W1hYWF1gIHdoZXJlIGBYWFhgXG4gICAqICAgIGlzIGxlbmd0aCBvZiB0aGUgYXJyYXkuXG4gICAqICogYGhvdmVyUHJldmlld0ZpZWxkQ291bnRgOiBudW1iZXIgb2Ygb2JqZWN0IHByb3BlcnRpZXMgdG8gc2hvdyBmb3Igb2JqZWN0XG4gICAqICAgcHJldmlldy4gQW55IG9iamVjdCB3aXRoIG1vcmUgcHJvcGVydGllcyB0aGF0IHRoaW4gbnVtYmVyIHdpbGwgYmVcbiAgICogICB0cnVuY2F0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBba2V5PXVuZGVmaW5lZF0gVGhlIGtleSB0aGF0IHRoaXMgb2JqZWN0IGluIGl0J3MgcGFyZW50XG4gICAqIGNvbnRleHRcbiAgKi9cbiAgY29uc3RydWN0b3IoanNvbiwgb3BlbiwgY29uZmlnLCBrZXkpIHtcbiAgICB0aGlzLmpzb24gPSBqc29uO1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMub3BlbiA9IG9wZW4gPT09IHVuZGVmaW5lZCA/IDEgOiBvcGVuO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG4gICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RW5hYmxlZCA9XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdFbmFibGVkID09PSB1bmRlZmluZWQgPyBmYWxzZSA6XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdFbmFibGVkO1xuXG4gICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3QXJyYXlDb3VudCA9XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdBcnJheUNvdW50ID09PSB1bmRlZmluZWQgPyAxMDAgOlxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3QXJyYXlDb3VudDtcblxuICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0ZpZWxkQ291bnQgPVxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RmllbGRDb3VudCA9PT0gdW5kZWZpbmVkID8gNSA6XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdGaWVsZENvdW50O1xuXG4gICAgdGhpcy50eXBlID0gZ2V0VHlwZSh0aGlzLmpzb24pO1xuICAgIHRoaXMuaGFzS2V5ID0gdHlwZW9mIHRoaXMua2V5ICE9PSAndW5kZWZpbmVkJztcblxuICAgIC8vIElmICdvcGVuJyBhdHRyaWJ1dGUgaXMgcHJlc2VudFxuICAgIHRoaXMuaXNPcGVuID0gdGhpcy5vcGVuID4gMDtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdzdHJpbmcnKXtcblxuICAgICAgLy8gQWRkIGN1c3RvbSB0eXBlIGZvciBkYXRlXG4gICAgICBpZigobmV3IERhdGUodGhpcy5qc29uKSkudG9TdHJpbmcoKSAhPT0gJ0ludmFsaWQgRGF0ZScpIHtcbiAgICAgICAgdGhpcy5pc0RhdGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgY3VzdG9tIHR5cGUgZm9yIFVSTHNcbiAgICAgIGlmICh0aGlzLmpzb24uaW5kZXhPZignaHR0cCcpID09PSAwKSB7XG4gICAgICAgIHRoaXMuaXNVcmwgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkodGhpcy5qc29uKTtcbiAgICB0aGlzLmlzT2JqZWN0ID0gaXNPYmplY3QodGhpcy5qc29uKTtcblxuICAgIHRoaXMua2V5cyA9IFtdO1xuICAgIGlmICh0aGlzLmlzT2JqZWN0KSB7XG4gICAgICB0aGlzLmtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmpzb24pLm1hcCgoa2V5KT0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gJycpIHsgcmV0dXJuICdcIlwiJzsgfVxuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5pc0VtcHR5T2JqZWN0ID0gIXRoaXMua2V5cy5sZW5ndGggJiYgdGhpcy5pc09wZW4gJiYgIXRoaXMuaXNBcnJheTtcbiAgICB0aGlzLm9uc3RydWN0b3JOYW1lID0gZ2V0T2JqZWN0TmFtZSh0aGlzLmpzb24pO1xuICAgIHRoaXMuaXNFbXB0eSA9IHRoaXMuaXNFbXB0eU9iamVjdCB8fCAodGhpcy5rZXlzICYmXG4gICAgICAhdGhpcy5rZXlzLmxlbmd0aCAmJlxuICAgICAgdGhpcy5pc0FycmF5KTtcblxuICAgIHRoaXMuZ2V0VmFsdWVQcmV2aWV3ID0gZ2V0VmFsdWVQcmV2aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBpbmxpbmUgcHJldmlld1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICBnZXRJbmxpbmVwcmV2aWV3KCkge1xuICAgIGlmICh0aGlzLmlzQXJyYXkpIHtcblxuICAgICAgLy8gaWYgYXJyYXkgbGVuZ3RoIGlzIGdyZWF0ZXIgdGhlbiAxMDAgaXQgc2hvd3MgXCJBcnJheVsxMDFdXCJcbiAgICAgIGlmICh0aGlzLmpzb24ubGVuZ3RoID4gdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3QXJyYXlDb3VudCkge1xuICAgICAgICByZXR1cm4gYEFycmF5WyR7dGhpcy5qc29uLmxlbmd0aH1dYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBgWyR7dGhpcy5qc29uLm1hcChnZXRQcmV2aWV3KS5qb2luKCcsICcpfV1gO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnN0IGtleXMgPSB0aGlzLmtleXM7XG5cbiAgICAgIC8vIHRoZSBmaXJzdCBmaXZlIGtleXMgKGxpa2UgQ2hyb21lIERldmVsb3BlciBUb29sKVxuICAgICAgY29uc3QgbmFycm93S2V5cyA9IGtleXMuc2xpY2UoMCwgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RmllbGRDb3VudCk7XG5cbiAgICAgIC8vIGpzb24gdmFsdWUgc2NoZW1hdGljIGluZm9ybWF0aW9uXG4gICAgICBjb25zdCBrdnMgPSBuYXJyb3dLZXlzLm1hcChrZXkgPT4gYCR7a2V5fToke2dldFByZXZpZXcodGhpcy5qc29uW2tleV0pfWApO1xuXG4gICAgICAvLyBpZiBrZXlzIGNvdW50IGdyZWF0ZXIgdGhlbiA1IHRoZW4gc2hvdyBlbGxpcHNpc1xuICAgICAgY29uc3QgZWxsaXBzaXMgPSBrZXlzLmxlbmd0aCA+PSA1ID8gJ+KApicgOiAnJztcblxuICAgICAgcmV0dXJuIGB7JHtrdnMuam9pbignLCAnKX0ke2VsbGlwc2lzfX1gO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgSFRNTCBzdHJpbmcgIGZvciB0aGlzIEpTT04gYmFzZWQgb24gdGhlIHRlbXBsYXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRlbXBsYXRlKCkge1xuXG4gICAgLypcbiAgICAgKiBpZiBjb25kaXRpb24gZm9yIEVTNiB0ZW1wbGF0ZSBzdHJpbmdzXG4gICAgICogdG8gYmUgdXNlZCBvbmx5IGluIHRlbXBsYXRlIHN0cmluZ1xuICAgICAqXG4gICAgICogQGV4YW1wbGUgbXlzdHIgPSBgUmFuZG9tIGlzICR7X2lmKE1hdGgucmFuZG9tKCkgPiAwLjUpYGdyZWF0ZXIgdGhhbiAwLjVgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjb25kaXRpb25cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbn0gdGhlIHRlbXBsYXRlIGZ1bmN0aW9uXG4gICAgKi9cbiAgICBmdW5jdGlvbiBfaWYoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gY29uZGl0aW9uID8gbm9ybWFsIDogZW1wdHk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVtcHR5KCl7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG5vcm1hbCAodGVtcGxhdGUsIC4uLmV4cHJlc3Npb25zKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGUuc2xpY2UoMSkucmVkdWNlKChhY2N1bXVsYXRvciwgcGFydCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBleHByZXNzaW9uc1tpXSArIHBhcnQ7XG4gICAgICB9LCB0ZW1wbGF0ZVswXSk7XG4gICAgfVxuXG4gICAgY29uc3QgdGVtcGxhdGVTdHJpbmcgPSBgXG4gICAgICA8YSBjbGFzcz1cInRvZ2dsZXItbGlua1wiPlxuICAgICAgICAke19pZih0aGlzLmlzT2JqZWN0KWBcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInRvZ2dsZXJcIj48L3NwYW4+XG4gICAgICAgIGB9XG5cbiAgICAgICAgJHtfaWYodGhpcy5oYXNLZXkpYFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwia2V5XCI+JHt0aGlzLmtleX06PC9zcGFuPlxuICAgICAgICBgfVxuXG4gICAgICAgIDxzcGFuIGNsYXNzPVwidmFsdWVcIj5cblxuICAgICAgICAgICR7X2lmKHRoaXMuaXNPYmplY3QpYFxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY29uc3RydWN0b3ItbmFtZVwiPiR7dGhpcy5vbnN0cnVjdG9yTmFtZX08L3NwYW4+XG5cbiAgICAgICAgICAgICAgJHtfaWYodGhpcy5pc0FycmF5KWBcbiAgICAgICAgICAgICAgICA8c3Bhbj48c3BhbiBjbGFzcz1cImJyYWNrZXRcIj5bPC9zcGFuPjxzcGFuIGNsYXNzPVwibnVtYmVyXCI+JHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuanNvbiAmJiB0aGlzLmpzb24ubGVuZ3RoXG4gICAgICAgICAgICAgICAgfTwvc3Bhbj48c3BhbiBjbGFzcz1cImJyYWNrZXRcIj5dPC9zcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgYH1cblxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIGB9XG5cbiAgICAgICAgICAke19pZighdGhpcy5pc09iamVjdClgXG5cbiAgICAgICAgICAgIDwke3RoaXMuaXNVcmwgPyAnYScgOiAnc3Bhbid9XG4gICAgICAgICAgICAgIGNsYXNzPVwiJHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVcbiAgICAgICAgICAgICAgfSAke1xuICAgICAgICAgICAgICAgIF9pZih0aGlzLmlzRGF0ZSlgZGF0ZWBcbiAgICAgICAgICAgICAgfSAke1xuICAgICAgICAgICAgICAgIF9pZih0aGlzLmlzVXJsKWB1cmxgXG4gICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAke19pZih0aGlzLmlzVXJsKWBocmVmPVwiJHt0aGlzLmpzb259XCJgfVxuICAgICAgICAgICAgPiR7dGhpcy5nZXRWYWx1ZVByZXZpZXcodGhpcy5qc29uLCB0aGlzLmpzb24pfTwvJHtcbiAgICAgICAgICAgICAgdGhpcy5pc1VybCA/ICdhJyA6ICdzcGFuJ1xuICAgICAgICAgICAgfT5cblxuICAgICAgICAgIGB9XG5cbiAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICR7X2lmKHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0VuYWJsZWQgJiYgdGhpcy5pc09iamVjdClgXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcmV2aWV3LXRleHRcIj4ke3RoaXMuZ2V0SW5saW5lcHJldmlldygpfTwvc3Bhbj5cbiAgICAgICAgYH1cbiAgICAgIDwvYT5cblxuICAgICAgPGRpdiBjbGFzcz1cImNoaWxkcmVuICR7XG4gICAgICAgIF9pZih0aGlzLmlzT2JqZWN0KWBvYmplY3RgXG4gICAgICB9ICR7XG4gICAgICAgIF9pZih0aGlzLmlzQXJyYXkpYGFycmF5YFxuICAgICAgfSAke1xuICAgICAgICBfaWYodGhpcy5pc0VtcHR5KWBlbXB0eWBcbiAgICAgIH1cIj5cbiAgICAgICAgJHtfaWYodGhpcy5pc09wZW4pYFxuICAgICAgICAgICR7dGhpcy5rZXlzLm1hcCh0aGlzLmNoaWxkVGVtcGxhdGUuYmluZCh0aGlzKSkuam9pbignJyl9XG4gICAgICAgIGB9XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlU3RyaW5nLnJlcGxhY2UoL1xccypcXG4vZywgJ1xcbicpOyAvLyBjbGVhbiB1cCBlbXB0eSBsaW5lc1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBIVE1MIHN0cmluZyBmb3IgZWFjaCBjaGlsZCBvZiB0aGlzIEpTT04gYmFzZWQgb24gdGhlIHRlbXBsYXRlXG4gICAqIGFuZCB0aGUgcHJvdmlkZWQga2V5XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSB0aGUga2V5IHRvIHNlbGVjdCB0aGUgY2hpbGRcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgY2hpbGRUZW1wbGF0ZShrZXkpIHtcbiAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSlNPTkZvcm1hdHRlcih0aGlzLmpzb25ba2V5XSwgdGhpcy5vcGVuIC0gMSxcbiAgICAgIHRoaXMuY29uZmlnLCBrZXkpO1xuXG4gICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwianNvbi1mb3JtYXR0ZXItcm93XCI+JHtmb3JtYXR0ZXIudGVtcGxhdGUoKX08L2Rpdj5gO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgYW4gSFRNTCBlbGVtZW50IGFuZCBpbnN0YWxscyBldmVudCBsaXN0ZW5lcnNcbiAgICpcbiAgICogQHJldHVybnMge0hUTUxEaXZFbGVtZW50fVxuICAqL1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVzdWx0SFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcblxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdqc29uLWZvcm1hdHRlci1yb3cnKTtcblxuICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gcmVzdWx0SFRNTDtcblxuICAgIC8vIGFkZCBldmVudCBsaXN0ZW5lciBmb3IgdG9nZ2xpbmdcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnRvZ2dsZU9wZW4uYmluZCh0aGlzKSk7XG5cbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgYGlzT3BlbmAgc3RhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01FdmVudH0gZXZlbnRcbiAgKi9cbiAgdG9nZ2xlT3BlbihldmVudCkge1xuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cbiAgICB3aGlsZSAoIWhhc0NsYXNzKHRhcmdldCwgJ2pzb24tZm9ybWF0dGVyLXJvdycpICYmIHRhcmdldC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICBsZXQga2V5ID0gbnVsbDtcbiAgICBjb25zdCBpc09wZW4gPSBoYXNDbGFzcyh0YXJnZXQsICdvcGVuJyk7XG5cbiAgICBpZiAodGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5rZXknKSkge1xuICAgICAga2V5ID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5rZXknKS5pbm5lclRleHQucmVwbGFjZSgvXFw6JC8sICcnKTtcbiAgICB9XG5cbiAgICBpZiAoaXNPcGVuKSB7XG4gICAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKHRhcmdldCk7XG4gICAgfSBlbHNle1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZGVybih0YXJnZXQsIGtleSk7XG4gICAgfVxuXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGFsbCB0aGUgY2hpbGRyZW4gdG8gYDxkaXYgY2xhc3M9XCJjaGlsZHJlblwiPjwvZGl2PmAgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICovXG4gIGFwcGVuZENoaWxkZXJuKGVsZW1lbnQsIHN1YmtleSkge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY2hpbGRyZW4nKTtcblxuICAgIGlmICghY2hpbGRyZW4pIHsgcmV0dXJuOyB9XG5cbiAgICBsZXQganNvbiA9IHRoaXMuanNvbjtcblxuICAgIGlmIChzdWJrZXkpIHtcbiAgICAgIGpzb24gPSBqc29uW3N1YmtleV1cbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyhqc29uKS5mb3JFYWNoKChrZXkpPT4ge1xuICAgICAgY29uc3QganNvbiA9IGpzb25ba2V5XTtcbiAgICAgIGNvbnN0IG9wZW4gPSB0aGlzLm9wZW4gLSAxO1xuICAgICAgY29uc3QgZm9ybWF0dGVyID0gbmV3IEpTT05Gb3JtYXR0ZXIoanNvbiwgb3BlbiwgdGhpcy5jb25maWcsIGtleSk7XG5cbiAgICAgIGNoaWxkcmVuLmFwcGVuZENoaWxkKGZvcm1hdHRlci5yZW5kZXIoKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgdGhlIGNoaWxkcmVuIGZyb20gYDxkaXYgY2xhc3M9XCJjaGlsZHJlblwiPjwvZGl2PmAgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICovXG4gIHJlbW92ZUNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY2hpbGRyZW4nKSkge1xuICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY2hpbGRyZW4nKS5pbm5lckhUTUwgPSAnJztcbiAgICB9XG4gIH1cbn1cblxuLy8gVE9ETzogVU1EXG53aW5kb3cuSlNPTkZvcm1hdHRlciA9IEpTT05Gb3JtYXR0ZXI7XG4iXX0=
