'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashTemplate = require('lodash.template');

var _lodashTemplate2 = _interopRequireDefault(_lodashTemplate);

var _lodashIsobject = require('lodash.isobject');

var _lodashIsobject2 = _interopRequireDefault(_lodashIsobject);

var _helpersJs = require('./helpers.js');

var JSONFormatter = (function () {
  function JSONFormatter(json, key, open, config) {
    _classCallCheck(this, JSONFormatter);

    this.json = json;
    this.key = key;
    this.open = open;
    this.config = config;

    this.type = (0, _helpersJs.getType)(this.json);
    this.hasKey = typeof this.key !== 'undefined';

    // If 'open' attribute is present
    this.isOpen = !!this.open;

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
  }

  _createClass(JSONFormatter, [{
    key: 'isArray',
    value: function isArray() {
      return this.isArray(this.json);
    }
  }, {
    key: 'isObject',
    value: function isObject() {
      return (0, _lodashIsobject2['default'])(this.json);
    }
  }, {
    key: 'getKeys',
    value: function getKeys() {
      if (this.isObject()) {
        return Object.keys(this.json).map(function (key) {
          if (key === '') {
            return '""';
          }
          return key;
        });
      }
    }
  }, {
    key: 'getConstructorName',
    value: function getConstructorName() {
      return (0, _helpersJs.getObjectName)(this.json);
    }
  }, {
    key: 'isEmptyObject',
    value: function isEmptyObject() {
      return this.getKeys() && !this.getKeys().length && this.isOpen && !this.isArray();
    }
  }, {
    key: 'toggleOpen',
    value: function toggleOpen() {
      this.isOpen = !this.isOpen;
    }
  }, {
    key: 'childrenOpen',
    value: function childrenOpen() {
      if (this.open > 1) {
        return this.open - 1;
      }
      return 0;
    }
  }, {
    key: 'openLink',
    value: function openLink(isUrl) {
      if (isUrl) {
        window.location.href = this.json;
      }
    }
  }, {
    key: 'parseValue',
    value: function parseValue(value) {
      return (0, _helpersJs.getValuePreview)(this.json, value);
    }
  }, {
    key: 'showThumbnail',
    value: function showThumbnail() {
      return !!this.config.hoverPreviewEnabled && this.isObject() && !this.isOpen;
    }
  }, {
    key: 'getThumbnail',
    value: function getThumbnail() {
      if (this.isArray()) {

        // if array length is greater then 100 it shows "Array[101]"
        if (this.json.length > this.config.hoverPreviewArrayCount) {
          return 'Array[' + this.json.length + ']';
        } else {
          return '[' + this.json.map(_helpersJs.getPreview).join(', ') + ']';
        }
      } else {

        var keys = this.getKeys();

        // the first five keys (like Chrome Developer Tool)
        var narrowKeys = keys.slice(0, this.config.hoverPreviewFieldCount);

        // json value schematic information
        var kvs = narrowKeys.map(function (key) {
          return key + ':' + (0, _helpersJs.getPreview)(this.json[key]);
        });

        // if keys count greater then 5 then show ellipsis
        var ellipsis = keys.length >= 5 ? '…' : '';

        return '{' + kvs.join(', ') + ellipsis + '}';
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var html = '\n    <div class="json-formatter-row">\n      <a>\n        <% if (this.isObject()) { %>\n          <span class="toggler ' + (this.isOpen ? 'open' : '') + '"></span>\n        <% } %>\n\n        <% if (this.hasKey { %>\n          <span class="key">' + this.key + ':</span>\n        <% } %>\n\n        <span class="value">\n\n          <% if (this.isObject()) { %>\n            <span>\n              <span class="constructor-name">' + this.getConstructorName(this.json) + '</span>\n\n              <% if (this.isArray()) { %>\n               <span><span class="bracket">[</span><span class="number">' + this.json.length + '</span><span class="bracket">]</span></span>\n              <% } %>\n\n            </span>\n          <% } else if (!this.isObject()) {%>\n            <span class="{{type}}" class="' + (this.isDate ? 'date' : '') + ' ' + (this.isUrl ? 'url' : '') + '">{{this.parseValue(json)}}</span>\n          <% } %>\n\n        </span>\n\n        <% if (this.showThumbnail()) { %>\n          <span class="thumbnail-text">' + this.getThumbnail() + '</span>\n        <% } %>\n      </a>\n\n      <% if (this.getKeys().length && this.isOpen()) { %>\n        <div class="children"></div>\n      <% } %>\n\n      <% if (this.isEmptyObject()) { %>\n        <div class="children empty object"></div>\n      <% } %>\n\n      <% if (this.getKeys() && !this.getKeys().length && this.isOpen && this.isArray())) { %>\n        <div class="children empty array"></div>\n      <% } %>\n    </div>\n    ';

      return (0, _lodashTemplate2['default'])(html);
    }
  }]);

  return JSONFormatter;
})();

exports['default'] = JSONFormatter;
module.exports = exports['default'];