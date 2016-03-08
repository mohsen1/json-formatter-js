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
    _templateObject12 = _taggedTemplateLiteral(['empty'], ['empty']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _helpersJs = require('./helpers.js');

var DATE_STRING_REGEX = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
var PARTIAL_DATE_REGEX = /\d{2}:\d{2}:\d{2} GMT-\d{4}/;
var JSON_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

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
      if (DATE_STRING_REGEX.test(json) || JSON_DATE_REGEX.test(json) || PARTIAL_DATE_REGEX.test(json)) {
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

  /*
   * Almost َUMD!
   *
   * Browserify "standalone" is not playing well with TypeScript `export default`
  */

  /**
   * Toggles `isOpen` state
   *
  */

  _createClass(JSONFormatter, [{
    key: 'toggleOpen',
    value: function toggleOpen() {
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        this.appendChildern();
      } else {
        this.removeChildren();
      }

      if (this.element) {
        this.element.classList.toggle('open');
      }
    }

    /**
     * Generates inline preview
     *
     * @returns {string}
    */
  }, {
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

      var templateString = '\n      <a class="toggler-link">\n        ' + _if(this.isObject)(_templateObject) + '\n\n        ' + _if(this.hasKey)(_templateObject2, this.key) + '\n\n        <span class="value">\n\n          ' + _if(this.isObject)(_templateObject3, this.onstructorName, _if(this.isArray)(_templateObject4, this.json && this.json.length)) + '\n\n          ' + _if(!this.isObject)(_templateObject5, this.isUrl ? 'a' : 'span', this.type, _if(this.isDate)(_templateObject6), _if(this.isUrl)(_templateObject7), _if(this.isUrl)(_templateObject8, this.json), this.getValuePreview(this.json, this.json), this.isUrl ? 'a' : 'span') + '\n\n        </span>\n\n        ' + _if(this.config.hoverPreviewEnabled && this.isObject)(_templateObject9, this.getInlinepreview()) + '\n      </a>\n\n      <div class="children ' + _if(this.isObject)(_templateObject10) + ' ' + _if(this.isArray)(_templateObject11) + ' ' + _if(this.isEmpty)(_templateObject12) + '"></div>\n    ';

      return templateString.replace(/\s*\n/g, '\n'); // clean up empty lines
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

      if (this.config && this.config.theme) {
        this.element.classList.add('json-formatter-' + this.config.theme);
      }

      if (this.isOpen) {
        this.element.classList.add('open');
      }

      this.element.innerHTML = resultHTML;

      if (this.isObject && this.isOpen) {
        this.appendChildern();
      }

      // add event listener for toggling
      this.element.querySelector('a.toggler-link').addEventListener('click', this.toggleOpen.bind(this));

      return this.element;
    }

    /**
     * Appends all the children to `<div class="children"></div>` element
     *
    */
  }, {
    key: 'appendChildern',
    value: function appendChildern() {
      var _this2 = this;

      var children = this.element.querySelector('div.children');

      if (!children) {
        return;
      }

      this.keys.forEach(function (key) {
        var formatter = new JSONFormatter(_this2.json[key], _this2.open - 1, _this2.config, key);

        children.appendChild(formatter.render());
      });
    }

    /**
     * Removes all the children from `<div class="children"></div>` element
     *
    */
  }, {
    key: 'removeChildren',
    value: function removeChildren() {
      if (this.element.querySelector('div.children')) {
        this.element.querySelector('div.children').innerHTML = '';
      }
    }
  }]);

  return JSONFormatter;
})();

exports['default'] = JSONFormatter;

