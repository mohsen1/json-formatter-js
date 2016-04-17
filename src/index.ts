'use strict';

import './style.less';

import {
  isObject,
  getObjectName,
  getType,
  getValuePreview,
  getPreview
} from './helpers.ts';


const DATE_STRING_REGEX = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
const PARTIAL_DATE_REGEX = /\d{2}:\d{2}:\d{2} GMT-\d{4}/;
const JSON_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

const requestAnimationFrame = window.requestAnimationFrame || function(cb: ()=>void) { cb(); return 0; };

/*
 * Generates a prefixed CSS class name
*/
function cssClass(className:string): string {
  return `json-formatter-${className}`;
}

/*
  * Creates a new DOM element wiht given type and class
  * TODO: move me to helpers
*/
function createElement(type: string, className?: string, content?: Element|string): Element {
  const el = document.createElement(type);
  if (className) {
    el.classList.add(cssClass(className));
  }
  if (content) {
    if (content instanceof Node) {
      el.appendChild(content);
    } else {
      el.appendChild(document.createTextNode(String(content)));
    }
  }
  return el;
}

/**
 * @class JSONFormatter
 *
 * JSONFormatter allows you to render JSON objects in HTML with a
 * **collapsible** navigation.
*/
export = class JSONFormatter {
  private key;
  private keys;
  private config;

  private type;
  private hasKey;
  private isOpen;
  private isDate;
  private isUrl;
  private isArray;
  private isObject;
  private isEmptyObject;
  private isEmpty;
  private constructorName;
  private element: Element;

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
  constructor(public json: any, private open, config, key: string) {
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
      if(DATE_STRING_REGEX.test(json) ||
         JSON_DATE_REGEX.test(json) ||
         PARTIAL_DATE_REGEX.test(json)) {
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
    this.constructorName = getObjectName(this.json);
    this.isEmpty = this.isEmptyObject || (this.keys &&
      !this.keys.length &&
      this.isArray);
  }



  /**
   * Toggles `isOpen` state
   *
  */
  toggleOpen() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.appendChildern(true);
    } else{
      this.removeChildren(true);
    }

    if (this.element) {
      this.element.classList.toggle(cssClass('open'));
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
   * Renders an HTML element and installs event listeners
   *
   * @returns {HTMLDivElement}
  */
  render(): HTMLDivElement {

    this.element = createElement('div', 'row');
    const togglerLink = createElement('a', 'toggler-link');

    if (this.isObject) {
      togglerLink.appendChild(createElement('span', 'toggler'));
    }

    if (this.hasKey) {
      togglerLink.appendChild(createElement('span', 'key', `${this.key}:`));
    }

    const value = createElement('span', 'value');
    if (this.isObject) {
      const wrapperSpan = createElement('span');

      var constructorName = createElement('span', 'constructor-name', this.constructorName);
      wrapperSpan.appendChild(constructorName);

      if (this.isArray) {
        const arrayWrapperSpan = createElement('span');
        arrayWrapperSpan.appendChild(createElement('span', 'bracket', '['));
        arrayWrapperSpan.appendChild(createElement('span', 'number', (this.json.length)));
        arrayWrapperSpan.appendChild(createElement('span', 'bracket', ']'));
        wrapperSpan.appendChild(arrayWrapperSpan);
      }


      value.appendChild(wrapperSpan);
      togglerLink.appendChild(value);

    // Primitive values
    } else {
      const value = this.isUrl ? createElement('a') : createElement('span');
      value.classList.add(cssClass(this.type));
      if (this.isDate) {
        value.classList.add(cssClass('date'));
      }
      if (this.isUrl) {
        value.classList.add(cssClass('url'));
        value.setAttribute('href', this.json);
      }

      const valuePreview = getValuePreview(this.json, this.json);
      value.appendChild(document.createTextNode(valuePreview));
      togglerLink.appendChild(value);
    }

    const children = createElement('div', 'children');
    if (this.isObject) {
      children.classList.add(cssClass('object'));
    }
    if (this.isArray) {
      children.classList.add(cssClass('array'));
    }
    if (this.isEmpty) {
      children.classList.add(cssClass('empty'));
    }

    if (this.config && this.config.theme) {
      this.element.classList.add(cssClass(this.config.theme));
    }

    if (this.isOpen) {
      this.element.classList.add(cssClass('open'));
    }

    this.element.appendChild(togglerLink);
    this.element.appendChild(children);

    if (this.isObject && this.isOpen) {
      this.appendChildern();
    }

    // add event listener for toggling
    this.element.querySelector(`a.${cssClass('toggler-link')}`)
      .addEventListener('click', this.toggleOpen.bind(this));

    return this.element as HTMLDivElement;
  }

  /**
   * Appends all the children to `<div class="children"></div>` element
   *
  */
  appendChildern(animated: boolean = false) {
    const children = this.element.querySelector(`div.${cssClass('children')}`);

    if (!children) { return; }

    if (animated) {
      let index = 0;
      const addAChild = ()=> {
        const key = this.keys[index];
        const formatter = new JSONFormatter(this.json[key], this.open - 1, this.config, key);
        children.appendChild(formatter.render());

        index += 1;

        if (index < this.keys.length) {
          requestAnimationFrame(addAChild);
        }
      };

      requestAnimationFrame(addAChild);

    } else {
      this.keys.forEach(key => {
        requestAnimationFrame(()=>{
          const formatter = new JSONFormatter(this.json[key], this.open - 1, this.config, key);
          children.appendChild(formatter.render());
        });
      });
    }
  }

  /**
   * Removes all the children from `<div class="children"></div>` element
   *
  */
  removeChildren(animated: boolean = false) {
    const childrenElement = this.element.querySelector(`div.${cssClass('children')}`) as HTMLDivElement;

    if (animated) {
      const removeAChild = ()=> {
        if (childrenElement && childrenElement.children.length) {
          childrenElement.removeChild(childrenElement.children[0]);
          requestAnimationFrame(removeAChild);
        }
      };
      requestAnimationFrame(removeAChild);
    } else {
      if (childrenElement) {
        childrenElement.innerHTML = '';
      }
    }
  }
}