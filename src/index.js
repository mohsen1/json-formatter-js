'use strict';

/* globals JSONFormatter */

import {
  isObject,
  getObjectName,
  getType,
  getValuePreview,
  getPreview
} from './helpers.js';

function hasClass(element, className) {
  return element && element.getAttribute('class') &&
    (element.getAttribute('class').indexOf(className) !== -1)
}

function walk(json, path_) {
  const path = path_.slice(0);

  while ((typeof json === 'object') && path.length) {
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
export default class JSONFormatter {

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
  constructor(json, open, config, path) {
    this.json = json;
    this.path = path || [];
    this.open = open === undefined ? 1 : open;
    this.config = config || {};

    this.config.hoverPreviewEnabled =
      this.config.hoverPreviewEnabled === undefined ? false :
      this.config.hoverPreviewEnabled;

    this.config.hoverPreviewArrayCount =
      this.config.hoverPreviewArrayCount === undefined ? 100 :
      this.config.hoverPreviewArrayCount;

    this.config.hoverPreviewFieldCount =
      this.config.hoverPreviewFieldCount === undefined ? 5 :
      this.config.hoverPreviewFieldCount;

    this.type = getType(this.json);
    this.hasKey = this.path.length;
    this.key = this.hasKey && this.path[this.path.length - 1]

    // If 'open' attribute is present
    this.isOpen = this.open > 0;

    if (this.type === 'string'){

      // Add custom type for date
      if((new Date(this.json)).toString() !== 'Invalid Date') {
        this.isDate = true;
      }

      // Add custom type for URLs
      if (this.json.indexOf('http') === 0) {
        this.isUrl = true;
      }
    }

    this.isArray = Array.isArray(this.json);
    this.isObject = isObject(this.json);

    this.keys = [];
    if (this.isObject) {
      this.keys = Object.keys(this.json).map((key)=> {
        if (key === '') { return '""'; }
        return key;
      });
    }

    this.isEmptyObject = !this.keys.length && this.isOpen && !this.isArray;
    this.onstructorName = getObjectName(this.json);
    this.isEmpty = this.isEmptyObject || (this.keys &&
      !this.keys.length &&
      this.isArray);

    this.getValuePreview = getValuePreview;
  }

  /**
   * Generates inline preview
   *
   * @returns {string}
  */
  getInlinepreview() {
    if (this.isArray) {

      // if array length is greater then 100 it shows "Array[101]"
      if (this.json.length > this.config.hoverPreviewArrayCount) {
        return `Array[${this.json.length}]`;
      } else {
        return `[${this.json.map(getPreview).join(', ')}]`;
      }
    } else {

      const keys = this.keys;

      // the first five keys (like Chrome Developer Tool)
      const narrowKeys = keys.slice(0, this.config.hoverPreviewFieldCount);

      // json value schematic information
      const kvs = narrowKeys.map(key => `${key}:${getPreview(this.json[key])}`);

      // if keys count greater then 5 then show ellipsis
      const ellipsis = keys.length >= 5 ? '…' : '';

      return `{${kvs.join(', ')}${ellipsis}}`;
    }
  }

  /**
   * Generates HTML string  for this JSON based on the template
   *
   * @returns {string}
  */
  template() {

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
    function empty(){
      return '';
    }
    function normal (template, ...expressions) {
      return template.slice(1).reduce((accumulator, part, i) => {
        return accumulator + expressions[i] + part;
      }, template[0]);
    }

    const templateString = `
      <div class="json-formatter-row${_if(this.isOpen)` open`}" data-path='${
          JSON.stringify(this.path)
        }'>
        <a class="toggler-link">
          ${_if(this.isObject)`
            <span class="toggler"></span>
          `}

          ${_if(this.hasKey)`
            <span class="key">${this.key}:</span>
          `}

          <span class="value">

            ${_if(this.isObject)`
              <span>
                <span class="constructor-name">${this.onstructorName}</span>

                ${_if(this.isArray)`
                  <span><span class="bracket">[</span><span class="number">${
                    this.json && this.json.length
                  }</span><span class="bracket">]</span></span>
                `}

              </span>
            `}

            ${_if(!this.isObject)`

              <${this.isUrl ? 'a' : 'span'}
                class="${
                  this.type
                } ${
                  _if(this.isDate)`date`
                } ${
                  _if(this.isUrl)`url`
                }"
                ${_if(this.isUrl)`href="${this.json}"`}
              >${this.getValuePreview(this.json, this.json)}</${
                this.isUrl ? 'a' : 'span'
              }>

            `}

          </span>

          ${_if(this.config.hoverPreviewEnabled && this.isObject)`
            <span class="preview-text">${this.getInlinepreview()}</span>
          `}
        </a>

        <div class="children ${
          _if(this.isObject)`object`
        } ${
          _if(this.isArray)`array`
        } ${
          _if(this.isEmpty)`empty`
        }">
          ${_if(this.isOpen)`
            ${this.keys.map(this.childTemplate.bind(this)).join('')}
          `}
        </div>
      </div>
    `;

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
  childTemplate(key) {
    const newPath = this.path.slice(0); newPath.push(key);
    const json = walk(this.json, newPath);
    const open = this.open - 1;
    const formatter = new JSONFormatter(json, open, this.config, newPath);

    return formatter.template();
  }

  /**
   * Renders an HTML element and installs event listeners
   *
   * @returns {HTMLDivElement}
  */
  render() {
    const element = document.createElement('div');

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
  toggleOpen(event) {
    let target = event.target;

    while (!hasClass(target, 'json-formatter-row') && target.parentElement) {
      target = target.parentElement;
    }

    let path = null;
    const isOpen = hasClass(target, 'open');

    if (target.dataset.path) {
      try {
        path = JSON.parse(target.dataset.path);
      } catch (e) {}
    }

    if (isOpen) {
      this.removeChildren(target);
    } else{
      this.appendChildern(target, key);
    }

    target.classList.toggle('open');
  }

  /**
   * Appends all the children to `<div class="children"></div>` element
   *
   * @param {object} json
  */
  appendChildern(element, json) {
    const children = element.querySelector('div.children');

    if (!children) { return; }

    if (typeof json === 'object') {
      Object.keys(json).forEach((key)=> {
        const json = json[key];
        const open = this.open - 1;
        const formatter = new JSONFormatter(json, open, this.config, key);

        children.appendChild(formatter.render());
      });
    }
  }

  /**
   * Removes all the children from `<div class="children"></div>` element
   *
   * @param {HTMLElement} element
  */
  removeChildren(element) {
    if (element.querySelector('div.children')) {
      element.querySelector('div.children').innerHTML = '';
    }
  }
}

// TODO: UMD
window.JSONFormatter = JSONFormatter;