if (typeof _module !== 'undefined') {
  _module.exports = JSONFormatter;
} else if (typeof window !== 'undefined') {
  window.JSONFormatter = JSONFormatter;
}
module.exports = exports['default'];

},{"./helpers.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9oc2VuL1Byb2plY3RzL2pzb24tZm9ybWF0dGVyLWpzL3NyYy9oZWxwZXJzLmpzIiwiL1VzZXJzL21vaHNlbi9Qcm9qZWN0cy9qc29uLWZvcm1hdHRlci1qcy9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRYixTQUFTLFlBQVksQ0FBQyxHQUFHLEVBQUU7QUFDekIsU0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztDQUMvQjs7Ozs7Ozs7Ozs7QUFVTSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDOUIsTUFBSSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUM7QUFDeEIsU0FBTyxDQUFDLENBQUMsS0FBSyxJQUFLLElBQUksSUFBSSxRQUFRLEFBQUMsQ0FBQztDQUN0Qzs7Ozs7Ozs7Ozs7O0FBV00sU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFO0FBQ3BDLE1BQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUN4QixXQUFPLEVBQUUsQ0FBQztHQUNYO0FBQ0QsTUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ25CLFdBQU8sUUFBUSxDQUFDO0dBQ2pCO0FBQ0QsTUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ25ELFdBQU8sUUFBUSxDQUFDO0dBQ25COztBQUVELE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDO0FBQzNDLE1BQU0sT0FBTyxHQUFHLEFBQUMsYUFBYSxDQUFFLElBQUksQ0FBQyxBQUFDLE1BQU0sQ0FBRSxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN0RSxNQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNqQyxXQUFPLE9BQU8s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QUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVuRCxnQkFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztPQUMxQyxDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7V0FNYSwwQkFBRztBQUNmLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUU7QUFDOUMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztPQUMzRDtLQUNGOzs7U0EvUmtCLGFBQWE7OztxQkFBYixhQUFhOztBQXdTakMsSUFBSSxPQUFPLE9BQU0sS0FBSyxXQUFXLEVBQUU7QUFDakMsU0FBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7Q0FDaEMsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtBQUN4QyxRQUFNLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztDQUN0QyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gKiBFc2NhcGVzIGBcImAgY2hhcmFjaHRlcnMgZnJvbSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGVzY2FwZVN0cmluZyhzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKCdcIicsICdcXFwiJyk7XG59XG5cbi8qXG4gKiBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG4vKlxuICogR2V0cyBjb25zdHJ1Y3RvciBuYW1lIG9mIGFuIG9iamVjdC5cbiAqIEZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMyNDI5XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPYmplY3ROYW1lKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKG9iamVjdCA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnT2JqZWN0JztcbiAgfVxuICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgIW9iamVjdC5jb25zdHJ1Y3Rvcikge1xuICAgICAgcmV0dXJuICdPYmplY3QnO1xuICB9XG5cbiAgY29uc3QgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoLztcbiAgY29uc3QgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKChvYmplY3QpLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpO1xuICBpZiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gcmVzdWx0c1sxXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuLypcbiAqIEdldHMgdHlwZSBvZiBhbiBvYmplY3QuIFJldHVybnMgXCJudWxsXCIgZm9yIG51bGwgb2JqZWN0c1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09PSBudWxsKSB7IHJldHVybiAnbnVsbCc7IH1cbiAgcmV0dXJuIHR5cGVvZiBvYmplY3Q7XG59XG5cbi8qXG4gKiBHZW5lcmF0ZXMgaW5saW5lIHByZXZpZXcgZm9yIGEgSmF2YVNjcmlwdCBvYmplY3QgYmFzZWQgb24gYSB2YWx1ZVxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWVQcmV2aWV3IChvYmplY3QsIHZhbHVlKSB7XG4gIHZhciB0eXBlID0gZ2V0VHlwZShvYmplY3QpO1xuXG4gIGlmICh0eXBlID09PSAnbnVsbCcgfHwgdHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHR5cGU7IH1cblxuICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9ICdcIicgKyBlc2NhcGVTdHJpbmcodmFsdWUpICsgJ1wiJztcbiAgfVxuICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyl7XG5cbiAgICAvLyBSZW1vdmUgY29udGVudCBvZiB0aGUgZnVuY3Rpb25cbiAgICByZXR1cm4gb2JqZWN0LnRvU3RyaW5nKClcbiAgICAgICAgLnJlcGxhY2UoL1tcXHJcXG5dL2csICcnKVxuICAgICAgICAucmVwbGFjZSgvXFx7LipcXH0vLCAnJykgKyAne+KApn0nO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLypcbiAqIEdlbmVyYXRlcyBpbmxpbmUgcHJldmlldyBmb3IgYSBKYXZhU2NyaXB0IG9iamVjdFxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFByZXZpZXcob2JqZWN0KSB7XG4gIGxldCB2YWx1ZSA9ICcnO1xuICBpZiAoaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHZhbHVlID0gZ2V0T2JqZWN0TmFtZShvYmplY3QpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpXG4gICAgICB2YWx1ZSArPSAnWycgKyBvYmplY3QubGVuZ3RoICsgJ10nO1xuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gZ2V0VmFsdWVQcmV2aWV3KG9iamVjdCwgb2JqZWN0KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1xuICBpc09iamVjdCxcbiAgZ2V0T2JqZWN0TmFtZSxcbiAgZ2V0VHlwZSxcbiAgZ2V0VmFsdWVQcmV2aWV3LFxuICBnZXRQcmV2aWV3XG59IGZyb20gJy4vaGVscGVycy5qcyc7XG5cbmNvbnN0IERBVEVfU1RSSU5HX1JFR0VYID0gLyheXFxkezEsNH1bXFwufFxcXFwvfC1dXFxkezEsMn1bXFwufFxcXFwvfC1dXFxkezEsNH0pKFxccyooPzowP1sxLTldOlswLTVdfDEoPz1bMDEyXSlcXGQ6WzAtNV0pXFxkXFxzKlthcF1tKT8kLztcbmNvbnN0IFBBUlRJQUxfREFURV9SRUdFWCA9IC9cXGR7Mn06XFxkezJ9OlxcZHsyfSBHTVQtXFxkezR9LztcbmNvbnN0IEpTT05fREFURV9SRUdFWCA9IC9cXGR7NH0tXFxkezJ9LVxcZHsyfVRcXGR7Mn06XFxkezJ9OlxcZHsyfS5cXGR7M31aLztcblxuLyoqXG4gKiBAY2xhc3MgSlNPTkZvcm1hdHRlclxuICpcbiAqIEpTT05Gb3JtYXR0ZXIgYWxsb3dzIHlvdSB0byByZW5kZXIgSlNPTiBvYmplY3RzIGluIEhUTUwgd2l0aCBhXG4gKiAqKmNvbGxhcHNpYmxlKiogbmF2aWdhdGlvbi5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKU09ORm9ybWF0dGVyIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb24gVGhlIEpTT04gb2JqZWN0IHlvdSB3YW50IHRvIHJlbmRlci4gSXQgaGFzIHRvIGJlIGFuXG4gICAqIG9iamVjdCBvciBhcnJheS4gRG8gTk9UIHBhc3MgcmF3IEpTT04gc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gW29wZW49MV0gaGlzIG51bWJlciBpbmRpY2F0ZXMgdXAgdG8gaG93IG1hbnkgbGV2ZWxzIHRoZVxuICAgKiByZW5kZXJlZCB0cmVlIHNob3VsZCBleHBhbmQuIFNldCBpdCB0byBgMGAgdG8gbWFrZSB0aGUgd2hvbGUgdHJlZSBjb2xsYXBzZWRcbiAgICogb3Igc2V0IGl0IHRvIGBJbmZpbml0eWAgdG8gZXhwYW5kIHRoZSB0cmVlIGRlZXBseVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gW2NvbmZpZz1kZWZhdWx0Q29uZmlnXSAtXG4gICAqICBkZWZhdWx0Q29uZmlnID0ge1xuICAgKiAgIGhvdmVyUHJldmlld0VuYWJsZWQ6IGZhbHNlLFxuICAgKiAgIGhvdmVyUHJldmlld0FycmF5Q291bnQ6IDEwMCxcbiAgICogICBob3ZlclByZXZpZXdGaWVsZENvdW50OiA1XG4gICAqIH1cbiAgICpcbiAgICogQXZhaWxhYmxlIGNvbmZpZ3VyYXRpb25zOlxuICAgKiAgIyMjIyNIb3ZlciBQcmV2aWV3XG4gICAqICogYGhvdmVyUHJldmlld0VuYWJsZWRgOiAgZW5hYmxlIHByZXZpZXcgb24gaG92ZXJcbiAgICogKiBgaG92ZXJQcmV2aWV3QXJyYXlDb3VudGA6IG51bWJlciBvZiBhcnJheSBpdGVtcyB0byBzaG93IGluIHByZXZpZXcgQW55XG4gICAqICAgIGFycmF5IGxhcmdlciB0aGFuIHRoaXMgbnVtYmVyIHdpbGwgYmUgc2hvd24gYXMgYEFycmF5W1hYWF1gIHdoZXJlIGBYWFhgXG4gICAqICAgIGlzIGxlbmd0aCBvZiB0aGUgYXJyYXkuXG4gICAqICogYGhvdmVyUHJldmlld0ZpZWxkQ291bnRgOiBudW1iZXIgb2Ygb2JqZWN0IHByb3BlcnRpZXMgdG8gc2hvdyBmb3Igb2JqZWN0XG4gICAqICAgcHJldmlldy4gQW55IG9iamVjdCB3aXRoIG1vcmUgcHJvcGVydGllcyB0aGF0IHRoaW4gbnVtYmVyIHdpbGwgYmVcbiAgICogICB0cnVuY2F0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBba2V5PXVuZGVmaW5lZF0gVGhlIGtleSB0aGF0IHRoaXMgb2JqZWN0IGluIGl0J3MgcGFyZW50XG4gICAqIGNvbnRleHRcbiAgKi9cbiAgY29uc3RydWN0b3IoanNvbiwgb3BlbiwgY29uZmlnLCBrZXkpIHtcbiAgICB0aGlzLmpzb24gPSBqc29uO1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMub3BlbiA9IG9wZW4gPT09IHVuZGVmaW5lZCA/IDEgOiBvcGVuO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHt9O1xuXG4gICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RW5hYmxlZCA9XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdFbmFibGVkID09PSB1bmRlZmluZWQgPyBmYWxzZSA6XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdFbmFibGVkO1xuXG4gICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3QXJyYXlDb3VudCA9XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdBcnJheUNvdW50ID09PSB1bmRlZmluZWQgPyAxMDAgOlxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3QXJyYXlDb3VudDtcblxuICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0ZpZWxkQ291bnQgPVxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RmllbGRDb3VudCA9PT0gdW5kZWZpbmVkID8gNSA6XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdGaWVsZENvdW50O1xuXG4gICAgdGhpcy50eXBlID0gZ2V0VHlwZSh0aGlzLmpzb24pO1xuICAgIHRoaXMuaGFzS2V5ID0gdHlwZW9mIHRoaXMua2V5ICE9PSAndW5kZWZpbmVkJztcblxuICAgIC8vIElmICdvcGVuJyBhdHRyaWJ1dGUgaXMgcHJlc2VudFxuICAgIHRoaXMuaXNPcGVuID0gdGhpcy5vcGVuID4gMDtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdzdHJpbmcnKXtcblxuICAgICAgLy8gQWRkIGN1c3RvbSB0eXBlIGZvciBkYXRlXG4gICAgICBpZihEQVRFX1NUUklOR19SRUdFWC50ZXN0KGpzb24pIHx8XG4gICAgICAgICBKU09OX0RBVEVfUkVHRVgudGVzdChqc29uKSB8fFxuICAgICAgICAgUEFSVElBTF9EQVRFX1JFR0VYLnRlc3QoanNvbikpIHtcbiAgICAgICAgdGhpcy5pc0RhdGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgY3VzdG9tIHR5cGUgZm9yIFVSTHNcbiAgICAgIGlmICh0aGlzLmpzb24uaW5kZXhPZignaHR0cCcpID09PSAwKSB7XG4gICAgICAgIHRoaXMuaXNVcmwgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkodGhpcy5qc29uKTtcbiAgICB0aGlzLmlzT2JqZWN0ID0gaXNPYmplY3QodGhpcy5qc29uKTtcblxuICAgIHRoaXMua2V5cyA9IFtdO1xuICAgIGlmICh0aGlzLmlzT2JqZWN0KSB7XG4gICAgICB0aGlzLmtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmpzb24pLm1hcCgoa2V5KT0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gJycpIHsgcmV0dXJuICdcIlwiJzsgfVxuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5pc0VtcHR5T2JqZWN0ID0gIXRoaXMua2V5cy5sZW5ndGggJiYgdGhpcy5pc09wZW4gJiYgIXRoaXMuaXNBcnJheTtcbiAgICB0aGlzLm9uc3RydWN0b3JOYW1lID0gZ2V0T2JqZWN0TmFtZSh0aGlzLmpzb24pO1xuICAgIHRoaXMuaXNFbXB0eSA9IHRoaXMuaXNFbXB0eU9iamVjdCB8fCAodGhpcy5rZXlzICYmXG4gICAgICAhdGhpcy5rZXlzLmxlbmd0aCAmJlxuICAgICAgdGhpcy5pc0FycmF5KTtcblxuICAgIHRoaXMuZ2V0VmFsdWVQcmV2aWV3ID0gZ2V0VmFsdWVQcmV2aWV3O1xuICB9XG5cblxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIGBpc09wZW5gIHN0YXRlXG4gICAqXG4gICovXG4gIHRvZ2dsZU9wZW4oKSB7XG4gICAgdGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW47XG5cbiAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGRlcm4oKTtcbiAgICB9IGVsc2V7XG4gICAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGlubGluZSBwcmV2aWV3XG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIGdldElubGluZXByZXZpZXcoKSB7XG4gICAgaWYgKHRoaXMuaXNBcnJheSkge1xuXG4gICAgICAvLyBpZiBhcnJheSBsZW5ndGggaXMgZ3JlYXRlciB0aGVuIDEwMCBpdCBzaG93cyBcIkFycmF5WzEwMV1cIlxuICAgICAgaWYgKHRoaXMuanNvbi5sZW5ndGggPiB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdBcnJheUNvdW50KSB7XG4gICAgICAgIHJldHVybiBgQXJyYXlbJHt0aGlzLmpzb24ubGVuZ3RofV1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGBbJHt0aGlzLmpzb24ubWFwKGdldFByZXZpZXcpLmpvaW4oJywgJyl9XWA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcblxuICAgICAgY29uc3Qga2V5cyA9IHRoaXMua2V5cztcblxuICAgICAgLy8gdGhlIGZpcnN0IGZpdmUga2V5cyAobGlrZSBDaHJvbWUgRGV2ZWxvcGVyIFRvb2wpXG4gICAgICBjb25zdCBuYXJyb3dLZXlzID0ga2V5cy5zbGljZSgwLCB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdGaWVsZENvdW50KTtcblxuICAgICAgLy8ganNvbiB2YWx1ZSBzY2hlbWF0aWMgaW5mb3JtYXRpb25cbiAgICAgIGNvbnN0IGt2cyA9IG5hcnJvd0tleXMubWFwKGtleSA9PiBgJHtrZXl9OiR7Z2V0UHJldmlldyh0aGlzLmpzb25ba2V5XSl9YCk7XG5cbiAgICAgIC8vIGlmIGtleXMgY291bnQgZ3JlYXRlciB0aGVuIDUgdGhlbiBzaG93IGVsbGlwc2lzXG4gICAgICBjb25zdCBlbGxpcHNpcyA9IGtleXMubGVuZ3RoID49IDUgPyAn4oCmJyA6ICcnO1xuXG4gICAgICByZXR1cm4gYHske2t2cy5qb2luKCcsICcpfSR7ZWxsaXBzaXN9fWA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBIVE1MIHN0cmluZyAgZm9yIHRoaXMgSlNPTiBiYXNlZCBvbiB0aGUgdGVtcGxhdGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdGVtcGxhdGUoKSB7XG5cbiAgICAvKlxuICAgICAqIGlmIGNvbmRpdGlvbiBmb3IgRVM2IHRlbXBsYXRlIHN0cmluZ3NcbiAgICAgKiB0byBiZSB1c2VkIG9ubHkgaW4gdGVtcGxhdGUgc3RyaW5nXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZSBteXN0ciA9IGBSYW5kb20gaXMgJHtfaWYoTWF0aC5yYW5kb20oKSA+IDAuNSlgZ3JlYXRlciB0aGFuIDAuNWBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9ufSB0aGUgdGVtcGxhdGUgZnVuY3Rpb25cbiAgICAqL1xuICAgIGZ1bmN0aW9uIF9pZihjb25kaXRpb24pIHtcbiAgICAgIHJldHVybiBjb25kaXRpb24gPyBub3JtYWwgOiBlbXB0eTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW1wdHkoKXtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgZnVuY3Rpb24gbm9ybWFsICh0ZW1wbGF0ZSwgLi4uZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5zbGljZSgxKS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBwYXJ0LCBpKSA9PiB7XG4gICAgICAgIHJldHVybiBhY2N1bXVsYXRvciArIGV4cHJlc3Npb25zW2ldICsgcGFydDtcbiAgICAgIH0sIHRlbXBsYXRlWzBdKTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wbGF0ZVN0cmluZyA9IGBcbiAgICAgIDxhIGNsYXNzPVwidG9nZ2xlci1saW5rXCI+XG4gICAgICAgICR7X2lmKHRoaXMuaXNPYmplY3QpYFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwidG9nZ2xlclwiPjwvc3Bhbj5cbiAgICAgICAgYH1cblxuICAgICAgICAke19pZih0aGlzLmhhc0tleSlgXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJrZXlcIj4ke3RoaXMua2V5fTo8L3NwYW4+XG4gICAgICAgIGB9XG5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ2YWx1ZVwiPlxuXG4gICAgICAgICAgJHtfaWYodGhpcy5pc09iamVjdClgXG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjb25zdHJ1Y3Rvci1uYW1lXCI+JHt0aGlzLm9uc3RydWN0b3JOYW1lfTwvc3Bhbj5cblxuICAgICAgICAgICAgICAke19pZih0aGlzLmlzQXJyYXkpYFxuICAgICAgICAgICAgICAgIDxzcGFuPjxzcGFuIGNsYXNzPVwiYnJhY2tldFwiPls8L3NwYW4+PHNwYW4gY2xhc3M9XCJudW1iZXJcIj4ke1xuICAgICAgICAgICAgICAgICAgdGhpcy5qc29uICYmIHRoaXMuanNvbi5sZW5ndGhcbiAgICAgICAgICAgICAgICB9PC9zcGFuPjxzcGFuIGNsYXNzPVwiYnJhY2tldFwiPl08L3NwYW4+PC9zcGFuPlxuICAgICAgICAgICAgICBgfVxuXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgYH1cblxuICAgICAgICAgICR7X2lmKCF0aGlzLmlzT2JqZWN0KWBcblxuICAgICAgICAgICAgPCR7dGhpcy5pc1VybCA/ICdhJyA6ICdzcGFuJ31cbiAgICAgICAgICAgICAgY2xhc3M9XCIke1xuICAgICAgICAgICAgICAgIHRoaXMudHlwZVxuICAgICAgICAgICAgICB9ICR7XG4gICAgICAgICAgICAgICAgX2lmKHRoaXMuaXNEYXRlKWBkYXRlYFxuICAgICAgICAgICAgICB9ICR7XG4gICAgICAgICAgICAgICAgX2lmKHRoaXMuaXNVcmwpYHVybGBcbiAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICR7X2lmKHRoaXMuaXNVcmwpYGhyZWY9XCIke3RoaXMuanNvbn1cImB9XG4gICAgICAgICAgICA+JHt0aGlzLmdldFZhbHVlUHJldmlldyh0aGlzLmpzb24sIHRoaXMuanNvbil9PC8ke1xuICAgICAgICAgICAgICB0aGlzLmlzVXJsID8gJ2EnIDogJ3NwYW4nXG4gICAgICAgICAgICB9PlxuXG4gICAgICAgICAgYH1cblxuICAgICAgICA8L3NwYW4+XG5cbiAgICAgICAgJHtfaWYodGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RW5hYmxlZCAmJiB0aGlzLmlzT2JqZWN0KWBcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInByZXZpZXctdGV4dFwiPiR7dGhpcy5nZXRJbmxpbmVwcmV2aWV3KCl9PC9zcGFuPlxuICAgICAgICBgfVxuICAgICAgPC9hPlxuXG4gICAgICA8ZGl2IGNsYXNzPVwiY2hpbGRyZW4gJHtcbiAgICAgICAgX2lmKHRoaXMuaXNPYmplY3QpYG9iamVjdGBcbiAgICAgIH0gJHtcbiAgICAgICAgX2lmKHRoaXMuaXNBcnJheSlgYXJyYXlgXG4gICAgICB9ICR7XG4gICAgICAgIF9pZih0aGlzLmlzRW1wdHkpYGVtcHR5YFxuICAgICAgfVwiPjwvZGl2PlxuICAgIGA7XG5cbiAgICByZXR1cm4gdGVtcGxhdGVTdHJpbmcucmVwbGFjZSgvXFxzKlxcbi9nLCAnXFxuJyk7IC8vIGNsZWFuIHVwIGVtcHR5IGxpbmVzXG4gIH1cblxuICAvKipcbiAgICogUmVuZGVycyBhbiBIVE1MIGVsZW1lbnQgYW5kIGluc3RhbGxzIGV2ZW50IGxpc3RlbmVyc1xuICAgKlxuICAgKiBAcmV0dXJucyB7SFRNTERpdkVsZW1lbnR9XG4gICovXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZXN1bHRIVE1MID0gdGhpcy50ZW1wbGF0ZSgpO1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2pzb24tZm9ybWF0dGVyLXJvdycpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnLnRoZW1lKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChganNvbi1mb3JtYXR0ZXItJHt0aGlzLmNvbmZpZy50aGVtZX1gKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHJlc3VsdEhUTUw7XG5cbiAgICBpZiAodGhpcy5pc09iamVjdCAmJiB0aGlzLmlzT3Blbikge1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZGVybigpO1xuICAgIH1cblxuICAgIC8vIGFkZCBldmVudCBsaXN0ZW5lciBmb3IgdG9nZ2xpbmdcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYS50b2dnbGVyLWxpbmsnKVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy50b2dnbGVPcGVuLmJpbmQodGhpcykpO1xuXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmRzIGFsbCB0aGUgY2hpbGRyZW4gdG8gYDxkaXYgY2xhc3M9XCJjaGlsZHJlblwiPjwvZGl2PmAgZWxlbWVudFxuICAgKlxuICAqL1xuICBhcHBlbmRDaGlsZGVybigpIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY2hpbGRyZW4nKTtcblxuICAgIGlmICghY2hpbGRyZW4pIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLmtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgZm9ybWF0dGVyID0gbmV3IEpTT05Gb3JtYXR0ZXIoXG4gICAgICAgIHRoaXMuanNvbltrZXldLCB0aGlzLm9wZW4gLSAxLCB0aGlzLmNvbmZpZywga2V5KTtcblxuICAgICAgY2hpbGRyZW4uYXBwZW5kQ2hpbGQoZm9ybWF0dGVyLnJlbmRlcigpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCB0aGUgY2hpbGRyZW4gZnJvbSBgPGRpdiBjbGFzcz1cImNoaWxkcmVuXCI+PC9kaXY+YCBlbGVtZW50XG4gICAqXG4gICovXG4gIHJlbW92ZUNoaWxkcmVuKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmNoaWxkcmVuJykpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY2hpbGRyZW4nKS5pbm5lckhUTUwgPSAnJztcbiAgICB9XG4gIH1cbn1cblxuIC8qXG4gICogQWxtb3N0INmOVU1EIVxuICAqXG4gICogQnJvd3NlcmlmeSBcInN0YW5kYWxvbmVcIiBpcyBub3QgcGxheWluZyB3ZWxsIHdpdGggVHlwZVNjcmlwdCBgZXhwb3J0IGRlZmF1bHRgXG4gKi9cbiBkZWNsYXJlIHZhciBtb2R1bGU6IGFueTtcbiBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgIG1vZHVsZS5leHBvcnRzID0gSlNPTkZvcm1hdHRlcjtcbiB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICB3aW5kb3cuSlNPTkZvcm1hdHRlciA9IEpTT05Gb3JtYXR0ZXI7XG4gfSJdfQ==
