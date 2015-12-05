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
      if (DATE_STRING_REGEX.test(json)) {
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
module.exports = exports['default'];

},{"./helpers.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9oc2VuL1Byb2plY3RzL2pzb24tZm9ybWF0dGVyLWpzL3NyYy9oZWxwZXJzLmpzIiwiL1VzZXJzL21vaHNlbi9Qcm9qZWN0cy9qc29uLWZvcm1hdHRlci1qcy9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRYixTQUFTLFlBQVksQ0FBQyxHQUFHLEVBQUU7QUFDekIsU0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztDQUMvQjs7Ozs7Ozs7Ozs7QUFVTSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDOUIsTUFBSSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUM7QUFDeEIsU0FBTyxDQUFDLENBQUMsS0FBSyxJQUFLLElBQUksSUFBSSxRQUFRLEFBQUMsQ0FBQztDQUN0Qzs7Ozs7Ozs7Ozs7O0FBV00sU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFO0FBQ3BDLE1BQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUN4QixXQUFPLEVBQUUsQ0FBQztHQUNYO0FBQ0QsTUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ25CLFdBQU8sUUFBUSxDQUFDO0dBQ2pCO0FBQ0QsTUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ25ELFdBQU8sUUFBUSxDQUFDO0dBQ25COztBQUVELE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDO0FBQzNDLE1BQU0sT0FBTyxHQUFHLEFBQUMsYUFBYSxDQUFFLElBQUksQ0FBQyxBQUFDLE1BQU0sQ0FBRSxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN0RSxNQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENB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SSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUM5QyxZQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO09BQzNEO0tBQ0Y7OztTQTdSa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICogRXNjYXBlcyBgXCJgIGNoYXJhY2h0ZXJzIGZyb20gc3RyaW5nXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiBlc2NhcGVTdHJpbmcoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgnXCInLCAnXFxcIicpO1xufVxuXG4vKlxuICogRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICpcbiovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnKTtcbn1cblxuLypcbiAqIEdldHMgY29uc3RydWN0b3IgbmFtZSBvZiBhbiBvYmplY3QuXG4gKiBGcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMzMjQyOVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICpcbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T2JqZWN0TmFtZShvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmIChvYmplY3QgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ09iamVjdCc7XG4gIH1cbiAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFvYmplY3QuY29uc3RydWN0b3IpIHtcbiAgICAgIHJldHVybiAnT2JqZWN0JztcbiAgfVxuXG4gIGNvbnN0IGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC87XG4gIGNvbnN0IHJlc3VsdHMgPSAoZnVuY05hbWVSZWdleCkuZXhlYygob2JqZWN0KS5jb25zdHJ1Y3Rvci50b1N0cmluZygpKTtcbiAgaWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHJlc3VsdHNbMV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbi8qXG4gKiBHZXRzIHR5cGUgb2YgYW4gb2JqZWN0LiBSZXR1cm5zIFwibnVsbFwiIGZvciBudWxsIG9iamVjdHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZShvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PT0gbnVsbCkgeyByZXR1cm4gJ251bGwnOyB9XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0O1xufVxuXG4vKlxuICogR2VuZXJhdGVzIGlubGluZSBwcmV2aWV3IGZvciBhIEphdmFTY3JpcHQgb2JqZWN0IGJhc2VkIG9uIGEgdmFsdWVcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlUHJldmlldyAob2JqZWN0LCB2YWx1ZSkge1xuICB2YXIgdHlwZSA9IGdldFR5cGUob2JqZWN0KTtcblxuICBpZiAodHlwZSA9PT0gJ251bGwnIHx8IHR5cGUgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybiB0eXBlOyB9XG5cbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSAnXCInICsgZXNjYXBlU3RyaW5nKHZhbHVlKSArICdcIic7XG4gIH1cbiAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpe1xuXG4gICAgLy8gUmVtb3ZlIGNvbnRlbnQgb2YgdGhlIGZ1bmN0aW9uXG4gICAgcmV0dXJuIG9iamVjdC50b1N0cmluZygpXG4gICAgICAgIC5yZXBsYWNlKC9bXFxyXFxuXS9nLCAnJylcbiAgICAgICAgLnJlcGxhY2UoL1xcey4qXFx9LywgJycpICsgJ3vigKZ9JztcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qXG4gKiBHZW5lcmF0ZXMgaW5saW5lIHByZXZpZXcgZm9yIGEgSmF2YVNjcmlwdCBvYmplY3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcmV2aWV3KG9iamVjdCkge1xuICBsZXQgdmFsdWUgPSAnJztcbiAgaWYgKGlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICB2YWx1ZSA9IGdldE9iamVjdE5hbWUob2JqZWN0KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKVxuICAgICAgdmFsdWUgKz0gJ1snICsgb2JqZWN0Lmxlbmd0aCArICddJztcbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGdldFZhbHVlUHJldmlldyhvYmplY3QsIG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtcbiAgaXNPYmplY3QsXG4gIGdldE9iamVjdE5hbWUsXG4gIGdldFR5cGUsXG4gIGdldFZhbHVlUHJldmlldyxcbiAgZ2V0UHJldmlld1xufSBmcm9tICcuL2hlbHBlcnMuanMnO1xuXG5jb25zdCBEQVRFX1NUUklOR19SRUdFWCA9IC8oXlxcZHsxLDR9W1xcLnxcXFxcL3wtXVxcZHsxLDJ9W1xcLnxcXFxcL3wtXVxcZHsxLDR9KShcXHMqKD86MD9bMS05XTpbMC01XXwxKD89WzAxMl0pXFxkOlswLTVdKVxcZFxccypbYXBdbSk/JC87XG5cbi8qKlxuICogQGNsYXNzIEpTT05Gb3JtYXR0ZXJcbiAqXG4gKiBKU09ORm9ybWF0dGVyIGFsbG93cyB5b3UgdG8gcmVuZGVyIEpTT04gb2JqZWN0cyBpbiBIVE1MIHdpdGggYVxuICogKipjb2xsYXBzaWJsZSoqIG5hdmlnYXRpb24uXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSlNPTkZvcm1hdHRlciB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uIFRoZSBKU09OIG9iamVjdCB5b3Ugd2FudCB0byByZW5kZXIuIEl0IGhhcyB0byBiZSBhblxuICAgKiBvYmplY3Qgb3IgYXJyYXkuIERvIE5PVCBwYXNzIHJhdyBKU09OIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtvcGVuPTFdIGhpcyBudW1iZXIgaW5kaWNhdGVzIHVwIHRvIGhvdyBtYW55IGxldmVscyB0aGVcbiAgICogcmVuZGVyZWQgdHJlZSBzaG91bGQgZXhwYW5kLiBTZXQgaXQgdG8gYDBgIHRvIG1ha2UgdGhlIHdob2xlIHRyZWUgY29sbGFwc2VkXG4gICAqIG9yIHNldCBpdCB0byBgSW5maW5pdHlgIHRvIGV4cGFuZCB0aGUgdHJlZSBkZWVwbHlcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IFtjb25maWc9ZGVmYXVsdENvbmZpZ10gLVxuICAgKiAgZGVmYXVsdENvbmZpZyA9IHtcbiAgICogICBob3ZlclByZXZpZXdFbmFibGVkOiBmYWxzZSxcbiAgICogICBob3ZlclByZXZpZXdBcnJheUNvdW50OiAxMDAsXG4gICAqICAgaG92ZXJQcmV2aWV3RmllbGRDb3VudDogNVxuICAgKiB9XG4gICAqXG4gICAqIEF2YWlsYWJsZSBjb25maWd1cmF0aW9uczpcbiAgICogICMjIyMjSG92ZXIgUHJldmlld1xuICAgKiAqIGBob3ZlclByZXZpZXdFbmFibGVkYDogIGVuYWJsZSBwcmV2aWV3IG9uIGhvdmVyXG4gICAqICogYGhvdmVyUHJldmlld0FycmF5Q291bnRgOiBudW1iZXIgb2YgYXJyYXkgaXRlbXMgdG8gc2hvdyBpbiBwcmV2aWV3IEFueVxuICAgKiAgICBhcnJheSBsYXJnZXIgdGhhbiB0aGlzIG51bWJlciB3aWxsIGJlIHNob3duIGFzIGBBcnJheVtYWFhdYCB3aGVyZSBgWFhYYFxuICAgKiAgICBpcyBsZW5ndGggb2YgdGhlIGFycmF5LlxuICAgKiAqIGBob3ZlclByZXZpZXdGaWVsZENvdW50YDogbnVtYmVyIG9mIG9iamVjdCBwcm9wZXJ0aWVzIHRvIHNob3cgZm9yIG9iamVjdFxuICAgKiAgIHByZXZpZXcuIEFueSBvYmplY3Qgd2l0aCBtb3JlIHByb3BlcnRpZXMgdGhhdCB0aGluIG51bWJlciB3aWxsIGJlXG4gICAqICAgdHJ1bmNhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2tleT11bmRlZmluZWRdIFRoZSBrZXkgdGhhdCB0aGlzIG9iamVjdCBpbiBpdCdzIHBhcmVudFxuICAgKiBjb250ZXh0XG4gICovXG4gIGNvbnN0cnVjdG9yKGpzb24sIG9wZW4sIGNvbmZpZywga2V5KSB7XG4gICAgdGhpcy5qc29uID0ganNvbjtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgICB0aGlzLm9wZW4gPSBvcGVuID09PSB1bmRlZmluZWQgPyAxIDogb3BlbjtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0VuYWJsZWQgPVxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RW5hYmxlZCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOlxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RW5hYmxlZDtcblxuICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0FycmF5Q291bnQgPVxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3QXJyYXlDb3VudCA9PT0gdW5kZWZpbmVkID8gMTAwIDpcbiAgICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0FycmF5Q291bnQ7XG5cbiAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdGaWVsZENvdW50ID1cbiAgICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0ZpZWxkQ291bnQgPT09IHVuZGVmaW5lZCA/IDUgOlxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RmllbGRDb3VudDtcblxuICAgIHRoaXMudHlwZSA9IGdldFR5cGUodGhpcy5qc29uKTtcbiAgICB0aGlzLmhhc0tleSA9IHR5cGVvZiB0aGlzLmtleSAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICAvLyBJZiAnb3BlbicgYXR0cmlidXRlIGlzIHByZXNlbnRcbiAgICB0aGlzLmlzT3BlbiA9IHRoaXMub3BlbiA+IDA7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnc3RyaW5nJyl7XG5cbiAgICAgIC8vIEFkZCBjdXN0b20gdHlwZSBmb3IgZGF0ZVxuICAgICAgaWYoREFURV9TVFJJTkdfUkVHRVgudGVzdChqc29uKSkge1xuICAgICAgICB0aGlzLmlzRGF0ZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBjdXN0b20gdHlwZSBmb3IgVVJMc1xuICAgICAgaWYgKHRoaXMuanNvbi5pbmRleE9mKCdodHRwJykgPT09IDApIHtcbiAgICAgICAgdGhpcy5pc1VybCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pc0FycmF5ID0gQXJyYXkuaXNBcnJheSh0aGlzLmpzb24pO1xuICAgIHRoaXMuaXNPYmplY3QgPSBpc09iamVjdCh0aGlzLmpzb24pO1xuXG4gICAgdGhpcy5rZXlzID0gW107XG4gICAgaWYgKHRoaXMuaXNPYmplY3QpIHtcbiAgICAgIHRoaXMua2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuanNvbikubWFwKChrZXkpPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSAnJykgeyByZXR1cm4gJ1wiXCInOyB9XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmlzRW1wdHlPYmplY3QgPSAhdGhpcy5rZXlzLmxlbmd0aCAmJiB0aGlzLmlzT3BlbiAmJiAhdGhpcy5pc0FycmF5O1xuICAgIHRoaXMub25zdHJ1Y3Rvck5hbWUgPSBnZXRPYmplY3ROYW1lKHRoaXMuanNvbik7XG4gICAgdGhpcy5pc0VtcHR5ID0gdGhpcy5pc0VtcHR5T2JqZWN0IHx8ICh0aGlzLmtleXMgJiZcbiAgICAgICF0aGlzLmtleXMubGVuZ3RoICYmXG4gICAgICB0aGlzLmlzQXJyYXkpO1xuXG4gICAgdGhpcy5nZXRWYWx1ZVByZXZpZXcgPSBnZXRWYWx1ZVByZXZpZXc7XG4gIH1cblxuXG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgYGlzT3BlbmAgc3RhdGVcbiAgICpcbiAgKi9cbiAgdG9nZ2xlT3BlbigpIHtcbiAgICB0aGlzLmlzT3BlbiA9ICF0aGlzLmlzT3BlbjtcblxuICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZGVybigpO1xuICAgIH0gZWxzZXtcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgaW5saW5lIHByZXZpZXdcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgZ2V0SW5saW5lcHJldmlldygpIHtcbiAgICBpZiAodGhpcy5pc0FycmF5KSB7XG5cbiAgICAgIC8vIGlmIGFycmF5IGxlbmd0aCBpcyBncmVhdGVyIHRoZW4gMTAwIGl0IHNob3dzIFwiQXJyYXlbMTAxXVwiXG4gICAgICBpZiAodGhpcy5qc29uLmxlbmd0aCA+IHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0FycmF5Q291bnQpIHtcbiAgICAgICAgcmV0dXJuIGBBcnJheVske3RoaXMuanNvbi5sZW5ndGh9XWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYFske3RoaXMuanNvbi5tYXAoZ2V0UHJldmlldykuam9pbignLCAnKX1dYDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuXG4gICAgICBjb25zdCBrZXlzID0gdGhpcy5rZXlzO1xuXG4gICAgICAvLyB0aGUgZmlyc3QgZml2ZSBrZXlzIChsaWtlIENocm9tZSBEZXZlbG9wZXIgVG9vbClcbiAgICAgIGNvbnN0IG5hcnJvd0tleXMgPSBrZXlzLnNsaWNlKDAsIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0ZpZWxkQ291bnQpO1xuXG4gICAgICAvLyBqc29uIHZhbHVlIHNjaGVtYXRpYyBpbmZvcm1hdGlvblxuICAgICAgY29uc3Qga3ZzID0gbmFycm93S2V5cy5tYXAoa2V5ID0+IGAke2tleX06JHtnZXRQcmV2aWV3KHRoaXMuanNvbltrZXldKX1gKTtcblxuICAgICAgLy8gaWYga2V5cyBjb3VudCBncmVhdGVyIHRoZW4gNSB0aGVuIHNob3cgZWxsaXBzaXNcbiAgICAgIGNvbnN0IGVsbGlwc2lzID0ga2V5cy5sZW5ndGggPj0gNSA/ICfigKYnIDogJyc7XG5cbiAgICAgIHJldHVybiBgeyR7a3ZzLmpvaW4oJywgJyl9JHtlbGxpcHNpc319YDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIEhUTUwgc3RyaW5nICBmb3IgdGhpcyBKU09OIGJhc2VkIG9uIHRoZSB0ZW1wbGF0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0ZW1wbGF0ZSgpIHtcblxuICAgIC8qXG4gICAgICogaWYgY29uZGl0aW9uIGZvciBFUzYgdGVtcGxhdGUgc3RyaW5nc1xuICAgICAqIHRvIGJlIHVzZWQgb25seSBpbiB0ZW1wbGF0ZSBzdHJpbmdcbiAgICAgKlxuICAgICAqIEBleGFtcGxlIG15c3RyID0gYFJhbmRvbSBpcyAke19pZihNYXRoLnJhbmRvbSgpID4gMC41KWBncmVhdGVyIHRoYW4gMC41YGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259IHRoZSB0ZW1wbGF0ZSBmdW5jdGlvblxuICAgICovXG4gICAgZnVuY3Rpb24gX2lmKGNvbmRpdGlvbikge1xuICAgICAgcmV0dXJuIGNvbmRpdGlvbiA/IG5vcm1hbCA6IGVtcHR5O1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbXB0eSgpe1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBmdW5jdGlvbiBub3JtYWwgKHRlbXBsYXRlLCAuLi5leHByZXNzaW9ucykge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlLnNsaWNlKDEpLnJlZHVjZSgoYWNjdW11bGF0b3IsIHBhcnQsIGkpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgZXhwcmVzc2lvbnNbaV0gKyBwYXJ0O1xuICAgICAgfSwgdGVtcGxhdGVbMF0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXBsYXRlU3RyaW5nID0gYFxuICAgICAgPGEgY2xhc3M9XCJ0b2dnbGVyLWxpbmtcIj5cbiAgICAgICAgJHtfaWYodGhpcy5pc09iamVjdClgXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0b2dnbGVyXCI+PC9zcGFuPlxuICAgICAgICBgfVxuXG4gICAgICAgICR7X2lmKHRoaXMuaGFzS2V5KWBcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImtleVwiPiR7dGhpcy5rZXl9Ojwvc3Bhbj5cbiAgICAgICAgYH1cblxuICAgICAgICA8c3BhbiBjbGFzcz1cInZhbHVlXCI+XG5cbiAgICAgICAgICAke19pZih0aGlzLmlzT2JqZWN0KWBcbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNvbnN0cnVjdG9yLW5hbWVcIj4ke3RoaXMub25zdHJ1Y3Rvck5hbWV9PC9zcGFuPlxuXG4gICAgICAgICAgICAgICR7X2lmKHRoaXMuaXNBcnJheSlgXG4gICAgICAgICAgICAgICAgPHNwYW4+PHNwYW4gY2xhc3M9XCJicmFja2V0XCI+Wzwvc3Bhbj48c3BhbiBjbGFzcz1cIm51bWJlclwiPiR7XG4gICAgICAgICAgICAgICAgICB0aGlzLmpzb24gJiYgdGhpcy5qc29uLmxlbmd0aFxuICAgICAgICAgICAgICAgIH08L3NwYW4+PHNwYW4gY2xhc3M9XCJicmFja2V0XCI+XTwvc3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgIGB9XG5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICBgfVxuXG4gICAgICAgICAgJHtfaWYoIXRoaXMuaXNPYmplY3QpYFxuXG4gICAgICAgICAgICA8JHt0aGlzLmlzVXJsID8gJ2EnIDogJ3NwYW4nfVxuICAgICAgICAgICAgICBjbGFzcz1cIiR7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlXG4gICAgICAgICAgICAgIH0gJHtcbiAgICAgICAgICAgICAgICBfaWYodGhpcy5pc0RhdGUpYGRhdGVgXG4gICAgICAgICAgICAgIH0gJHtcbiAgICAgICAgICAgICAgICBfaWYodGhpcy5pc1VybClgdXJsYFxuICAgICAgICAgICAgICB9XCJcbiAgICAgICAgICAgICAgJHtfaWYodGhpcy5pc1VybClgaHJlZj1cIiR7dGhpcy5qc29ufVwiYH1cbiAgICAgICAgICAgID4ke3RoaXMuZ2V0VmFsdWVQcmV2aWV3KHRoaXMuanNvbiwgdGhpcy5qc29uKX08LyR7XG4gICAgICAgICAgICAgIHRoaXMuaXNVcmwgPyAnYScgOiAnc3BhbidcbiAgICAgICAgICAgIH0+XG5cbiAgICAgICAgICBgfVxuXG4gICAgICAgIDwvc3Bhbj5cblxuICAgICAgICAke19pZih0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdFbmFibGVkICYmIHRoaXMuaXNPYmplY3QpYFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJldmlldy10ZXh0XCI+JHt0aGlzLmdldElubGluZXByZXZpZXcoKX08L3NwYW4+XG4gICAgICAgIGB9XG4gICAgICA8L2E+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJjaGlsZHJlbiAke1xuICAgICAgICBfaWYodGhpcy5pc09iamVjdClgb2JqZWN0YFxuICAgICAgfSAke1xuICAgICAgICBfaWYodGhpcy5pc0FycmF5KWBhcnJheWBcbiAgICAgIH0gJHtcbiAgICAgICAgX2lmKHRoaXMuaXNFbXB0eSlgZW1wdHlgXG4gICAgICB9XCI+PC9kaXY+XG4gICAgYDtcblxuICAgIHJldHVybiB0ZW1wbGF0ZVN0cmluZy5yZXBsYWNlKC9cXHMqXFxuL2csICdcXG4nKTsgLy8gY2xlYW4gdXAgZW1wdHkgbGluZXNcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIGFuIEhUTUwgZWxlbWVudCBhbmQgaW5zdGFsbHMgZXZlbnQgbGlzdGVuZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtIVE1MRGl2RWxlbWVudH1cbiAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJlc3VsdEhUTUwgPSB0aGlzLnRlbXBsYXRlKCk7XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnanNvbi1mb3JtYXR0ZXItcm93Jyk7XG5cbiAgICBpZiAodGhpcy5jb25maWcgJiYgdGhpcy5jb25maWcudGhlbWUpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGBqc29uLWZvcm1hdHRlci0ke3RoaXMuY29uZmlnLnRoZW1lfWApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gcmVzdWx0SFRNTDtcblxuICAgIGlmICh0aGlzLmlzT2JqZWN0ICYmIHRoaXMuaXNPcGVuKSB7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkZXJuKCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGV2ZW50IGxpc3RlbmVyIGZvciB0b2dnbGluZ1xuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhLnRvZ2dsZXItbGluaycpXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnRvZ2dsZU9wZW4uYmluZCh0aGlzKSk7XG5cbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYWxsIHRoZSBjaGlsZHJlbiB0byBgPGRpdiBjbGFzcz1cImNoaWxkcmVuXCI+PC9kaXY+YCBlbGVtZW50XG4gICAqXG4gICovXG4gIGFwcGVuZENoaWxkZXJuKCkge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5jaGlsZHJlbicpO1xuXG4gICAgaWYgKCFjaGlsZHJlbikgeyByZXR1cm47IH1cblxuICAgIHRoaXMua2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSlNPTkZvcm1hdHRlcihcbiAgICAgICAgdGhpcy5qc29uW2tleV0sIHRoaXMub3BlbiAtIDEsIHRoaXMuY29uZmlnLCBrZXkpO1xuXG4gICAgICBjaGlsZHJlbi5hcHBlbmRDaGlsZChmb3JtYXR0ZXIucmVuZGVyKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIHRoZSBjaGlsZHJlbiBmcm9tIGA8ZGl2IGNsYXNzPVwiY2hpbGRyZW5cIj48L2Rpdj5gIGVsZW1lbnRcbiAgICpcbiAgKi9cbiAgcmVtb3ZlQ2hpbGRyZW4oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY2hpbGRyZW4nKSkge1xuICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5jaGlsZHJlbicpLmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgfVxufVxuIl19
