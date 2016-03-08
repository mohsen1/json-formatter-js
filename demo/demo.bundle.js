/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var JSONFormatter = __webpack_require__(1);

	var complex = {
	  numbers: [1, 2, 3],
	  boolean: true,
	  'null': null,
	  number: 123,
	  anObject: {
	    a: 'b',
	    c: 'd',
	    e: 'f\"'
	  },
	  string: 'Hello World',
	  url: 'https://github.com/mohsen1/json-formatter',
	  date: 'Sun Aug 03 2014 20:46:55 GMT-0700 (PDT)',
	  func: function add(a,b){return a + b; }
	};

	var deep = {a:{b:{c:{d:{}}}}};

	var examples = [
	  {title: 'Complex', json: complex},
	  {title: 'Number', json: 42},
	  {title: 'null', json: null},
	  {title: 'Empty Object', json: Object.create(null)},
	  {title: 'Empty Array', json: []},
	  {title: 'Deep', json: deep},
	  {title: 'Dark', json: complex, config: {theme: 'dark'}}
	];

	var result = document.querySelector('.result');

	examples.forEach(function(example) {
	  var title = document.createElement('h3');
	  var formatter = new JSONFormatter(example.json, 1, example.config);

	  title.innerText = example.title;

	  result.appendChild(title)
	  var el = formatter.render();

	  if (example.config && example.config.theme === 'dark') {
	    el.style.backgroundColor = '#1E1E1E';
	  }

	  result.appendChild(el);
	});

	fetch('giant.json').then(function(resp) {
	  resp.json().then(function(giant) {
	    var giantFormatter = new JSONFormatter(giant, 2, {hoverPreviewEnabled: true});
	    var title = document.createElement('h3');

	    title.innerText = 'Giant JSON';
	    result.appendChild(title);

	    console.time('Rendering giant JSON');
	    result.appendChild(giantFormatter.render());
	    console.timeEnd('Rendering giant JSON');
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		var helpers_ts_1 = __webpack_require__(1);
		__webpack_require__(2);
		var DATE_STRING_REGEX = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
		exports.defaultConfig = {
		    hoverPreviewArrayCount: 100,
		    hoverPreviewEnabled: false,
		    hoverPreviewFieldCount: 5,
		    theme: ''
		};
		var JSONFormatter = (function () {
		    function JSONFormatter(json, open, config, key) {
		        if (config === void 0) { config = exports.defaultConfig; }
		        this.json = json;
		        this.key = key;
		        this.open = open === undefined ? 1 : open;
		        this.config = config;
		        this.config.hoverPreviewEnabled = this.config.hoverPreviewEnabled === undefined ?
		            exports.defaultConfig.hoverPreviewEnabled : this.config.hoverPreviewEnabled;
		        this.config.hoverPreviewArrayCount = this.config.hoverPreviewArrayCount === undefined ?
		            exports.defaultConfig.hoverPreviewArrayCount : this.config.hoverPreviewArrayCount;
		        this.config.hoverPreviewFieldCount = this.config.hoverPreviewFieldCount === undefined ?
		            exports.defaultConfig.hoverPreviewFieldCount : this.config.hoverPreviewFieldCount;
		        this.type = helpers_ts_1.getType(this.json);
		        this.hasKey = typeof this.key !== 'undefined';
		        this.isOpen = this.open > 0;
		        if (this.type === 'string') {
		            if (DATE_STRING_REGEX.test(json)) {
		                this.isDate = true;
		            }
		            if (this.json.indexOf('http') === 0) {
		                this.isUrl = true;
		            }
		        }
		        this.isArray = Array.isArray(this.json);
		        this.isObject = helpers_ts_1.isObject(this.json);
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
		        this.constructorName = helpers_ts_1.getObjectName(this.json);
		        this.isEmpty = this.isEmptyObject || (this.keys &&
		            !this.keys.length &&
		            this.isArray);
		    }
		    JSONFormatter.prototype.toggleOpen = function () {
		        this.isOpen = !this.isOpen;
		        if (this.isOpen) {
		            this.appendChildern();
		        }
		        else {
		            this.removeChildren();
		        }
		        if (this.element) {
		            this.element.classList.toggle('open');
		        }
		    };
		    JSONFormatter.prototype.getInlinepreview = function () {
		        var _this = this;
		        if (this.isArray) {
		            if (this.json.length > this.config.hoverPreviewArrayCount) {
		                return "Array[" + this.json.length + "]";
		            }
		            else {
		                return "[" + this.json.map(helpers_ts_1.getPreview).join(', ') + "]";
		            }
		        }
		        else {
		            var keys = this.keys;
		            var narrowKeys = keys.slice(0, this.config.hoverPreviewFieldCount);
		            var kvs = narrowKeys.map(function (key) { return (key + ":" + helpers_ts_1.getPreview(_this.json[key])); });
		            var ellipsis = keys.length >= 5 ? '…' : '';
		            return "{" + kvs.join(', ') + ellipsis + "}";
		        }
		    };
		    JSONFormatter.prototype.template = function () {
		        function _if(condition) {
		            return condition ? normal : empty;
		        }
		        function empty(template) {
		            var expressions = [];
		            for (var _i = 1; _i < arguments.length; _i++) {
		                expressions[_i - 1] = arguments[_i];
		            }
		            return '';
		        }
		        function normal(template) {
		            var expressions = [];
		            for (var _i = 1; _i < arguments.length; _i++) {
		                expressions[_i - 1] = arguments[_i];
		            }
		            return template.slice(1).reduce(function (accumulator, part, i) {
		                return accumulator + expressions[i] + part;
		            }, template[0]);
		        }
		        var templateString = "\n      <a class=\"toggler-link\">\n        " + (_a = ["\n          <span class=\"toggler\"></span>\n        "], _a.raw = ["\n          <span class=\"toggler\"></span>\n        "], _if(this.isObject)(_a)) + "\n\n        " + (_b = ["\n          <span class=\"key\">", ":</span>\n        "], _b.raw = ["\n          <span class=\"key\">", ":</span>\n        "], _if(this.hasKey)(_b, this.key)) + "\n\n        <span class=\"value\">\n\n          " + (_c = ["\n            <span>\n              <span class=\"constructor-name\">", "</span>\n\n              ", "\n\n            </span>\n          "], _c.raw = ["\n            <span>\n              <span class=\"constructor-name\">", "</span>\n\n              ", "\n\n            </span>\n          "], _if(this.isObject)(_c, this.constructorName, (_d = ["\n                <span><span class=\"bracket\">[</span><span class=\"number\">", "</span><span class=\"bracket\">]</span></span>\n              "], _d.raw = ["\n                <span><span class=\"bracket\">[</span><span class=\"number\">", "</span><span class=\"bracket\">]</span></span>\n              "], _if(this.isArray)(_d, this.json && this.json.length)))) + "\n\n          " + (_e = ["\n\n            <", "\n              class=\"", " ", " ", "\"\n              ", "\n            >", "</", ">\n\n          "], _e.raw = ["\n\n            <", "\n              class=\"", " ", " ", "\"\n              ", "\n            >", "</", ">\n\n          "], _if(!this.isObject)(_e, this.isUrl ? 'a' : 'span', this.type, (_f = ["date"], _f.raw = ["date"], _if(this.isDate)(_f)), (_g = ["url"], _g.raw = ["url"], _if(this.isUrl)(_g)), (_h = ["href=\"", "\""], _h.raw = ["href=\"", "\""], _if(this.isUrl)(_h, this.json)), helpers_ts_1.getValuePreview(this.json, this.json), this.isUrl ? 'a' : 'span')) + "\n\n        </span>\n\n        " + (_j = ["\n          <span class=\"preview-text\">", "</span>\n        "], _j.raw = ["\n          <span class=\"preview-text\">", "</span>\n        "], _if(this.config.hoverPreviewEnabled && this.isObject)(_j, this.getInlinepreview())) + "\n      </a>\n\n      <div class=\"children " + (_k = ["object"], _k.raw = ["object"], _if(this.isObject)(_k)) + " " + (_l = ["array"], _l.raw = ["array"], _if(this.isArray)(_l)) + " " + (_m = ["empty"], _m.raw = ["empty"], _if(this.isEmpty)(_m)) + "\"></div>\n    ";
		        return templateString.replace(/\s*\n/g, '\n');
		        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
		    };
		    JSONFormatter.prototype.render = function () {
		        var resultHTML = this.template();
		        this.element = document.createElement('div');
		        this.element.classList.add('json-formatter-row');
		        if (this.config && this.config.theme) {
		            this.element.classList.add("json-formatter-" + this.config.theme);
		        }
		        if (this.isOpen) {
		            this.element.classList.add('open');
		        }
		        this.element.innerHTML = resultHTML;
		        if (this.isObject && this.isOpen) {
		            this.appendChildern();
		        }
		        this.element.querySelector('a.toggler-link')
		            .addEventListener('click', this.toggleOpen.bind(this));
		        return this.element;
		    };
		    JSONFormatter.prototype.appendChildern = function () {
		        var _this = this;
		        var children = this.element.querySelector('div.children');
		        if (!children) {
		            return;
		        }
		        this.keys.forEach(function (key) {
		            var formatter = new JSONFormatter(_this.json[key], _this.open - 1, _this.config, key);
		            children.appendChild(formatter.render());
		        });
		    };
		    JSONFormatter.prototype.removeChildren = function () {
		        if (this.element.querySelector('div.children')) {
		            this.element.removeChild(this.element.querySelector('div.children'));
		        }
		    };
		    return JSONFormatter;
		}());
		exports.JSONFormatter = JSONFormatter;


	/***/ },
	/* 1 */
	/***/ function(module, exports) {

		'use strict';
		function escapeString(str) {
		    return str.replace('"', '\"');
		}
		function isObject(value) {
		    var type = typeof value;
		    return !!value && (type == 'object');
		}
		exports.isObject = isObject;
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
		function getType(object) {
		    if (object === null) {
		        return 'null';
		    }
		    return typeof object;
		}
		exports.getType = getType;
		function getValuePreview(object, value) {
		    var type = getType(object);
		    if (type === 'null' || type === 'undefined') {
		        return type;
		    }
		    if (type === 'string') {
		        value = '"' + escapeString(value) + '"';
		    }
		    if (type === 'function') {
		        return object.toString()
		            .replace(/[\r\n]/g, '')
		            .replace(/\{.*\}/, '') + '{…}';
		    }
		    return value;
		}
		exports.getValuePreview = getValuePreview;
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


	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		// style-loader: Adds some css to the DOM by adding a <style> tag

		// load the styles
		var content = __webpack_require__(3);
		if(typeof content === 'string') content = [[module.id, content, '']];
		// add the styles to the DOM
		var update = __webpack_require__(5)(content, {});
		if(content.locals) module.exports = content.locals;
		// Hot Module Replacement
		if(false) {
			// When the styles change, update the <style> tags
			if(!content.locals) {
				module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./style.less", function() {
					var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./style.less");
					if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
					update(newContent);
				});
			}
			// When the module is disposed, remove the <style> tags
			module.hot.dispose(function() { update(); });
		}

	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {

		exports = module.exports = __webpack_require__(4)();
		// imports


		// module
		exports.push([module.id, ".json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-row,\n.json-formatter-row a,\n.json-formatter-row a:hover {\n  color: black;\n  text-decoration: none;\n}\n.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-row .children.empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-row .children.empty:after {\n  display: none;\n}\n.json-formatter-row .children.empty.object:after {\n  content: \"No properties\";\n}\n.json-formatter-row .children.empty.array:after {\n  content: \"[]\";\n}\n.json-formatter-row .string {\n  color: green;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-row .number {\n  color: blue;\n}\n.json-formatter-row .boolean {\n  color: red;\n}\n.json-formatter-row .null {\n  color: #855A00;\n}\n.json-formatter-row .undefined {\n  color: #ca0b69;\n}\n.json-formatter-row .function {\n  color: #FF20ED;\n}\n.json-formatter-row .date {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.json-formatter-row .url {\n  text-decoration: underline;\n  color: blue;\n  cursor: pointer;\n}\n.json-formatter-row .bracket {\n  color: blue;\n}\n.json-formatter-row .key {\n  color: #00008B;\n  cursor: pointer;\n}\n.json-formatter-row .constructor-name {\n  cursor: pointer;\n}\n.json-formatter-row .toggler {\n  line-height: 1.2rem;\n  font-size: 0.8em;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n}\n.json-formatter-row .toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: \"\\25BA\";\n}\n.json-formatter-row > a > .preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-row:hover > a > .preview-text {\n  opacity: 0.6;\n}\n.json-formatter-row.open > .toggler-link .toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-row.open > .children:after {\n  display: inline-block;\n}\n.json-formatter-row.open > a > .preview-text {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-dark.json-formatter-row,\n.json-formatter-dark.json-formatter-row a,\n.json-formatter-dark.json-formatter-row a:hover {\n  color: white;\n  text-decoration: none;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .children.empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .children.empty:after {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row .children.empty.object:after {\n  content: \"No properties\";\n}\n.json-formatter-dark.json-formatter-row .children.empty.array:after {\n  content: \"[]\";\n}\n.json-formatter-dark.json-formatter-row .string {\n  color: #31F031;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-dark.json-formatter-row .number {\n  color: #66C2FF;\n}\n.json-formatter-dark.json-formatter-row .boolean {\n  color: #EC4242;\n}\n.json-formatter-dark.json-formatter-row .null {\n  color: #EEC97D;\n}\n.json-formatter-dark.json-formatter-row .undefined {\n  color: #ef8fbe;\n}\n.json-formatter-dark.json-formatter-row .function {\n  color: #FD48CB;\n}\n.json-formatter-dark.json-formatter-row .date {\n  background-color: rgba(255, 255, 255, 0.05);\n}\n.json-formatter-dark.json-formatter-row .url {\n  text-decoration: underline;\n  color: #027BFF;\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .bracket {\n  color: #9494FF;\n}\n.json-formatter-dark.json-formatter-row .key {\n  color: #23A0DB;\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .constructor-name {\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .toggler {\n  line-height: 1.2rem;\n  font-size: 0.8em;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: \"\\25BA\";\n}\n.json-formatter-dark.json-formatter-row > a > .preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-dark.json-formatter-row:hover > a > .preview-text {\n  opacity: 0.6;\n}\n.json-formatter-dark.json-formatter-row.open > .toggler-link .toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-dark.json-formatter-row.open > .children:after {\n  display: inline-block;\n}\n.json-formatter-dark.json-formatter-row.open > a > .preview-text {\n  display: none;\n}\n", ""]);

		// exports


	/***/ },
	/* 4 */
	/***/ function(module, exports) {

		/*
			MIT License http://www.opensource.org/licenses/mit-license.php
			Author Tobias Koppers @sokra
		*/
		// css base code, injected by the css-loader
		module.exports = function() {
			var list = [];

			// return the list of modules as css string
			list.toString = function toString() {
				var result = [];
				for(var i = 0; i < this.length; i++) {
					var item = this[i];
					if(item[2]) {
						result.push("@media " + item[2] + "{" + item[1] + "}");
					} else {
						result.push(item[1]);
					}
				}
				return result.join("");
			};

			// import a list of modules into the list
			list.i = function(modules, mediaQuery) {
				if(typeof modules === "string")
					modules = [[null, modules, ""]];
				var alreadyImportedModules = {};
				for(var i = 0; i < this.length; i++) {
					var id = this[i][0];
					if(typeof id === "number")
						alreadyImportedModules[id] = true;
				}
				for(i = 0; i < modules.length; i++) {
					var item = modules[i];
					// skip already imported module
					// this implementation is not 100% perfect for weird media query combinations
					//  when a module is imported multiple times with different media queries.
					//  I hope this will never occur (Hey this way we have smaller bundles)
					if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
						if(mediaQuery && !item[2]) {
							item[2] = mediaQuery;
						} else if(mediaQuery) {
							item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
						}
						list.push(item);
					}
				}
			};
			return list;
		};


	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {

		/*
			MIT License http://www.opensource.org/licenses/mit-license.php
			Author Tobias Koppers @sokra
		*/
		var stylesInDom = {},
			memoize = function(fn) {
				var memo;
				return function () {
					if (typeof memo === "undefined") memo = fn.apply(this, arguments);
					return memo;
				};
			},
			isOldIE = memoize(function() {
				return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
			}),
			getHeadElement = memoize(function () {
				return document.head || document.getElementsByTagName("head")[0];
			}),
			singletonElement = null,
			singletonCounter = 0,
			styleElementsInsertedAtTop = [];

		module.exports = function(list, options) {
			if(false) {
				if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
			}

			options = options || {};
			// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
			// tags it will allow on a page
			if (typeof options.singleton === "undefined") options.singleton = isOldIE();

			// By default, add <style> tags to the bottom of <head>.
			if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

			var styles = listToStyles(list);
			addStylesToDom(styles, options);

			return function update(newList) {
				var mayRemove = [];
				for(var i = 0; i < styles.length; i++) {
					var item = styles[i];
					var domStyle = stylesInDom[item.id];
					domStyle.refs--;
					mayRemove.push(domStyle);
				}
				if(newList) {
					var newStyles = listToStyles(newList);
					addStylesToDom(newStyles, options);
				}
				for(var i = 0; i < mayRemove.length; i++) {
					var domStyle = mayRemove[i];
					if(domStyle.refs === 0) {
						for(var j = 0; j < domStyle.parts.length; j++)
							domStyle.parts[j]();
						delete stylesInDom[domStyle.id];
					}
				}
			};
		}

		function addStylesToDom(styles, options) {
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				if(domStyle) {
					domStyle.refs++;
					for(var j = 0; j < domStyle.parts.length; j++) {
						domStyle.parts[j](item.parts[j]);
					}
					for(; j < item.parts.length; j++) {
						domStyle.parts.push(addStyle(item.parts[j], options));
					}
				} else {
					var parts = [];
					for(var j = 0; j < item.parts.length; j++) {
						parts.push(addStyle(item.parts[j], options));
					}
					stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
				}
			}
		}

		function listToStyles(list) {
			var styles = [];
			var newStyles = {};
			for(var i = 0; i < list.length; i++) {
				var item = list[i];
				var id = item[0];
				var css = item[1];
				var media = item[2];
				var sourceMap = item[3];
				var part = {css: css, media: media, sourceMap: sourceMap};
				if(!newStyles[id])
					styles.push(newStyles[id] = {id: id, parts: [part]});
				else
					newStyles[id].parts.push(part);
			}
			return styles;
		}

		function insertStyleElement(options, styleElement) {
			var head = getHeadElement();
			var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
			if (options.insertAt === "top") {
				if(!lastStyleElementInsertedAtTop) {
					head.insertBefore(styleElement, head.firstChild);
				} else if(lastStyleElementInsertedAtTop.nextSibling) {
					head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
				} else {
					head.appendChild(styleElement);
				}
				styleElementsInsertedAtTop.push(styleElement);
			} else if (options.insertAt === "bottom") {
				head.appendChild(styleElement);
			} else {
				throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
			}
		}

		function removeStyleElement(styleElement) {
			styleElement.parentNode.removeChild(styleElement);
			var idx = styleElementsInsertedAtTop.indexOf(styleElement);
			if(idx >= 0) {
				styleElementsInsertedAtTop.splice(idx, 1);
			}
		}

		function createStyleElement(options) {
			var styleElement = document.createElement("style");
			styleElement.type = "text/css";
			insertStyleElement(options, styleElement);
			return styleElement;
		}

		function createLinkElement(options) {
			var linkElement = document.createElement("link");
			linkElement.rel = "stylesheet";
			insertStyleElement(options, linkElement);
			return linkElement;
		}

		function addStyle(obj, options) {
			var styleElement, update, remove;

			if (options.singleton) {
				var styleIndex = singletonCounter++;
				styleElement = singletonElement || (singletonElement = createStyleElement(options));
				update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
				remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
			} else if(obj.sourceMap &&
				typeof URL === "function" &&
				typeof URL.createObjectURL === "function" &&
				typeof URL.revokeObjectURL === "function" &&
				typeof Blob === "function" &&
				typeof btoa === "function") {
				styleElement = createLinkElement(options);
				update = updateLink.bind(null, styleElement);
				remove = function() {
					removeStyleElement(styleElement);
					if(styleElement.href)
						URL.revokeObjectURL(styleElement.href);
				};
			} else {
				styleElement = createStyleElement(options);
				update = applyToTag.bind(null, styleElement);
				remove = function() {
					removeStyleElement(styleElement);
				};
			}

			update(obj);

			return function updateStyle(newObj) {
				if(newObj) {
					if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
						return;
					update(obj = newObj);
				} else {
					remove();
				}
			};
		}

		var replaceText = (function () {
			var textStore = [];

			return function (index, replacement) {
				textStore[index] = replacement;
				return textStore.filter(Boolean).join('\n');
			};
		})();

		function applyToSingletonTag(styleElement, index, remove, obj) {
			var css = remove ? "" : obj.css;

			if (styleElement.styleSheet) {
				styleElement.styleSheet.cssText = replaceText(index, css);
			} else {
				var cssNode = document.createTextNode(css);
				var childNodes = styleElement.childNodes;
				if (childNodes[index]) styleElement.removeChild(childNodes[index]);
				if (childNodes.length) {
					styleElement.insertBefore(cssNode, childNodes[index]);
				} else {
					styleElement.appendChild(cssNode);
				}
			}
		}

		function applyToTag(styleElement, obj) {
			var css = obj.css;
			var media = obj.media;
			var sourceMap = obj.sourceMap;

			if(media) {
				styleElement.setAttribute("media", media)
			}

			if(styleElement.styleSheet) {
				styleElement.styleSheet.cssText = css;
			} else {
				while(styleElement.firstChild) {
					styleElement.removeChild(styleElement.firstChild);
				}
				styleElement.appendChild(document.createTextNode(css));
			}
		}

		function updateLink(linkElement, obj) {
			var css = obj.css;
			var media = obj.media;
			var sourceMap = obj.sourceMap;

			if(sourceMap) {
				// http://stackoverflow.com/a/26603875
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
			}

			var blob = new Blob([css], { type: "text/css" });

			var oldSrc = linkElement.href;

			linkElement.href = URL.createObjectURL(blob);

			if(oldSrc)
				URL.revokeObjectURL(oldSrc);
		}


	/***/ }
	/******/ ]);

/***/ }
/******/ ]);