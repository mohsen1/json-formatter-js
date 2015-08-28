'use strict';

/* globals JSONFormatter */

import {
  isObject,
  getObjectName,
  getType,
  getValuePreview,
  getPreview
} from './helpers.js';

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
   * @param {string} [key=undefined] The key that this object in it's parent
   * context
  */
  constructor(json, open, config, key) {
    this.json = json;
    this.key = key;
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
    this.hasKey = typeof this.key !== 'undefined';

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
   * Toggles `isOpen` state
   *
  */
  toggleOpen() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.appendChildern();
    } else{
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
      }"></div>
    `;

    return templateString.replace(/\s*\n/g, '\n'); // clean up empty lines
  }

  /**
   * Renders an HTML element and installs event listeners
   *
   * @returns {HTMLDivElement}
  */
  render() {
    const resultHTML = this.template();

    this.element = document.createElement('div');
    this.element.classList.add('json-formatter-row');

    if (this.isOpen) {
      this.element.classList.add('open');
    }

    this.element.innerHTML = resultHTML;

    if (this.isObject && this.isOpen) {
      this.appendChildern();
    }

    // add event listener for toggling
    this.element.querySelector('a.toggler-link')
      .addEventListener('click', this.toggleOpen.bind(this));

    return this.element;
  }

  /**
   * Appends all the children to `<div class="children"></div>` element
   *
  */
  appendChildern() {
    const children = this.element.querySelector('div.children');

    if (!children) { return; }

    this.keys.forEach((key)=> {
      const formatter = new JSONFormatter(
        this.json[key], this.open - 1, this.config, key);

      children.appendChild(formatter.render());
    });
  }

  /**
   * Removes all the children from `<div class="children"></div>` element
   *
  */
  removeChildren() {
    if (this.element.querySelector('div.children')) {
      this.element.querySelector('div.children').innerHTML = '';
    }
  }
}

// TODO: UMD
window.JSONFormatter = JSONFormatter;
