(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(); else if (typeof define === "function" && define.amd) define("JSONFormatter", [], factory); else if (typeof exports === "object") exports["JSONFormatter"] = factory(); else root["JSONFormatter"] = factory();
})(this, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.i = function(value) {
            return value;
        };
        __webpack_require__.d = function(exports, name, getter) {
            if (!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                    configurable: false,
                    enumerable: true,
                    get: getter
                });
            }
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function getDefault() {
                return module["default"];
            } : function getModuleExports() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "dist";
        return __webpack_require__(__webpack_require__.s = 6);
    }([ function(module, exports, __webpack_require__) {
        "use strict";
        __webpack_require__(4);
        var helpers_ts_1 = __webpack_require__(5);
        var DATE_STRING_REGEX = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
        var PARTIAL_DATE_REGEX = /\d{2}:\d{2}:\d{2} GMT-\d{4}/;
        var JSON_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
        var MAX_ANIMATED_TOGGLE_ITEMS = 10;
        var requestAnimationFrame = window.requestAnimationFrame || function(cb) {
            cb();
            return 0;
        };
        var _defaultConfig = {
            hoverPreviewEnabled: false,
            hoverPreviewArrayCount: 100,
            hoverPreviewFieldCount: 5,
            animateOpen: true,
            animateClose: true,
            theme: null
        };
        module.exports = function() {
            function JSONFormatter(json, open, config, key) {
                if (open === void 0) {
                    open = 1;
                }
                if (config === void 0) {
                    config = _defaultConfig;
                }
                this.json = json;
                this.open = open;
                this.config = config;
                this.key = key;
                this._isOpen = null;
                if (this.config.hoverPreviewEnabled === undefined) {
                    this.config.hoverPreviewEnabled = _defaultConfig.hoverPreviewEnabled;
                }
                if (this.config.hoverPreviewArrayCount === undefined) {
                    this.config.hoverPreviewArrayCount = _defaultConfig.hoverPreviewArrayCount;
                }
                if (this.config.hoverPreviewFieldCount === undefined) {
                    this.config.hoverPreviewFieldCount = _defaultConfig.hoverPreviewFieldCount;
                }
            }
            Object.defineProperty(JSONFormatter.prototype, "isOpen", {
                get: function() {
                    if (this._isOpen !== null) {
                        return this._isOpen;
                    } else {
                        return this.open > 0;
                    }
                },
                set: function(value) {
                    this._isOpen = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "isDate", {
                get: function() {
                    return this.type === "string" && (DATE_STRING_REGEX.test(this.json) || JSON_DATE_REGEX.test(this.json) || PARTIAL_DATE_REGEX.test(this.json));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "isUrl", {
                get: function() {
                    return this.type === "string" && this.json.indexOf("http") === 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "isArray", {
                get: function() {
                    return Array.isArray(this.json);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "isObject", {
                get: function() {
                    return helpers_ts_1.isObject(this.json);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "isEmptyObject", {
                get: function() {
                    return !this.keys.length && !this.isArray;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "isEmpty", {
                get: function() {
                    return this.isEmptyObject || this.keys && !this.keys.length && this.isArray;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "hasKey", {
                get: function() {
                    return typeof this.key !== "undefined";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "constructorName", {
                get: function() {
                    return helpers_ts_1.getObjectName(this.json);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "type", {
                get: function() {
                    return helpers_ts_1.getType(this.json);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(JSONFormatter.prototype, "keys", {
                get: function() {
                    if (this.isObject) {
                        return Object.keys(this.json).map(function(key) {
                            return key ? key : '""';
                        });
                    } else {
                        return [];
                    }
                },
                enumerable: true,
                configurable: true
            });
            JSONFormatter.prototype.toggleOpen = function() {
                this.isOpen = !this.isOpen;
                if (this.element) {
                    if (this.isOpen) {
                        this.appendChildren(this.config.animateOpen);
                    } else {
                        this.removeChildren(this.config.animateClose);
                    }
                    this.element.classList.toggle(helpers_ts_1.cssClass("open"));
                }
            };
            JSONFormatter.prototype.openAtDepth = function(depth) {
                if (depth === void 0) {
                    depth = 1;
                }
                if (depth < 0) {
                    return;
                }
                this.open = depth;
                this.isOpen = depth !== 0;
                if (this.element) {
                    this.removeChildren(false);
                    if (depth === 0) {
                        this.element.classList.remove(helpers_ts_1.cssClass("open"));
                    } else {
                        this.appendChildren(this.config.animateOpen);
                        this.element.classList.add(helpers_ts_1.cssClass("open"));
                    }
                }
            };
            JSONFormatter.prototype.getInlinepreview = function() {
                var _this = this;
                if (this.isArray) {
                    if (this.json.length > this.config.hoverPreviewArrayCount) {
                        return "Array[" + this.json.length + "]";
                    } else {
                        return "[" + this.json.map(helpers_ts_1.getPreview).join(", ") + "]";
                    }
                } else {
                    var keys = this.keys;
                    var narrowKeys = keys.slice(0, this.config.hoverPreviewFieldCount);
                    var kvs = narrowKeys.map(function(key) {
                        return key + ":" + helpers_ts_1.getPreview(_this.json[key]);
                    });
                    var ellipsis = keys.length >= this.config.hoverPreviewFieldCount ? "…" : "";
                    return "{" + kvs.join(", ") + ellipsis + "}";
                }
            };
            JSONFormatter.prototype.render = function() {
                this.element = helpers_ts_1.createElement("div", "row");
                var togglerLink = helpers_ts_1.createElement("a", "toggler-link");
                if (this.isObject) {
                    togglerLink.appendChild(helpers_ts_1.createElement("span", "toggler"));
                }
                if (this.hasKey) {
                    togglerLink.appendChild(helpers_ts_1.createElement("span", "key", this.key + ":"));
                }
                if (this.isObject) {
                    var value = helpers_ts_1.createElement("span", "value");
                    var objectWrapperSpan = helpers_ts_1.createElement("span");
                    var constructorName = helpers_ts_1.createElement("span", "constructor-name", this.constructorName);
                    objectWrapperSpan.appendChild(constructorName);
                    if (this.isArray) {
                        var arrayWrapperSpan = helpers_ts_1.createElement("span");
                        arrayWrapperSpan.appendChild(helpers_ts_1.createElement("span", "bracket", "["));
                        arrayWrapperSpan.appendChild(helpers_ts_1.createElement("span", "number", this.json.length));
                        arrayWrapperSpan.appendChild(helpers_ts_1.createElement("span", "bracket", "]"));
                        objectWrapperSpan.appendChild(arrayWrapperSpan);
                    }
                    value.appendChild(objectWrapperSpan);
                    togglerLink.appendChild(value);
                } else {
                    var value = this.isUrl ? helpers_ts_1.createElement("a") : helpers_ts_1.createElement("span");
                    value.classList.add(helpers_ts_1.cssClass(this.type));
                    if (this.isDate) {
                        value.classList.add(helpers_ts_1.cssClass("date"));
                    }
                    if (this.isUrl) {
                        value.classList.add(helpers_ts_1.cssClass("url"));
                        value.setAttribute("href", this.json);
                    }
                    var valuePreview = helpers_ts_1.getValuePreview(this.json, this.json);
                    value.appendChild(document.createTextNode(valuePreview));
                    togglerLink.appendChild(value);
                }
                if (this.isObject && this.config.hoverPreviewEnabled) {
                    var preview = helpers_ts_1.createElement("span", "preview-text");
                    preview.appendChild(document.createTextNode(this.getInlinepreview()));
                    togglerLink.appendChild(preview);
                }
                var children = helpers_ts_1.createElement("div", "children");
                if (this.isObject) {
                    children.classList.add(helpers_ts_1.cssClass("object"));
                }
                if (this.isArray) {
                    children.classList.add(helpers_ts_1.cssClass("array"));
                }
                if (this.isEmpty) {
                    children.classList.add(helpers_ts_1.cssClass("empty"));
                }
                if (this.config && this.config.theme) {
                    this.element.classList.add(helpers_ts_1.cssClass(this.config.theme));
                }
                if (this.isOpen) {
                    this.element.classList.add(helpers_ts_1.cssClass("open"));
                }
                this.element.appendChild(togglerLink);
                this.element.appendChild(children);
                if (this.isObject && this.isOpen) {
                    this.appendChildren();
                }
                if (this.isObject) {
                    togglerLink.addEventListener("click", this.toggleOpen.bind(this));
                }
                return this.element;
            };
            JSONFormatter.prototype.appendChildren = function(animated) {
                var _this = this;
                if (animated === void 0) {
                    animated = false;
                }
                var children = this.element.querySelector("div." + helpers_ts_1.cssClass("children"));
                if (!children || this.isEmpty) {
                    return;
                }
                if (animated) {
                    var index_1 = 0;
                    var addAChild_1 = function() {
                        var key = _this.keys[index_1];
                        var formatter = new JSONFormatter(_this.json[key], _this.open - 1, _this.config, key);
                        children.appendChild(formatter.render());
                        index_1 += 1;
                        if (index_1 < _this.keys.length) {
                            if (index_1 > MAX_ANIMATED_TOGGLE_ITEMS) {
                                addAChild_1();
                            } else {
                                requestAnimationFrame(addAChild_1);
                            }
                        }
                    };
                    requestAnimationFrame(addAChild_1);
                } else {
                    this.keys.forEach(function(key) {
                        var formatter = new JSONFormatter(_this.json[key], _this.open - 1, _this.config, key);
                        children.appendChild(formatter.render());
                    });
                }
            };
            JSONFormatter.prototype.removeChildren = function(animated) {
                if (animated === void 0) {
                    animated = false;
                }
                var childrenElement = this.element.querySelector("div." + helpers_ts_1.cssClass("children"));
                if (animated) {
                    var childrenRemoved_1 = 0;
                    var removeAChild_1 = function() {
                        if (childrenElement && childrenElement.children.length) {
                            childrenElement.removeChild(childrenElement.children[0]);
                            childrenRemoved_1 += 1;
                            if (childrenRemoved_1 > MAX_ANIMATED_TOGGLE_ITEMS) {
                                removeAChild_1();
                            } else {
                                requestAnimationFrame(removeAChild_1);
                            }
                        }
                    };
                    requestAnimationFrame(removeAChild_1);
                } else {
                    if (childrenElement) {
                        childrenElement.innerHTML = "";
                    }
                }
            };
            return JSONFormatter;
        }();
    }, function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(2)();
        exports.push([ module.i, '.json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-row,\n.json-formatter-row a,\n.json-formatter-row a:hover {\n  color: black;\n  text-decoration: none;\n}\n.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty:after {\n  display: none;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {\n  content: "No properties";\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {\n  content: "[]";\n}\n.json-formatter-row .json-formatter-string {\n  color: green;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-row .json-formatter-number {\n  color: blue;\n}\n.json-formatter-row .json-formatter-boolean {\n  color: red;\n}\n.json-formatter-row .json-formatter-null {\n  color: #855A00;\n}\n.json-formatter-row .json-formatter-undefined {\n  color: #ca0b69;\n}\n.json-formatter-row .json-formatter-function {\n  color: #FF20ED;\n}\n.json-formatter-row .json-formatter-date {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.json-formatter-row .json-formatter-url {\n  text-decoration: underline;\n  color: blue;\n  cursor: pointer;\n}\n.json-formatter-row .json-formatter-bracket {\n  color: blue;\n}\n.json-formatter-row .json-formatter-key {\n  color: #00008B;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-row .json-formatter-constructor-name {\n  cursor: pointer;\n}\n.json-formatter-row .json-formatter-toggler {\n  line-height: 1.2rem;\n  font-size: 0.7rem;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-row .json-formatter-toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: "\\25BA";\n}\n.json-formatter-row > a > .json-formatter-preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-row:hover > a > .json-formatter-preview-text {\n  opacity: 0.6;\n}\n.json-formatter-row.json-formatter-open > .json-formatter-toggler-link .json-formatter-toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-row.json-formatter-open > .json-formatter-children:after {\n  display: inline-block;\n}\n.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {\n  display: none;\n}\n.json-formatter-row.json-formatter-open.json-formatter-empty:after {\n  display: block;\n}\n.json-formatter-dark.json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-dark.json-formatter-row,\n.json-formatter-dark.json-formatter-row a,\n.json-formatter-dark.json-formatter-row a:hover {\n  color: white;\n  text-decoration: none;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty:after {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {\n  content: "No properties";\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {\n  content: "[]";\n}\n.json-formatter-dark.json-formatter-row .json-formatter-string {\n  color: #31F031;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-number {\n  color: #66C2FF;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-boolean {\n  color: #EC4242;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-null {\n  color: #EEC97D;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-undefined {\n  color: #ef8fbe;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-function {\n  color: #FD48CB;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-date {\n  background-color: rgba(255, 255, 255, 0.05);\n}\n.json-formatter-dark.json-formatter-row .json-formatter-url {\n  text-decoration: underline;\n  color: #027BFF;\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-bracket {\n  color: #9494FF;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-key {\n  color: #23A0DB;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-constructor-name {\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-toggler {\n  line-height: 1.2rem;\n  font-size: 0.7rem;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: "\\25BA";\n}\n.json-formatter-dark.json-formatter-row > a > .json-formatter-preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-dark.json-formatter-row:hover > a > .json-formatter-preview-text {\n  opacity: 0.6;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > .json-formatter-toggler-link .json-formatter-toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > .json-formatter-children:after {\n  display: inline-block;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open.json-formatter-empty:after {\n  display: block;\n}\n', "" ]);
    }, function(module, exports) {
        module.exports = function() {
            var list = [];
            list.toString = function toString() {
                var result = [];
                for (var i = 0; i < this.length; i++) {
                    var item = this[i];
                    if (item[2]) {
                        result.push("@media " + item[2] + "{" + item[1] + "}");
                    } else {
                        result.push(item[1]);
                    }
                }
                return result.join("");
            };
            list.i = function(modules, mediaQuery) {
                if (typeof modules === "string") modules = [ [ null, modules, "" ] ];
                var alreadyImportedModules = {};
                for (var i = 0; i < this.length; i++) {
                    var id = this[i][0];
                    if (typeof id === "number") alreadyImportedModules[id] = true;
                }
                for (i = 0; i < modules.length; i++) {
                    var item = modules[i];
                    if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
                        if (mediaQuery && !item[2]) {
                            item[2] = mediaQuery;
                        } else if (mediaQuery) {
                            item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
                        }
                        list.push(item);
                    }
                }
            };
            return list;
        };
    }, function(module, exports) {
        var stylesInDom = {}, memoize = function(fn) {
            var memo;
            return function() {
                if (typeof memo === "undefined") memo = fn.apply(this, arguments);
                return memo;
            };
        }, isOldIE = memoize(function() {
            return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
        }), getHeadElement = memoize(function() {
            return document.head || document.getElementsByTagName("head")[0];
        }), singletonElement = null, singletonCounter = 0, styleElementsInsertedAtTop = [];
        module.exports = function(list, options) {
            if (typeof DEBUG !== "undefined" && DEBUG) {
                if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
            }
            options = options || {};
            if (typeof options.singleton === "undefined") options.singleton = isOldIE();
            if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
            var styles = listToStyles(list);
            addStylesToDom(styles, options);
            return function update(newList) {
                var mayRemove = [];
                for (var i = 0; i < styles.length; i++) {
                    var item = styles[i];
                    var domStyle = stylesInDom[item.id];
                    domStyle.refs--;
                    mayRemove.push(domStyle);
                }
                if (newList) {
                    var newStyles = listToStyles(newList);
                    addStylesToDom(newStyles, options);
                }
                for (var i = 0; i < mayRemove.length; i++) {
                    var domStyle = mayRemove[i];
                    if (domStyle.refs === 0) {
                        for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                        delete stylesInDom[domStyle.id];
                    }
                }
            };
        };
        function addStylesToDom(styles, options) {
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i];
                var domStyle = stylesInDom[item.id];
                if (domStyle) {
                    domStyle.refs++;
                    for (var j = 0; j < domStyle.parts.length; j++) {
                        domStyle.parts[j](item.parts[j]);
                    }
                    for (;j < item.parts.length; j++) {
                        domStyle.parts.push(addStyle(item.parts[j], options));
                    }
                } else {
                    var parts = [];
                    for (var j = 0; j < item.parts.length; j++) {
                        parts.push(addStyle(item.parts[j], options));
                    }
                    stylesInDom[item.id] = {
                        id: item.id,
                        refs: 1,
                        parts: parts
                    };
                }
            }
        }
        function listToStyles(list) {
            var styles = [];
            var newStyles = {};
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var id = item[0];
                var css = item[1];
                var media = item[2];
                var sourceMap = item[3];
                var part = {
                    css: css,
                    media: media,
                    sourceMap: sourceMap
                };
                if (!newStyles[id]) styles.push(newStyles[id] = {
                    id: id,
                    parts: [ part ]
                }); else newStyles[id].parts.push(part);
            }
            return styles;
        }
        function insertStyleElement(options, styleElement) {
            var head = getHeadElement();
            var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
            if (options.insertAt === "top") {
                if (!lastStyleElementInsertedAtTop) {
                    head.insertBefore(styleElement, head.firstChild);
                } else if (lastStyleElementInsertedAtTop.nextSibling) {
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
            if (idx >= 0) {
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
            } else if (obj.sourceMap && typeof URL === "function" && typeof URL.createObjectURL === "function" && typeof URL.revokeObjectURL === "function" && typeof Blob === "function" && typeof btoa === "function") {
                styleElement = createLinkElement(options);
                update = updateLink.bind(null, styleElement);
                remove = function() {
                    removeStyleElement(styleElement);
                    if (styleElement.href) URL.revokeObjectURL(styleElement.href);
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
                if (newObj) {
                    if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                    update(obj = newObj);
                } else {
                    remove();
                }
            };
        }
        var replaceText = function() {
            var textStore = [];
            return function(index, replacement) {
                textStore[index] = replacement;
                return textStore.filter(Boolean).join("\n");
            };
        }();
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
            if (media) {
                styleElement.setAttribute("media", media);
            }
            if (styleElement.styleSheet) {
                styleElement.styleSheet.cssText = css;
            } else {
                while (styleElement.firstChild) {
                    styleElement.removeChild(styleElement.firstChild);
                }
                styleElement.appendChild(document.createTextNode(css));
            }
        }
        function updateLink(linkElement, obj) {
            var css = obj.css;
            var sourceMap = obj.sourceMap;
            if (sourceMap) {
                css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
            }
            var blob = new Blob([ css ], {
                type: "text/css"
            });
            var oldSrc = linkElement.href;
            linkElement.href = URL.createObjectURL(blob);
            if (oldSrc) URL.revokeObjectURL(oldSrc);
        }
    }, function(module, exports, __webpack_require__) {
        var content = __webpack_require__(1);
        if (typeof content === "string") content = [ [ module.i, content, "" ] ];
        var update = __webpack_require__(3)(content, {});
        if (content.locals) module.exports = content.locals;
        if (false) {
            if (!content.locals) {
                module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./style.less", function() {
                    var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./style.less");
                    if (typeof newContent === "string") newContent = [ [ module.id, newContent, "" ] ];
                    update(newContent);
                });
            }
            module.hot.dispose(function() {
                update();
            });
        }
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function escapeString(str) {
            return str.replace('"', '"');
        }
        function isObject(value) {
            var type = typeof value;
            return !!value && type == "object";
        }
        exports.isObject = isObject;
        function getObjectName(object) {
            if (object === undefined) {
                return "";
            }
            if (object === null) {
                return "Object";
            }
            if (typeof object === "object" && !object.constructor) {
                return "Object";
            }
            var funcNameRegex = /function ([^(]*)/;
            var results = funcNameRegex.exec(object.constructor.toString());
            if (results && results.length > 1) {
                return results[1];
            } else {
                return "";
            }
        }
        exports.getObjectName = getObjectName;
        function getType(object) {
            if (object === null) {
                return "null";
            }
            return typeof object;
        }
        exports.getType = getType;
        function getValuePreview(object, value) {
            var type = getType(object);
            if (type === "null" || type === "undefined") {
                return type;
            }
            if (type === "string") {
                value = '"' + escapeString(value) + '"';
            }
            if (type === "function") {
                return object.toString().replace(/[\r\n]/g, "").replace(/\{.*\}/, "") + "{…}";
            }
            return value;
        }
        exports.getValuePreview = getValuePreview;
        function getPreview(object) {
            var value = "";
            if (isObject(object)) {
                value = getObjectName(object);
                if (Array.isArray(object)) value += "[" + object.length + "]";
            } else {
                value = getValuePreview(object, object);
            }
            return value;
        }
        exports.getPreview = getPreview;
        function cssClass(className) {
            return "json-formatter-" + className;
        }
        exports.cssClass = cssClass;
        function createElement(type, className, content) {
            var el = document.createElement(type);
            if (className) {
                el.classList.add(cssClass(className));
            }
            if (content !== undefined) {
                if (content instanceof Node) {
                    el.appendChild(content);
                } else {
                    el.appendChild(document.createTextNode(String(content)));
                }
            }
            return el;
        }
        exports.createElement = createElement;
    }, function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(0);
    } ]);
});
//# sourceMappingURL=json-formatter.js.map