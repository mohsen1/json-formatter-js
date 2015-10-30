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
    _templateObject12 = _taggedTemplateLiteral(['empty'], ['empty']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _helpersJs = require('./helpers.js');

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
window.JSONFormatter = JSONFormatter;
module.exports = exports['default'];

},{"./helpers.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9oc2VuL1Byb2plY3RzL2pzb24tZm9ybWF0dGVyLWpzL3NyYy9oZWxwZXJzLmpzIiwiL1VzZXJzL21vaHNlbi9Qcm9qZWN0cy9qc29uLWZvcm1hdHRlci1qcy9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRYixTQUFTLFlBQVksQ0FBQyxHQUFHLEVBQUU7QUFDekIsU0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztDQUMvQjs7Ozs7Ozs7Ozs7QUFVTSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDOUIsTUFBSSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUM7QUFDeEIsU0FBTyxDQUFDLENBQUMsS0FBSyxJQUFLLElBQUksSUFBSSxRQUFRLEFBQUMsQ0FBQztDQUN0Qzs7Ozs7Ozs7Ozs7O0FBV00sU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFO0FBQ3BDLE1BQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUN4QixXQUFPLEVBQUUsQ0FBQztHQUNYO0FBQ0QsTUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ25CLFdBQU8sUUFBUSxDQUFDO0dBQ2pCO0FBQ0QsTUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ25ELFdBQU8sUUFBUSxDQUFDO0dBQ25COztBQUVELE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDO0FBQzNDLE1BQU0sT0FBTyxHQUFHLEFBQUMsYUFBYSxDQUFFLElBQUksQ0FBQyxBQUFDLE1BQU0sQ0FBRSxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN0RSxNQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNqQyxXQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNuQixNQUFNO0FBQ0wsV0FBTyxFQUFFLENBQUM7R0FDWDtDQUNGOzs7Ozs7Ozs7O0FBU00sU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQzlCLE1BQUksTUFBTSxLQUFLLElBQUksRUFBRTtBQUFFLFdBQU8sTUFBTSxDQUFDO0dBQUU7QUFDdkMsU0FBTyxPQUFPLE1BQU0sQ0FBQztDQUN0Qjs7Ozs7Ozs7OztBQVNNLFNBQVMsZUFBZSxDQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDOUMsTUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUUzQixNQUFJLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLFdBQVcsRUFBRTtBQUFFLFdBQU8sSUFBSSxDQUFDO0dBQUU7O0FBRTdELE1BQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUNyQixTQUFLLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7R0FDekM7QUFDRCxNQUFJLElBQUksS0FBSyxVQUFVLEVBQUM7OztBQUd0QixXQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FDbkIsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FDdEIsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7R0FDcEM7QUFDRCxTQUFPLEtBQUssQ0FBQztDQUNkOzs7Ozs7Ozs7QUFRTSxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDakMsTUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsTUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDcEIsU0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixRQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3ZCLEtBQUssSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7R0FDdEMsTUFBTTtBQUNMLFNBQUssR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQ3pDO0FBQ0QsU0FBTyxLQUFLLENBQUM7Q0FDZDs7O0FDM0dELFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQVVOLGNBQWM7Ozs7Ozs7OztJQVFBLGFBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QnJCLFdBOUJRLGFBQWEsQ0E4QnBCLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTswQkE5QmxCLGFBQWE7O0FBK0I5QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzFDLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQzs7QUFFM0IsUUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsS0FBSyxTQUFTLEdBQUcsS0FBSyxHQUNyRCxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDOztBQUVsQyxRQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixHQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixLQUFLLFNBQVMsR0FBRyxHQUFHLEdBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUM7O0FBRXJDLFFBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEdBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEtBQUssU0FBUyxHQUFHLENBQUMsR0FDcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQzs7QUFFckMsUUFBSSxDQUFDLElBQUksR0FBRyx3QkFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLElBQUksQ0FBQyxHQUFHLEtBQUssV0FBVyxDQUFDOzs7QUFHOUMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzs7QUFFNUIsUUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBQzs7O0FBR3pCLFVBQUcsQUFBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUUsUUFBUSxFQUFFLEtBQUssY0FBYyxFQUFFO0FBQ3RELFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO09BQ3BCOzs7QUFHRCxVQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNuQyxZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztPQUNuQjtLQUNGOztBQUVELFFBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsUUFBSSxDQUFDLFFBQVEsR0FBRyx5QkFBUyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBDLFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxFQUFJO0FBQzdDLFlBQUksR0FBRyxLQUFLLEVBQUUsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQztTQUFFO0FBQ2hDLGVBQU8sR0FBRyxDQUFDO09BQ1osQ0FBQyxDQUFDO0tBQ0o7O0FBRUQsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ3ZFLFFBQUksQ0FBQyxjQUFjLEdBQUcsOEJBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSyxJQUFJLENBQUMsSUFBSSxJQUM3QyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUNqQixJQUFJLENBQUMsT0FBTyxBQUFDLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxlQUFlLDZCQUFrQixDQUFDO0dBQ3hDOzs7Ozs7Ozs7ZUFyRmtCLGFBQWE7O1dBNkZ0QixzQkFBRztBQUNYLFVBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUUzQixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDdkIsTUFBSztBQUNKLFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUN2Qjs7QUFFRCxVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3ZDO0tBQ0Y7Ozs7Ozs7OztXQU9lLDRCQUFHOzs7QUFDakIsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFOzs7QUFHaEIsWUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFO0FBQ3pELDRCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sT0FBSTtTQUNyQyxNQUFNO0FBQ0wsdUJBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLHVCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFJO1NBQ3BEO09BQ0YsTUFBTTs7QUFFTCxZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOzs7QUFHdkIsWUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOzs7QUFHckUsWUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7aUJBQU8sR0FBRyxTQUFJLDJCQUFXLE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUUsQ0FBQyxDQUFDOzs7QUFHMUUsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQzs7QUFFN0MscUJBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLE9BQUk7T0FDekM7S0FDRjs7Ozs7Ozs7O1dBT08sb0JBQUc7Ozs7Ozs7Ozs7OztBQVlULGVBQVMsR0FBRyxDQUFDLFNBQVMsRUFBRTtBQUN0QixlQUFPLFNBQVMsR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ25DO0FBQ0QsZUFBUyxLQUFLLEdBQUU7QUFDZCxlQUFPLEVBQUUsQ0FBQztPQUNYO0FBQ0QsZUFBUyxNQUFNLENBQUUsUUFBUSxFQUFrQjswQ0FBYixXQUFXO0FBQVgscUJBQVc7OztBQUN2QyxlQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUs7QUFDeEQsaUJBQU8sV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDNUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNqQjs7QUFFRCxVQUFNLGNBQWMsa0RBRWQsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMscUNBSWxCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUNJLElBQUksQ0FBQyxHQUFHLHVEQUsxQixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFFaUIsSUFBSSxDQUFDLGNBQWMsRUFFbEQsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBRWYsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sd0JBT25DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBRWhCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLE1BQU0sRUFFeEIsSUFBSSxDQUFDLElBQUksRUFFVCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFFaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBRWYsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQVMsSUFBSSxDQUFDLElBQUksR0FDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsTUFBTSx3Q0FPN0IsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFDeEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLG9EQUt0RCxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyw0QkFFbEIsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsNEJBRWpCLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHNDQUVwQixDQUFDOztBQUVGLGFBQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDL0M7Ozs7Ozs7OztXQU9LLGtCQUFHO0FBQ1AsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUVuQyxVQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRWpELFVBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNwQyxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLHFCQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBRyxDQUFDO09BQ25FOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNwQzs7QUFFRCxVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7O0FBRXBDLFVBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2hDLFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUN2Qjs7O0FBR0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FDekMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRXpELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7Ozs7Ozs7V0FNYSwwQkFBRzs7O0FBQ2YsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRTVELFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRTFCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFJO0FBQ3hCLFlBQU0sU0FBUyxHQUFHLElBQUksYUFBYSxDQUNqQyxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFLLElBQUksR0FBRyxDQUFDLEVBQUUsT0FBSyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRW5ELGdCQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO09BQzFDLENBQUMsQ0FBQztLQUNKOzs7Ozs7OztXQU1hLDBCQUFHO0FBQ2YsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUM5QyxZQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO09BQzNEO0tBQ0Y7OztTQTdSa0IsYUFBYTs7O3FCQUFiLGFBQWE7QUFpU2xDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAqIEVzY2FwZXMgYFwiYCBjaGFyYWNodGVycyBmcm9tIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gZXNjYXBlU3RyaW5nKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoJ1wiJywgJ1xcXCInKTtcbn1cblxuLypcbiAqIERldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0Jyk7XG59XG5cbi8qXG4gKiBHZXRzIGNvbnN0cnVjdG9yIG5hbWUgb2YgYW4gb2JqZWN0LlxuICogRnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMzI0MjlcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE9iamVjdE5hbWUob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAob2JqZWN0ID09PSBudWxsKSB7XG4gICAgcmV0dXJuICdPYmplY3QnO1xuICB9XG4gIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAhb2JqZWN0LmNvbnN0cnVjdG9yKSB7XG4gICAgICByZXR1cm4gJ09iamVjdCc7XG4gIH1cblxuICBjb25zdCBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uICguezEsfSlcXCgvO1xuICBjb25zdCByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMoKG9iamVjdCkuY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XG4gIGlmIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiByZXN1bHRzWzFdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG4vKlxuICogR2V0cyB0eXBlIG9mIGFuIG9iamVjdC4gUmV0dXJucyBcIm51bGxcIiBmb3IgbnVsbCBvYmplY3RzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGUob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT09IG51bGwpIHsgcmV0dXJuICdudWxsJzsgfVxuICByZXR1cm4gdHlwZW9mIG9iamVjdDtcbn1cblxuLypcbiAqIEdlbmVyYXRlcyBpbmxpbmUgcHJldmlldyBmb3IgYSBKYXZhU2NyaXB0IG9iamVjdCBiYXNlZCBvbiBhIHZhbHVlXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZVByZXZpZXcgKG9iamVjdCwgdmFsdWUpIHtcbiAgdmFyIHR5cGUgPSBnZXRUeXBlKG9iamVjdCk7XG5cbiAgaWYgKHR5cGUgPT09ICdudWxsJyB8fCB0eXBlID09PSAndW5kZWZpbmVkJykgeyByZXR1cm4gdHlwZTsgfVxuXG4gIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gJ1wiJyArIGVzY2FwZVN0cmluZyh2YWx1ZSkgKyAnXCInO1xuICB9XG4gIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKXtcblxuICAgIC8vIFJlbW92ZSBjb250ZW50IG9mIHRoZSBmdW5jdGlvblxuICAgIHJldHVybiBvYmplY3QudG9TdHJpbmcoKVxuICAgICAgICAucmVwbGFjZSgvW1xcclxcbl0vZywgJycpXG4gICAgICAgIC5yZXBsYWNlKC9cXHsuKlxcfS8sICcnKSArICd74oCmfSc7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKlxuICogR2VuZXJhdGVzIGlubGluZSBwcmV2aWV3IGZvciBhIEphdmFTY3JpcHQgb2JqZWN0XG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJldmlldyhvYmplY3QpIHtcbiAgbGV0IHZhbHVlID0gJyc7XG4gIGlmIChpc09iamVjdChvYmplY3QpKSB7XG4gICAgdmFsdWUgPSBnZXRPYmplY3ROYW1lKG9iamVjdCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSlcbiAgICAgIHZhbHVlICs9ICdbJyArIG9iamVjdC5sZW5ndGggKyAnXSc7XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBnZXRWYWx1ZVByZXZpZXcob2JqZWN0LCBvYmplY3QpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbi8qIGdsb2JhbHMgSlNPTkZvcm1hdHRlciAqL1xuXG5pbXBvcnQge1xuICBpc09iamVjdCxcbiAgZ2V0T2JqZWN0TmFtZSxcbiAgZ2V0VHlwZSxcbiAgZ2V0VmFsdWVQcmV2aWV3LFxuICBnZXRQcmV2aWV3XG59IGZyb20gJy4vaGVscGVycy5qcyc7XG5cbi8qKlxuICogQGNsYXNzIEpTT05Gb3JtYXR0ZXJcbiAqXG4gKiBKU09ORm9ybWF0dGVyIGFsbG93cyB5b3UgdG8gcmVuZGVyIEpTT04gb2JqZWN0cyBpbiBIVE1MIHdpdGggYVxuICogKipjb2xsYXBzaWJsZSoqIG5hdmlnYXRpb24uXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSlNPTkZvcm1hdHRlciB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uIFRoZSBKU09OIG9iamVjdCB5b3Ugd2FudCB0byByZW5kZXIuIEl0IGhhcyB0byBiZSBhblxuICAgKiBvYmplY3Qgb3IgYXJyYXkuIERvIE5PVCBwYXNzIHJhdyBKU09OIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtvcGVuPTFdIGhpcyBudW1iZXIgaW5kaWNhdGVzIHVwIHRvIGhvdyBtYW55IGxldmVscyB0aGVcbiAgICogcmVuZGVyZWQgdHJlZSBzaG91bGQgZXhwYW5kLiBTZXQgaXQgdG8gYDBgIHRvIG1ha2UgdGhlIHdob2xlIHRyZWUgY29sbGFwc2VkXG4gICAqIG9yIHNldCBpdCB0byBgSW5maW5pdHlgIHRvIGV4cGFuZCB0aGUgdHJlZSBkZWVwbHlcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IFtjb25maWc9ZGVmYXVsdENvbmZpZ10gLVxuICAgKiAgZGVmYXVsdENvbmZpZyA9IHtcbiAgICogICBob3ZlclByZXZpZXdFbmFibGVkOiBmYWxzZSxcbiAgICogICBob3ZlclByZXZpZXdBcnJheUNvdW50OiAxMDAsXG4gICAqICAgaG92ZXJQcmV2aWV3RmllbGRDb3VudDogNVxuICAgKiB9XG4gICAqXG4gICAqIEF2YWlsYWJsZSBjb25maWd1cmF0aW9uczpcbiAgICogICMjIyMjSG92ZXIgUHJldmlld1xuICAgKiAqIGBob3ZlclByZXZpZXdFbmFibGVkYDogIGVuYWJsZSBwcmV2aWV3IG9uIGhvdmVyXG4gICAqICogYGhvdmVyUHJldmlld0FycmF5Q291bnRgOiBudW1iZXIgb2YgYXJyYXkgaXRlbXMgdG8gc2hvdyBpbiBwcmV2aWV3IEFueVxuICAgKiAgICBhcnJheSBsYXJnZXIgdGhhbiB0aGlzIG51bWJlciB3aWxsIGJlIHNob3duIGFzIGBBcnJheVtYWFhdYCB3aGVyZSBgWFhYYFxuICAgKiAgICBpcyBsZW5ndGggb2YgdGhlIGFycmF5LlxuICAgKiAqIGBob3ZlclByZXZpZXdGaWVsZENvdW50YDogbnVtYmVyIG9mIG9iamVjdCBwcm9wZXJ0aWVzIHRvIHNob3cgZm9yIG9iamVjdFxuICAgKiAgIHByZXZpZXcuIEFueSBvYmplY3Qgd2l0aCBtb3JlIHByb3BlcnRpZXMgdGhhdCB0aGluIG51bWJlciB3aWxsIGJlXG4gICAqICAgdHJ1bmNhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2tleT11bmRlZmluZWRdIFRoZSBrZXkgdGhhdCB0aGlzIG9iamVjdCBpbiBpdCdzIHBhcmVudFxuICAgKiBjb250ZXh0XG4gICovXG4gIGNvbnN0cnVjdG9yKGpzb24sIG9wZW4sIGNvbmZpZywga2V5KSB7XG4gICAgdGhpcy5qc29uID0ganNvbjtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgICB0aGlzLm9wZW4gPSBvcGVuID09PSB1bmRlZmluZWQgPyAxIDogb3BlbjtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0VuYWJsZWQgPVxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RW5hYmxlZCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOlxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RW5hYmxlZDtcblxuICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0FycmF5Q291bnQgPVxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3QXJyYXlDb3VudCA9PT0gdW5kZWZpbmVkID8gMTAwIDpcbiAgICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0FycmF5Q291bnQ7XG5cbiAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdGaWVsZENvdW50ID1cbiAgICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0ZpZWxkQ291bnQgPT09IHVuZGVmaW5lZCA/IDUgOlxuICAgICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RmllbGRDb3VudDtcblxuICAgIHRoaXMudHlwZSA9IGdldFR5cGUodGhpcy5qc29uKTtcbiAgICB0aGlzLmhhc0tleSA9IHR5cGVvZiB0aGlzLmtleSAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICAvLyBJZiAnb3BlbicgYXR0cmlidXRlIGlzIHByZXNlbnRcbiAgICB0aGlzLmlzT3BlbiA9IHRoaXMub3BlbiA+IDA7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAnc3RyaW5nJyl7XG5cbiAgICAgIC8vIEFkZCBjdXN0b20gdHlwZSBmb3IgZGF0ZVxuICAgICAgaWYoKG5ldyBEYXRlKHRoaXMuanNvbikpLnRvU3RyaW5nKCkgIT09ICdJbnZhbGlkIERhdGUnKSB7XG4gICAgICAgIHRoaXMuaXNEYXRlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIGN1c3RvbSB0eXBlIGZvciBVUkxzXG4gICAgICBpZiAodGhpcy5qc29uLmluZGV4T2YoJ2h0dHAnKSA9PT0gMCkge1xuICAgICAgICB0aGlzLmlzVXJsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5KHRoaXMuanNvbik7XG4gICAgdGhpcy5pc09iamVjdCA9IGlzT2JqZWN0KHRoaXMuanNvbik7XG5cbiAgICB0aGlzLmtleXMgPSBbXTtcbiAgICBpZiAodGhpcy5pc09iamVjdCkge1xuICAgICAgdGhpcy5rZXlzID0gT2JqZWN0LmtleXModGhpcy5qc29uKS5tYXAoKGtleSk9PiB7XG4gICAgICAgIGlmIChrZXkgPT09ICcnKSB7IHJldHVybiAnXCJcIic7IH1cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuaXNFbXB0eU9iamVjdCA9ICF0aGlzLmtleXMubGVuZ3RoICYmIHRoaXMuaXNPcGVuICYmICF0aGlzLmlzQXJyYXk7XG4gICAgdGhpcy5vbnN0cnVjdG9yTmFtZSA9IGdldE9iamVjdE5hbWUodGhpcy5qc29uKTtcbiAgICB0aGlzLmlzRW1wdHkgPSB0aGlzLmlzRW1wdHlPYmplY3QgfHwgKHRoaXMua2V5cyAmJlxuICAgICAgIXRoaXMua2V5cy5sZW5ndGggJiZcbiAgICAgIHRoaXMuaXNBcnJheSk7XG5cbiAgICB0aGlzLmdldFZhbHVlUHJldmlldyA9IGdldFZhbHVlUHJldmlldztcbiAgfVxuXG5cblxuICAvKipcbiAgICogVG9nZ2xlcyBgaXNPcGVuYCBzdGF0ZVxuICAgKlxuICAqL1xuICB0b2dnbGVPcGVuKCkge1xuICAgIHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuXG4gICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkZXJuKCk7XG4gICAgfSBlbHNle1xuICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBpbmxpbmUgcHJldmlld1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICBnZXRJbmxpbmVwcmV2aWV3KCkge1xuICAgIGlmICh0aGlzLmlzQXJyYXkpIHtcblxuICAgICAgLy8gaWYgYXJyYXkgbGVuZ3RoIGlzIGdyZWF0ZXIgdGhlbiAxMDAgaXQgc2hvd3MgXCJBcnJheVsxMDFdXCJcbiAgICAgIGlmICh0aGlzLmpzb24ubGVuZ3RoID4gdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3QXJyYXlDb3VudCkge1xuICAgICAgICByZXR1cm4gYEFycmF5WyR7dGhpcy5qc29uLmxlbmd0aH1dYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBgWyR7dGhpcy5qc29uLm1hcChnZXRQcmV2aWV3KS5qb2luKCcsICcpfV1gO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnN0IGtleXMgPSB0aGlzLmtleXM7XG5cbiAgICAgIC8vIHRoZSBmaXJzdCBmaXZlIGtleXMgKGxpa2UgQ2hyb21lIERldmVsb3BlciBUb29sKVxuICAgICAgY29uc3QgbmFycm93S2V5cyA9IGtleXMuc2xpY2UoMCwgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RmllbGRDb3VudCk7XG5cbiAgICAgIC8vIGpzb24gdmFsdWUgc2NoZW1hdGljIGluZm9ybWF0aW9uXG4gICAgICBjb25zdCBrdnMgPSBuYXJyb3dLZXlzLm1hcChrZXkgPT4gYCR7a2V5fToke2dldFByZXZpZXcodGhpcy5qc29uW2tleV0pfWApO1xuXG4gICAgICAvLyBpZiBrZXlzIGNvdW50IGdyZWF0ZXIgdGhlbiA1IHRoZW4gc2hvdyBlbGxpcHNpc1xuICAgICAgY29uc3QgZWxsaXBzaXMgPSBrZXlzLmxlbmd0aCA+PSA1ID8gJ+KApicgOiAnJztcblxuICAgICAgcmV0dXJuIGB7JHtrdnMuam9pbignLCAnKX0ke2VsbGlwc2lzfX1gO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgSFRNTCBzdHJpbmcgIGZvciB0aGlzIEpTT04gYmFzZWQgb24gdGhlIHRlbXBsYXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRlbXBsYXRlKCkge1xuXG4gICAgLypcbiAgICAgKiBpZiBjb25kaXRpb24gZm9yIEVTNiB0ZW1wbGF0ZSBzdHJpbmdzXG4gICAgICogdG8gYmUgdXNlZCBvbmx5IGluIHRlbXBsYXRlIHN0cmluZ1xuICAgICAqXG4gICAgICogQGV4YW1wbGUgbXlzdHIgPSBgUmFuZG9tIGlzICR7X2lmKE1hdGgucmFuZG9tKCkgPiAwLjUpYGdyZWF0ZXIgdGhhbiAwLjVgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjb25kaXRpb25cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbn0gdGhlIHRlbXBsYXRlIGZ1bmN0aW9uXG4gICAgKi9cbiAgICBmdW5jdGlvbiBfaWYoY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gY29uZGl0aW9uID8gbm9ybWFsIDogZW1wdHk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVtcHR5KCl7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG5vcm1hbCAodGVtcGxhdGUsIC4uLmV4cHJlc3Npb25zKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGUuc2xpY2UoMSkucmVkdWNlKChhY2N1bXVsYXRvciwgcGFydCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBleHByZXNzaW9uc1tpXSArIHBhcnQ7XG4gICAgICB9LCB0ZW1wbGF0ZVswXSk7XG4gICAgfVxuXG4gICAgY29uc3QgdGVtcGxhdGVTdHJpbmcgPSBgXG4gICAgICA8YSBjbGFzcz1cInRvZ2dsZXItbGlua1wiPlxuICAgICAgICAke19pZih0aGlzLmlzT2JqZWN0KWBcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInRvZ2dsZXJcIj48L3NwYW4+XG4gICAgICAgIGB9XG5cbiAgICAgICAgJHtfaWYodGhpcy5oYXNLZXkpYFxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwia2V5XCI+JHt0aGlzLmtleX06PC9zcGFuPlxuICAgICAgICBgfVxuXG4gICAgICAgIDxzcGFuIGNsYXNzPVwidmFsdWVcIj5cblxuICAgICAgICAgICR7X2lmKHRoaXMuaXNPYmplY3QpYFxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY29uc3RydWN0b3ItbmFtZVwiPiR7dGhpcy5vbnN0cnVjdG9yTmFtZX08L3NwYW4+XG5cbiAgICAgICAgICAgICAgJHtfaWYodGhpcy5pc0FycmF5KWBcbiAgICAgICAgICAgICAgICA8c3Bhbj48c3BhbiBjbGFzcz1cImJyYWNrZXRcIj5bPC9zcGFuPjxzcGFuIGNsYXNzPVwibnVtYmVyXCI+JHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuanNvbiAmJiB0aGlzLmpzb24ubGVuZ3RoXG4gICAgICAgICAgICAgICAgfTwvc3Bhbj48c3BhbiBjbGFzcz1cImJyYWNrZXRcIj5dPC9zcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgYH1cblxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIGB9XG5cbiAgICAgICAgICAke19pZighdGhpcy5pc09iamVjdClgXG5cbiAgICAgICAgICAgIDwke3RoaXMuaXNVcmwgPyAnYScgOiAnc3Bhbid9XG4gICAgICAgICAgICAgIGNsYXNzPVwiJHtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVcbiAgICAgICAgICAgICAgfSAke1xuICAgICAgICAgICAgICAgIF9pZih0aGlzLmlzRGF0ZSlgZGF0ZWBcbiAgICAgICAgICAgICAgfSAke1xuICAgICAgICAgICAgICAgIF9pZih0aGlzLmlzVXJsKWB1cmxgXG4gICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAke19pZih0aGlzLmlzVXJsKWBocmVmPVwiJHt0aGlzLmpzb259XCJgfVxuICAgICAgICAgICAgPiR7dGhpcy5nZXRWYWx1ZVByZXZpZXcodGhpcy5qc29uLCB0aGlzLmpzb24pfTwvJHtcbiAgICAgICAgICAgICAgdGhpcy5pc1VybCA/ICdhJyA6ICdzcGFuJ1xuICAgICAgICAgICAgfT5cblxuICAgICAgICAgIGB9XG5cbiAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICR7X2lmKHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0VuYWJsZWQgJiYgdGhpcy5pc09iamVjdClgXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcmV2aWV3LXRleHRcIj4ke3RoaXMuZ2V0SW5saW5lcHJldmlldygpfTwvc3Bhbj5cbiAgICAgICAgYH1cbiAgICAgIDwvYT5cblxuICAgICAgPGRpdiBjbGFzcz1cImNoaWxkcmVuICR7XG4gICAgICAgIF9pZih0aGlzLmlzT2JqZWN0KWBvYmplY3RgXG4gICAgICB9ICR7XG4gICAgICAgIF9pZih0aGlzLmlzQXJyYXkpYGFycmF5YFxuICAgICAgfSAke1xuICAgICAgICBfaWYodGhpcy5pc0VtcHR5KWBlbXB0eWBcbiAgICAgIH1cIj48L2Rpdj5cbiAgICBgO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlU3RyaW5nLnJlcGxhY2UoL1xccypcXG4vZywgJ1xcbicpOyAvLyBjbGVhbiB1cCBlbXB0eSBsaW5lc1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgYW4gSFRNTCBlbGVtZW50IGFuZCBpbnN0YWxscyBldmVudCBsaXN0ZW5lcnNcbiAgICpcbiAgICogQHJldHVybnMge0hUTUxEaXZFbGVtZW50fVxuICAqL1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgcmVzdWx0SFRNTCA9IHRoaXMudGVtcGxhdGUoKTtcblxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdqc29uLWZvcm1hdHRlci1yb3cnKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZyAmJiB0aGlzLmNvbmZpZy50aGVtZSkge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoYGpzb24tZm9ybWF0dGVyLSR7dGhpcy5jb25maWcudGhlbWV9YCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSByZXN1bHRIVE1MO1xuXG4gICAgaWYgKHRoaXMuaXNPYmplY3QgJiYgdGhpcy5pc09wZW4pIHtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGRlcm4oKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgZXZlbnQgbGlzdGVuZXIgZm9yIHRvZ2dsaW5nXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2EudG9nZ2xlci1saW5rJylcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMudG9nZ2xlT3Blbi5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhbGwgdGhlIGNoaWxkcmVuIHRvIGA8ZGl2IGNsYXNzPVwiY2hpbGRyZW5cIj48L2Rpdj5gIGVsZW1lbnRcbiAgICpcbiAgKi9cbiAgYXBwZW5kQ2hpbGRlcm4oKSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmNoaWxkcmVuJyk7XG5cbiAgICBpZiAoIWNoaWxkcmVuKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5rZXlzLmZvckVhY2goKGtleSk9PiB7XG4gICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSlNPTkZvcm1hdHRlcihcbiAgICAgICAgdGhpcy5qc29uW2tleV0sIHRoaXMub3BlbiAtIDEsIHRoaXMuY29uZmlnLCBrZXkpO1xuXG4gICAgICBjaGlsZHJlbi5hcHBlbmRDaGlsZChmb3JtYXR0ZXIucmVuZGVyKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIHRoZSBjaGlsZHJlbiBmcm9tIGA8ZGl2IGNsYXNzPVwiY2hpbGRyZW5cIj48L2Rpdj5gIGVsZW1lbnRcbiAgICpcbiAgKi9cbiAgcmVtb3ZlQ2hpbGRyZW4oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY2hpbGRyZW4nKSkge1xuICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5jaGlsZHJlbicpLmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgfVxufVxuXG4vLyBUT0RPOiBVTURcbndpbmRvdy5KU09ORm9ybWF0dGVyID0gSlNPTkZvcm1hdHRlcjtcbiJdfQ==
