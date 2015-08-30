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

var _templateObject = _taggedTemplateLiteral([' open'], [' open']),
    _templateObject2 = _taggedTemplateLiteral(['\n            <span class="toggler"></span>\n          '], ['\n            <span class="toggler"></span>\n          ']),
    _templateObject3 = _taggedTemplateLiteral(['\n            <span class="key">', ':</span>\n          '], ['\n            <span class="key">', ':</span>\n          ']),
    _templateObject4 = _taggedTemplateLiteral(['\n              <span>\n                <span class="constructor-name">', '</span>\n\n                ', '\n\n              </span>\n            '], ['\n              <span>\n                <span class="constructor-name">', '</span>\n\n                ', '\n\n              </span>\n            ']),
    _templateObject5 = _taggedTemplateLiteral(['\n                  <span><span class="bracket">[</span><span class="number">', '</span><span class="bracket">]</span></span>\n                '], ['\n                  <span><span class="bracket">[</span><span class="number">', '</span><span class="bracket">]</span></span>\n                ']),
    _templateObject6 = _taggedTemplateLiteral(['\n\n              <', '\n                class="', ' ', ' ', '"\n                ', '\n              >', '</', '>\n\n            '], ['\n\n              <', '\n                class="', ' ', ' ', '"\n                ', '\n              >', '</', '>\n\n            ']),
    _templateObject7 = _taggedTemplateLiteral(['date'], ['date']),
    _templateObject8 = _taggedTemplateLiteral(['url'], ['url']),
    _templateObject9 = _taggedTemplateLiteral(['href="', '"'], ['href="', '"']),
    _templateObject10 = _taggedTemplateLiteral(['\n            <span class="preview-text">', '</span>\n          '], ['\n            <span class="preview-text">', '</span>\n          ']),
    _templateObject11 = _taggedTemplateLiteral(['object'], ['object']),
    _templateObject12 = _taggedTemplateLiteral(['array'], ['array']),
    _templateObject13 = _taggedTemplateLiteral(['empty'], ['empty']),
    _templateObject14 = _taggedTemplateLiteral(['\n            ', '\n          '], ['\n            ', '\n          ']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _helpersJs = require('./helpers.js');

function hasClass(element, className) {
  return element && element.getAttribute('class') && element.getAttribute('class').indexOf(className) !== -1;
}

function walk(json, path_) {
  var path = path_.slice(0);

  while (typeof json === 'object' && path.length) {
    json = json[path.shift()];
  }
  return json;
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
   * @param {string} [[path]=[]] - The path to reach to this object
  */

  function JSONFormatter(json, open, config, path) {
    _classCallCheck(this, JSONFormatter);

    this.json = json;
    this.path = path || [];
    this.open = open === undefined ? 1 : open;
    this.config = config || {};

    this.config.hoverPreviewEnabled = this.config.hoverPreviewEnabled === undefined ? false : this.config.hoverPreviewEnabled;

    this.config.hoverPreviewArrayCount = this.config.hoverPreviewArrayCount === undefined ? 100 : this.config.hoverPreviewArrayCount;

    this.config.hoverPreviewFieldCount = this.config.hoverPreviewFieldCount === undefined ? 5 : this.config.hoverPreviewFieldCount;

    this.type = (0, _helpersJs.getType)(this.json);
    this.hasKey = this.path.length;
    this.key = this.hasKey && this.path[this.path.length - 1];

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

      var templateString = '\n      <div class="json-formatter-row' + _if(this.isOpen)(_templateObject) + '" data-path=\'' + JSON.stringify(this.path) + '\'>\n        <a class="toggler-link">\n          ' + _if(this.isObject)(_templateObject2) + '\n\n          ' + _if(this.hasKey)(_templateObject3, this.key) + '\n\n          <span class="value">\n\n            ' + _if(this.isObject)(_templateObject4, this.onstructorName, _if(this.isArray)(_templateObject5, this.json && this.json.length)) + '\n\n            ' + _if(!this.isObject)(_templateObject6, this.isUrl ? 'a' : 'span', this.type, _if(this.isDate)(_templateObject7), _if(this.isUrl)(_templateObject8), _if(this.isUrl)(_templateObject9, this.json), this.getValuePreview(this.json, this.json), this.isUrl ? 'a' : 'span') + '\n\n          </span>\n\n          ' + _if(this.config.hoverPreviewEnabled && this.isObject)(_templateObject10, this.getInlinepreview()) + '\n        </a>\n\n        <div class="children ' + _if(this.isObject)(_templateObject11) + ' ' + _if(this.isArray)(_templateObject12) + ' ' + _if(this.isEmpty)(_templateObject13) + '">\n          ' + _if(this.isOpen)(_templateObject14, this.keys.map(this.childTemplate.bind(this)).join('')) + '\n        </div>\n      </div>\n    ';

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
      var newPath = this.path.slice(0);newPath.push(key);
      var json = walk(this.json, newPath);
      var open = this.open - 1;
      var formatter = new JSONFormatter(json, open, this.config, newPath);

      return formatter.template();
    }

    /**
     * Renders an HTML element and installs event listeners
     *
     * @returns {HTMLDivElement}
    */
  }, {
    key: 'render',
    value: function render() {
      var element = document.createElement('div');

      element.innerHTML = this.template();

      // add event listener for toggling
      element.children[0].addEventListener('click', this.toggleOpen.bind(this));

      return element.children[0];
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

      var path = null;
      var isOpen = hasClass(target, 'open');

      if (target.dataset.path) {
        try {
          path = JSON.parse(target.dataset.path);
        } catch (e) {}
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
     * @param {object} json
    */
  }, {
    key: 'appendChildern',
    value: function appendChildern(element, json) {
      var _this2 = this;

      var children = element.querySelector('div.children');

      if (!children) {
        return;
      }

      if (typeof json === 'object') {
        Object.keys(json).forEach(function (key) {
          var json = json[key];
          var open = _this2.open - 1;
          var formatter = new JSONFormatter(json, open, _this2.config, key);

          children.appendChild(formatter.render());
        });
      }
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9oc2VuL1Byb2plY3RzL2pzb24tZm9ybWF0dGVyLWpzL3NyYy9oZWxwZXJzLmpzIiwiL1VzZXJzL21vaHNlbi9Qcm9qZWN0cy9qc29uLWZvcm1hdHRlci1qcy9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRYixTQUFTLFlBQVksQ0FBQyxHQUFHLEVBQUU7QUFDekIsU0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztDQUMvQjs7Ozs7Ozs7Ozs7QUFVTSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDOUIsTUFBSSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUM7QUFDeEIsU0FBTyxDQUFDLENBQUMsS0FBSyxJQUFLLElBQUksSUFBSSxRQUFRLEFBQUMsQ0FBQztDQUN0Qzs7Ozs7Ozs7Ozs7O0FBV00sU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFO0FBQ3BDLE1BQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUN4QixXQUFPLEVBQUUsQ0FBQztHQUNYO0FBQ0QsTUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ25CLFdBQU8sUUFBUSxDQUFDO0dBQ2pCO0FBQ0QsTUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ25ELFdBQU8sUUFBUSxDQUFDO0dBQ25COztBQUVELE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDO0FBQzNDLE1BQU0sT0FBTyxHQUFHLEFBQUMsYUFBYSxDQUFFLElBQUksQ0FBQyxBQUFDLE1BQU0sQ0FBRSxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN0RSxNQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENB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LGNBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QixjQUFNLElBQUksR0FBRyxPQUFLLElBQUksR0FBRyxDQUFDLENBQUM7QUFDM0IsY0FBTSxTQUFTLEdBQUcsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFLLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbEUsa0JBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDMUMsQ0FBQyxDQUFDO09BQ0o7S0FDRjs7Ozs7Ozs7O1dBT2Esd0JBQUMsT0FBTyxFQUFFO0FBQ3RCLFVBQUksT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUN6QyxlQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7T0FDdEQ7S0FDRjs7O1NBclRrQixhQUFhOzs7cUJBQWIsYUFBYTtBQXlUbEMsTUFBTSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICogRXNjYXBlcyBgXCJgIGNoYXJhY2h0ZXJzIGZyb20gc3RyaW5nXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiBlc2NhcGVTdHJpbmcoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgnXCInLCAnXFxcIicpO1xufVxuXG4vKlxuICogRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICpcbiovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnKTtcbn1cblxuLypcbiAqIEdldHMgY29uc3RydWN0b3IgbmFtZSBvZiBhbiBvYmplY3QuXG4gKiBGcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMzMjQyOVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICpcbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T2JqZWN0TmFtZShvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmIChvYmplY3QgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ09iamVjdCc7XG4gIH1cbiAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFvYmplY3QuY29uc3RydWN0b3IpIHtcbiAgICAgIHJldHVybiAnT2JqZWN0JztcbiAgfVxuXG4gIGNvbnN0IGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC87XG4gIGNvbnN0IHJlc3VsdHMgPSAoZnVuY05hbWVSZWdleCkuZXhlYygob2JqZWN0KS5jb25zdHJ1Y3Rvci50b1N0cmluZygpKTtcbiAgaWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHJlc3VsdHNbMV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbi8qXG4gKiBHZXRzIHR5cGUgb2YgYW4gb2JqZWN0LiBSZXR1cm5zIFwibnVsbFwiIGZvciBudWxsIG9iamVjdHNcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZShvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PT0gbnVsbCkgeyByZXR1cm4gJ251bGwnOyB9XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0O1xufVxuXG4vKlxuICogR2VuZXJhdGVzIGlubGluZSBwcmV2aWV3IGZvciBhIEphdmFTY3JpcHQgb2JqZWN0IGJhc2VkIG9uIGEgdmFsdWVcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlUHJldmlldyAob2JqZWN0LCB2YWx1ZSkge1xuICB2YXIgdHlwZSA9IGdldFR5cGUob2JqZWN0KTtcblxuICBpZiAodHlwZSA9PT0gJ251bGwnIHx8IHR5cGUgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybiB0eXBlOyB9XG5cbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSAnXCInICsgZXNjYXBlU3RyaW5nKHZhbHVlKSArICdcIic7XG4gIH1cbiAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpe1xuXG4gICAgLy8gUmVtb3ZlIGNvbnRlbnQgb2YgdGhlIGZ1bmN0aW9uXG4gICAgcmV0dXJuIG9iamVjdC50b1N0cmluZygpXG4gICAgICAgIC5yZXBsYWNlKC9bXFxyXFxuXS9nLCAnJylcbiAgICAgICAgLnJlcGxhY2UoL1xcey4qXFx9LywgJycpICsgJ3vigKZ9JztcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qXG4gKiBHZW5lcmF0ZXMgaW5saW5lIHByZXZpZXcgZm9yIGEgSmF2YVNjcmlwdCBvYmplY3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcmV2aWV3KG9iamVjdCkge1xuICBsZXQgdmFsdWUgPSAnJztcbiAgaWYgKGlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICB2YWx1ZSA9IGdldE9iamVjdE5hbWUob2JqZWN0KTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKVxuICAgICAgdmFsdWUgKz0gJ1snICsgb2JqZWN0Lmxlbmd0aCArICddJztcbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGdldFZhbHVlUHJldmlldyhvYmplY3QsIG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufSIsIid1c2Ugc3RyaWN0JztcblxuLyogZ2xvYmFscyBKU09ORm9ybWF0dGVyICovXG5cbmltcG9ydCB7XG4gIGlzT2JqZWN0LFxuICBnZXRPYmplY3ROYW1lLFxuICBnZXRUeXBlLFxuICBnZXRWYWx1ZVByZXZpZXcsXG4gIGdldFByZXZpZXdcbn0gZnJvbSAnLi9oZWxwZXJzLmpzJztcblxuZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIHJldHVybiBlbGVtZW50ICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpICYmXG4gICAgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpLmluZGV4T2YoY2xhc3NOYW1lKSAhPT0gLTEpXG59XG5cbmZ1bmN0aW9uIHdhbGsoanNvbiwgcGF0aF8pIHtcbiAgY29uc3QgcGF0aCA9IHBhdGhfLnNsaWNlKDApO1xuXG4gIHdoaWxlICgodHlwZW9mIGpzb24gPT09ICdvYmplY3QnKSAmJiBwYXRoLmxlbmd0aCkge1xuICAgIGpzb24gPSBqc29uW3BhdGguc2hpZnQoKV07XG4gIH1cbiAgcmV0dXJuIGpzb247XG59XG5cbi8qKlxuICogQGNsYXNzIEpTT05Gb3JtYXR0ZXJcbiAqXG4gKiBKU09ORm9ybWF0dGVyIGFsbG93cyB5b3UgdG8gcmVuZGVyIEpTT04gb2JqZWN0cyBpbiBIVE1MIHdpdGggYVxuICogKipjb2xsYXBzaWJsZSoqIG5hdmlnYXRpb24uXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSlNPTkZvcm1hdHRlciB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uIFRoZSBKU09OIG9iamVjdCB5b3Ugd2FudCB0byByZW5kZXIuIEl0IGhhcyB0byBiZSBhblxuICAgKiBvYmplY3Qgb3IgYXJyYXkuIERvIE5PVCBwYXNzIHJhdyBKU09OIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtvcGVuPTFdIGhpcyBudW1iZXIgaW5kaWNhdGVzIHVwIHRvIGhvdyBtYW55IGxldmVscyB0aGVcbiAgICogcmVuZGVyZWQgdHJlZSBzaG91bGQgZXhwYW5kLiBTZXQgaXQgdG8gYDBgIHRvIG1ha2UgdGhlIHdob2xlIHRyZWUgY29sbGFwc2VkXG4gICAqIG9yIHNldCBpdCB0byBgSW5maW5pdHlgIHRvIGV4cGFuZCB0aGUgdHJlZSBkZWVwbHlcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IFtjb25maWc9ZGVmYXVsdENvbmZpZ10gLVxuICAgKiAgZGVmYXVsdENvbmZpZyA9IHtcbiAgICogICBob3ZlclByZXZpZXdFbmFibGVkOiBmYWxzZSxcbiAgICogICBob3ZlclByZXZpZXdBcnJheUNvdW50OiAxMDAsXG4gICAqICAgaG92ZXJQcmV2aWV3RmllbGRDb3VudDogNVxuICAgKiB9XG4gICAqXG4gICAqIEF2YWlsYWJsZSBjb25maWd1cmF0aW9uczpcbiAgICogICMjIyMjSG92ZXIgUHJldmlld1xuICAgKiAqIGBob3ZlclByZXZpZXdFbmFibGVkYDogIGVuYWJsZSBwcmV2aWV3IG9uIGhvdmVyXG4gICAqICogYGhvdmVyUHJldmlld0FycmF5Q291bnRgOiBudW1iZXIgb2YgYXJyYXkgaXRlbXMgdG8gc2hvdyBpbiBwcmV2aWV3IEFueVxuICAgKiAgICBhcnJheSBsYXJnZXIgdGhhbiB0aGlzIG51bWJlciB3aWxsIGJlIHNob3duIGFzIGBBcnJheVtYWFhdYCB3aGVyZSBgWFhYYFxuICAgKiAgICBpcyBsZW5ndGggb2YgdGhlIGFycmF5LlxuICAgKiAqIGBob3ZlclByZXZpZXdGaWVsZENvdW50YDogbnVtYmVyIG9mIG9iamVjdCBwcm9wZXJ0aWVzIHRvIHNob3cgZm9yIG9iamVjdFxuICAgKiAgIHByZXZpZXcuIEFueSBvYmplY3Qgd2l0aCBtb3JlIHByb3BlcnRpZXMgdGhhdCB0aGluIG51bWJlciB3aWxsIGJlXG4gICAqICAgdHJ1bmNhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW1twYXRoXT1bXV0gLSBUaGUgcGF0aCB0byByZWFjaCB0byB0aGlzIG9iamVjdFxuICAqL1xuICBjb25zdHJ1Y3Rvcihqc29uLCBvcGVuLCBjb25maWcsIHBhdGgpIHtcbiAgICB0aGlzLmpzb24gPSBqc29uO1xuICAgIHRoaXMucGF0aCA9IHBhdGggfHwgW107XG4gICAgdGhpcy5vcGVuID0gb3BlbiA9PT0gdW5kZWZpbmVkID8gMSA6IG9wZW47XG4gICAgdGhpcy5jb25maWcgPSBjb25maWcgfHwge307XG5cbiAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdFbmFibGVkID1cbiAgICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0VuYWJsZWQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDpcbiAgICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0VuYWJsZWQ7XG5cbiAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdBcnJheUNvdW50ID1cbiAgICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0FycmF5Q291bnQgPT09IHVuZGVmaW5lZCA/IDEwMCA6XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdBcnJheUNvdW50O1xuXG4gICAgdGhpcy5jb25maWcuaG92ZXJQcmV2aWV3RmllbGRDb3VudCA9XG4gICAgICB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdGaWVsZENvdW50ID09PSB1bmRlZmluZWQgPyA1IDpcbiAgICAgIHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0ZpZWxkQ291bnQ7XG5cbiAgICB0aGlzLnR5cGUgPSBnZXRUeXBlKHRoaXMuanNvbik7XG4gICAgdGhpcy5oYXNLZXkgPSB0aGlzLnBhdGgubGVuZ3RoO1xuICAgIHRoaXMua2V5ID0gdGhpcy5oYXNLZXkgJiYgdGhpcy5wYXRoW3RoaXMucGF0aC5sZW5ndGggLSAxXVxuXG4gICAgLy8gSWYgJ29wZW4nIGF0dHJpYnV0ZSBpcyBwcmVzZW50XG4gICAgdGhpcy5pc09wZW4gPSB0aGlzLm9wZW4gPiAwO1xuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3N0cmluZycpe1xuXG4gICAgICAvLyBBZGQgY3VzdG9tIHR5cGUgZm9yIGRhdGVcbiAgICAgIGlmKChuZXcgRGF0ZSh0aGlzLmpzb24pKS50b1N0cmluZygpICE9PSAnSW52YWxpZCBEYXRlJykge1xuICAgICAgICB0aGlzLmlzRGF0ZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBjdXN0b20gdHlwZSBmb3IgVVJMc1xuICAgICAgaWYgKHRoaXMuanNvbi5pbmRleE9mKCdodHRwJykgPT09IDApIHtcbiAgICAgICAgdGhpcy5pc1VybCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pc0FycmF5ID0gQXJyYXkuaXNBcnJheSh0aGlzLmpzb24pO1xuICAgIHRoaXMuaXNPYmplY3QgPSBpc09iamVjdCh0aGlzLmpzb24pO1xuXG4gICAgdGhpcy5rZXlzID0gW107XG4gICAgaWYgKHRoaXMuaXNPYmplY3QpIHtcbiAgICAgIHRoaXMua2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuanNvbikubWFwKChrZXkpPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSAnJykgeyByZXR1cm4gJ1wiXCInOyB9XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmlzRW1wdHlPYmplY3QgPSAhdGhpcy5rZXlzLmxlbmd0aCAmJiB0aGlzLmlzT3BlbiAmJiAhdGhpcy5pc0FycmF5O1xuICAgIHRoaXMub25zdHJ1Y3Rvck5hbWUgPSBnZXRPYmplY3ROYW1lKHRoaXMuanNvbik7XG4gICAgdGhpcy5pc0VtcHR5ID0gdGhpcy5pc0VtcHR5T2JqZWN0IHx8ICh0aGlzLmtleXMgJiZcbiAgICAgICF0aGlzLmtleXMubGVuZ3RoICYmXG4gICAgICB0aGlzLmlzQXJyYXkpO1xuXG4gICAgdGhpcy5nZXRWYWx1ZVByZXZpZXcgPSBnZXRWYWx1ZVByZXZpZXc7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGlubGluZSBwcmV2aWV3XG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIGdldElubGluZXByZXZpZXcoKSB7XG4gICAgaWYgKHRoaXMuaXNBcnJheSkge1xuXG4gICAgICAvLyBpZiBhcnJheSBsZW5ndGggaXMgZ3JlYXRlciB0aGVuIDEwMCBpdCBzaG93cyBcIkFycmF5WzEwMV1cIlxuICAgICAgaWYgKHRoaXMuanNvbi5sZW5ndGggPiB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdBcnJheUNvdW50KSB7XG4gICAgICAgIHJldHVybiBgQXJyYXlbJHt0aGlzLmpzb24ubGVuZ3RofV1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGBbJHt0aGlzLmpzb24ubWFwKGdldFByZXZpZXcpLmpvaW4oJywgJyl9XWA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcblxuICAgICAgY29uc3Qga2V5cyA9IHRoaXMua2V5cztcblxuICAgICAgLy8gdGhlIGZpcnN0IGZpdmUga2V5cyAobGlrZSBDaHJvbWUgRGV2ZWxvcGVyIFRvb2wpXG4gICAgICBjb25zdCBuYXJyb3dLZXlzID0ga2V5cy5zbGljZSgwLCB0aGlzLmNvbmZpZy5ob3ZlclByZXZpZXdGaWVsZENvdW50KTtcblxuICAgICAgLy8ganNvbiB2YWx1ZSBzY2hlbWF0aWMgaW5mb3JtYXRpb25cbiAgICAgIGNvbnN0IGt2cyA9IG5hcnJvd0tleXMubWFwKGtleSA9PiBgJHtrZXl9OiR7Z2V0UHJldmlldyh0aGlzLmpzb25ba2V5XSl9YCk7XG5cbiAgICAgIC8vIGlmIGtleXMgY291bnQgZ3JlYXRlciB0aGVuIDUgdGhlbiBzaG93IGVsbGlwc2lzXG4gICAgICBjb25zdCBlbGxpcHNpcyA9IGtleXMubGVuZ3RoID49IDUgPyAn4oCmJyA6ICcnO1xuXG4gICAgICByZXR1cm4gYHske2t2cy5qb2luKCcsICcpfSR7ZWxsaXBzaXN9fWA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBIVE1MIHN0cmluZyAgZm9yIHRoaXMgSlNPTiBiYXNlZCBvbiB0aGUgdGVtcGxhdGVcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdGVtcGxhdGUoKSB7XG5cbiAgICAvKlxuICAgICAqIGlmIGNvbmRpdGlvbiBmb3IgRVM2IHRlbXBsYXRlIHN0cmluZ3NcbiAgICAgKiB0byBiZSB1c2VkIG9ubHkgaW4gdGVtcGxhdGUgc3RyaW5nXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZSBteXN0ciA9IGBSYW5kb20gaXMgJHtfaWYoTWF0aC5yYW5kb20oKSA+IDAuNSlgZ3JlYXRlciB0aGFuIDAuNWBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9ufSB0aGUgdGVtcGxhdGUgZnVuY3Rpb25cbiAgICAqL1xuICAgIGZ1bmN0aW9uIF9pZihjb25kaXRpb24pIHtcbiAgICAgIHJldHVybiBjb25kaXRpb24gPyBub3JtYWwgOiBlbXB0eTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW1wdHkoKXtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgZnVuY3Rpb24gbm9ybWFsICh0ZW1wbGF0ZSwgLi4uZXhwcmVzc2lvbnMpIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5zbGljZSgxKS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBwYXJ0LCBpKSA9PiB7XG4gICAgICAgIHJldHVybiBhY2N1bXVsYXRvciArIGV4cHJlc3Npb25zW2ldICsgcGFydDtcbiAgICAgIH0sIHRlbXBsYXRlWzBdKTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wbGF0ZVN0cmluZyA9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJqc29uLWZvcm1hdHRlci1yb3cke19pZih0aGlzLmlzT3BlbilgIG9wZW5gfVwiIGRhdGEtcGF0aD0nJHtcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLnBhdGgpXG4gICAgICAgIH0nPlxuICAgICAgICA8YSBjbGFzcz1cInRvZ2dsZXItbGlua1wiPlxuICAgICAgICAgICR7X2lmKHRoaXMuaXNPYmplY3QpYFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0b2dnbGVyXCI+PC9zcGFuPlxuICAgICAgICAgIGB9XG5cbiAgICAgICAgICAke19pZih0aGlzLmhhc0tleSlgXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImtleVwiPiR7dGhpcy5rZXl9Ojwvc3Bhbj5cbiAgICAgICAgICBgfVxuXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJ2YWx1ZVwiPlxuXG4gICAgICAgICAgICAke19pZih0aGlzLmlzT2JqZWN0KWBcbiAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjb25zdHJ1Y3Rvci1uYW1lXCI+JHt0aGlzLm9uc3RydWN0b3JOYW1lfTwvc3Bhbj5cblxuICAgICAgICAgICAgICAgICR7X2lmKHRoaXMuaXNBcnJheSlgXG4gICAgICAgICAgICAgICAgICA8c3Bhbj48c3BhbiBjbGFzcz1cImJyYWNrZXRcIj5bPC9zcGFuPjxzcGFuIGNsYXNzPVwibnVtYmVyXCI+JHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qc29uICYmIHRoaXMuanNvbi5sZW5ndGhcbiAgICAgICAgICAgICAgICAgIH08L3NwYW4+PHNwYW4gY2xhc3M9XCJicmFja2V0XCI+XTwvc3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgICAgYH1cblxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICBgfVxuXG4gICAgICAgICAgICAke19pZighdGhpcy5pc09iamVjdClgXG5cbiAgICAgICAgICAgICAgPCR7dGhpcy5pc1VybCA/ICdhJyA6ICdzcGFuJ31cbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7XG4gICAgICAgICAgICAgICAgICB0aGlzLnR5cGVcbiAgICAgICAgICAgICAgICB9ICR7XG4gICAgICAgICAgICAgICAgICBfaWYodGhpcy5pc0RhdGUpYGRhdGVgXG4gICAgICAgICAgICAgICAgfSAke1xuICAgICAgICAgICAgICAgICAgX2lmKHRoaXMuaXNVcmwpYHVybGBcbiAgICAgICAgICAgICAgICB9XCJcbiAgICAgICAgICAgICAgICAke19pZih0aGlzLmlzVXJsKWBocmVmPVwiJHt0aGlzLmpzb259XCJgfVxuICAgICAgICAgICAgICA+JHt0aGlzLmdldFZhbHVlUHJldmlldyh0aGlzLmpzb24sIHRoaXMuanNvbil9PC8ke1xuICAgICAgICAgICAgICAgIHRoaXMuaXNVcmwgPyAnYScgOiAnc3BhbidcbiAgICAgICAgICAgICAgfT5cblxuICAgICAgICAgICAgYH1cblxuICAgICAgICAgIDwvc3Bhbj5cblxuICAgICAgICAgICR7X2lmKHRoaXMuY29uZmlnLmhvdmVyUHJldmlld0VuYWJsZWQgJiYgdGhpcy5pc09iamVjdClgXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByZXZpZXctdGV4dFwiPiR7dGhpcy5nZXRJbmxpbmVwcmV2aWV3KCl9PC9zcGFuPlxuICAgICAgICAgIGB9XG4gICAgICAgIDwvYT5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hpbGRyZW4gJHtcbiAgICAgICAgICBfaWYodGhpcy5pc09iamVjdClgb2JqZWN0YFxuICAgICAgICB9ICR7XG4gICAgICAgICAgX2lmKHRoaXMuaXNBcnJheSlgYXJyYXlgXG4gICAgICAgIH0gJHtcbiAgICAgICAgICBfaWYodGhpcy5pc0VtcHR5KWBlbXB0eWBcbiAgICAgICAgfVwiPlxuICAgICAgICAgICR7X2lmKHRoaXMuaXNPcGVuKWBcbiAgICAgICAgICAgICR7dGhpcy5rZXlzLm1hcCh0aGlzLmNoaWxkVGVtcGxhdGUuYmluZCh0aGlzKSkuam9pbignJyl9XG4gICAgICAgICAgYH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlU3RyaW5nLnJlcGxhY2UoL1xccypcXG4vZywgJ1xcbicpOyAvLyBjbGVhbiB1cCBlbXB0eSBsaW5lc1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBIVE1MIHN0cmluZyBmb3IgZWFjaCBjaGlsZCBvZiB0aGlzIEpTT04gYmFzZWQgb24gdGhlIHRlbXBsYXRlXG4gICAqIGFuZCB0aGUgcHJvdmlkZWQga2V5XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSB0aGUga2V5IHRvIHNlbGVjdCB0aGUgY2hpbGRcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgY2hpbGRUZW1wbGF0ZShrZXkpIHtcbiAgICBjb25zdCBuZXdQYXRoID0gdGhpcy5wYXRoLnNsaWNlKDApOyBuZXdQYXRoLnB1c2goa2V5KTtcbiAgICBjb25zdCBqc29uID0gd2Fsayh0aGlzLmpzb24sIG5ld1BhdGgpO1xuICAgIGNvbnN0IG9wZW4gPSB0aGlzLm9wZW4gLSAxO1xuICAgIGNvbnN0IGZvcm1hdHRlciA9IG5ldyBKU09ORm9ybWF0dGVyKGpzb24sIG9wZW4sIHRoaXMuY29uZmlnLCBuZXdQYXRoKTtcblxuICAgIHJldHVybiBmb3JtYXR0ZXIudGVtcGxhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIGFuIEhUTUwgZWxlbWVudCBhbmQgaW5zdGFsbHMgZXZlbnQgbGlzdGVuZXJzXG4gICAqXG4gICAqIEByZXR1cm5zIHtIVE1MRGl2RWxlbWVudH1cbiAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZSgpO1xuXG4gICAgLy8gYWRkIGV2ZW50IGxpc3RlbmVyIGZvciB0b2dnbGluZ1xuICAgIGVsZW1lbnQuY2hpbGRyZW5bMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnRvZ2dsZU9wZW4uYmluZCh0aGlzKSk7XG5cbiAgICByZXR1cm4gZWxlbWVudC5jaGlsZHJlblswXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIGBpc09wZW5gIHN0YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NRXZlbnR9IGV2ZW50XG4gICovXG4gIHRvZ2dsZU9wZW4oZXZlbnQpIHtcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgd2hpbGUgKCFoYXNDbGFzcyh0YXJnZXQsICdqc29uLWZvcm1hdHRlci1yb3cnKSAmJiB0YXJnZXQucGFyZW50RWxlbWVudCkge1xuICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgbGV0IHBhdGggPSBudWxsO1xuICAgIGNvbnN0IGlzT3BlbiA9IGhhc0NsYXNzKHRhcmdldCwgJ29wZW4nKTtcblxuICAgIGlmICh0YXJnZXQuZGF0YXNldC5wYXRoKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwYXRoID0gSlNPTi5wYXJzZSh0YXJnZXQuZGF0YXNldC5wYXRoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuXG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbih0YXJnZXQpO1xuICAgIH0gZWxzZXtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGRlcm4odGFyZ2V0LCBrZXkpO1xuICAgIH1cblxuICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhbGwgdGhlIGNoaWxkcmVuIHRvIGA8ZGl2IGNsYXNzPVwiY2hpbGRyZW5cIj48L2Rpdj5gIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb25cbiAgKi9cbiAgYXBwZW5kQ2hpbGRlcm4oZWxlbWVudCwganNvbikge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY2hpbGRyZW4nKTtcblxuICAgIGlmICghY2hpbGRyZW4pIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAodHlwZW9mIGpzb24gPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhqc29uKS5mb3JFYWNoKChrZXkpPT4ge1xuICAgICAgICBjb25zdCBqc29uID0ganNvbltrZXldO1xuICAgICAgICBjb25zdCBvcGVuID0gdGhpcy5vcGVuIC0gMTtcbiAgICAgICAgY29uc3QgZm9ybWF0dGVyID0gbmV3IEpTT05Gb3JtYXR0ZXIoanNvbiwgb3BlbiwgdGhpcy5jb25maWcsIGtleSk7XG5cbiAgICAgICAgY2hpbGRyZW4uYXBwZW5kQ2hpbGQoZm9ybWF0dGVyLnJlbmRlcigpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCB0aGUgY2hpbGRyZW4gZnJvbSBgPGRpdiBjbGFzcz1cImNoaWxkcmVuXCI+PC9kaXY+YCBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgKi9cbiAgcmVtb3ZlQ2hpbGRyZW4oZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5jaGlsZHJlbicpKSB7XG4gICAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5jaGlsZHJlbicpLmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgfVxufVxuXG4vLyBUT0RPOiBVTURcbndpbmRvdy5KU09ORm9ybWF0dGVyID0gSlNPTkZvcm1hdHRlcjtcbiJdfQ==
