import {
  isObject,
  getObjectName,
  getType,
  getValuePreview,
  getPreview,
  cssClass,
  createElement,
  findPathsForTerm
} from './helpers';

import './style.less';

const DATE_STRING_REGEX = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
const PARTIAL_DATE_REGEX = /\d{2}:\d{2}:\d{2} GMT-\d{4}/;
const JSON_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

// When toggleing, don't animated removal or addition of more than a few items
const MAX_ANIMATED_TOGGLE_ITEMS = 10;

const requestAnimationFrame = window.requestAnimationFrame || function(cb: ()=>void) { cb(); return 0; };

export interface JSONFormatterConfiguration {
  hoverPreviewEnabled?: boolean;
  hoverPreviewArrayCount?: number;
  hoverPreviewFieldCount?: number;
  animateOpen?: boolean;
  animateClose?: boolean;
  theme?: string;
  expandButtonsEnabled?: boolean;
  expandButtonText?: string;
}

const _defaultConfig: JSONFormatterConfiguration = {
  hoverPreviewEnabled: false,
  hoverPreviewArrayCount: 100,
  hoverPreviewFieldCount: 5,
  animateOpen: true,
  animateClose: true,
  theme: null,
  expandButtonsEnabled: false,
  expandButtonText: 'Expand all'
};


/**
 * @class JSONFormatter
 *
 * JSONFormatter allows you to render JSON objects in HTML with a
 * **collapsible** navigation.
*/
export default class JSONFormatter {

  // Hold the open state after the toggler is used
  private _isOpen : boolean = null;

  // A reference to the element that we render to
  private element: Element;

  // A reference to the expand link
  private expandLink: HTMLAnchorElement;

  // List of opened JSONFormatter children
  private children: JSONFormatter[] = [];

  /**
   * In case of a search, this text should be highlighted in values and keys
   */
  private highlightedText = '';

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
  constructor(public json: any, private open = 1, private config: JSONFormatterConfiguration = _defaultConfig, private key?: string) {

    // Setting default values for config object
    if (this.config.hoverPreviewEnabled === undefined) {
      this.config.hoverPreviewEnabled = _defaultConfig.hoverPreviewEnabled;
    }
    if (this.config.hoverPreviewArrayCount === undefined) {
      this.config.hoverPreviewArrayCount = _defaultConfig.hoverPreviewArrayCount;
    }
    if (this.config.hoverPreviewFieldCount === undefined) {
      this.config.hoverPreviewFieldCount = _defaultConfig.hoverPreviewFieldCount;
    }
    if (this.config.expandButtonsEnabled === undefined) {
      this.config.expandButtonsEnabled = _defaultConfig.expandButtonsEnabled;
    }
    if (this.config.expandButtonText === undefined) {
      this.config.expandButtonText = _defaultConfig.expandButtonText;
    }
  }

  /*
   * is formatter open?
  */
  private get isOpen(): boolean {
    if (this._isOpen !== null) {
      return this._isOpen
    } else {
      return this.open > 0;
    }
  }

  /*
   * set open state (from toggler)
  */
  private set isOpen(value: boolean) {
    this._isOpen = value;
  }

  /*
   * is this a date string?
  */
  private get isDate(): boolean {
    return (this.type === 'string') &&
      (DATE_STRING_REGEX.test(this.json) ||
      JSON_DATE_REGEX.test(this.json) ||
      PARTIAL_DATE_REGEX.test(this.json));
  }

  /*
   * is this a URL string?
  */
  private get isUrl(): boolean {
    return this.type === 'string' && (this.json.indexOf('http') === 0);
  }

  /*
   * is this an array?
  */
  private get isArray(): boolean {
    return Array.isArray(this.json);
  }

  /*
   * is this an object?
   * Note: In this context arrays are object as well
  */
  private get isObject(): boolean {
    return isObject(this.json);
  }

  /*
   * is this an empty object with no properties?
  */
  private get isEmptyObject(): boolean {
    return !this.keys.length && !this.isArray;
  }

  /*
   * is this an empty object or array?
  */
  private get isEmpty(): boolean {
    return this.isEmptyObject || (this.keys && !this.keys.length && this.isArray);
  }

  /*
   * did we recieve a key argument?
   * This means that the formatter was called as a sub formatter of a parent formatter
  */
  private get hasKey(): boolean {
    return typeof this.key !== 'undefined';
  }

  /*
   * if this is an object, get constructor function name
  */
  private get constructorName(): string {
    return getObjectName(this.json);
  }

  /*
   * get type of this value
   * Possible values: all JavaScript primitive types plus "array" and "null"
  */
  private get type(): string {
    return getType(this.json);
  }

  /*
   * get object keys
   * If there is an empty key we pad it wit quotes to make it visible
  */
  private get keys(): string[] {
    if (this.isObject) {
      return Object.keys(this.json).map((key)=> key ? key : '""');
    } else {
      return [];
    }
  }

  /**
   * Toggles `isOpen` state
   *
  */
  toggleOpen() {
    if(this.isOpen) {
      this.doClose();
    } else {
      this.doOpen();
    }
  }

  doOpen(finished: Function = null) {
    if(this.isOpen) {
      if(finished) {
        finished();
      }
      return;
    }
    this.isOpen = true;
    if(!this.element) {
      if(finished) {
        finished();
      }
      return;
    }
    this.appendChildren(this.config.animateOpen, finished);
    this.element.classList.add(cssClass('open'));
    if(this.expandLink) {
      this.expandLink.style.display = 'none';
    }
  }

  doClose(finished: Function = null) {
    if(!this.isOpen) {
      if(finished) {
        finished();
      }
      return;
    }
    this.isOpen = false;
    if(!this.element) {
      if(finished) {
        finished();
      }
      return;
    }
    this.removeChildren(this.config.animateClose, finished);
    this.element.classList.remove(cssClass('open'));
    if(this.expandLink) {
      this.expandLink.style.display = '';
    }
  }

  /**
   * Expands the element and its children
   *
   */
  doExpand() {
    if(!this.isOpen) {
      if(this.expandLink) {
        this.expandLink.style.display = 'none';
      }
      this.isOpen = false;
      const open = this.open;
      this.open = 100;
      this.doOpen();
      this.open = open;
    }

  }

  /**
  * Open all children up to a certain depth.
  * Allows actions such as expand all/collapse all
  *
  */
  openAtDepth(depth = 1) {
    if (depth < 0) {
      return;
    }

    this.open = depth;
    this.isOpen = (depth !== 0);

    if (this.element) {
      this.removeChildren(false);

      if (depth === 0) {
        this.element.classList.remove(cssClass('open'));
      } else {
        this.appendChildren(this.config.animateOpen);
        this.element.classList.add(cssClass('open'));
      }
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
      const ellipsis = keys.length >= this.config.hoverPreviewFieldCount ? '…' : '';

      return `{${kvs.join(', ')}${ellipsis}}`;
    }
  }


  /**
   * Renders an HTML element and installs event listeners
   *
   * @returns {HTMLDivElement}
  */
  render(): HTMLDivElement {
    this.children = [];

    // construct the root element and assign it to this.element
    this.element = createElement('div', 'row');

    // construct the toggler link
    const togglerLink = createElement('a', 'toggler-link');

    // if this is an object we need a wrapper span (toggler)
    if (this.isObject) {
      togglerLink.appendChild(createElement('span', 'toggler'));
    }

    // if this is child of a parent formatter we need to append the key
    if (this.hasKey) {
      togglerLink.appendChild(createElement('span', 'key', this.renderHighlighted(`${this.key}:`)));
    }

    // Value for objects and arrays
    if (this.isObject) {

      // construct the value holder element
      const value = createElement('span', 'value');

      // we need a wrapper span for objects
      const objectWrapperSpan = createElement('span');

      // get constructor name and append it to wrapper span
      const constructorName = createElement('span', 'constructor-name', this.constructorName);
      objectWrapperSpan.appendChild(constructorName);

      // if it's an array append the array specific elements like brackets and length
      if (this.isArray) {
        const arrayWrapperSpan = createElement('span');
        arrayWrapperSpan.appendChild(createElement('span', 'bracket', '['));
        arrayWrapperSpan.appendChild(createElement('span', 'number', (this.json.length)));
        arrayWrapperSpan.appendChild(createElement('span', 'bracket', ']'));
        objectWrapperSpan.appendChild(arrayWrapperSpan);
      }

      // append object wrapper span to toggler link
      value.appendChild(objectWrapperSpan);
      togglerLink.appendChild(value);

    // Primitive values
    } else {

      // make a value holder element
      const value = this.isUrl ? createElement('a') : createElement('span');

      // add type and other type related CSS classes
      value.classList.add(cssClass(this.type));
      if (this.isDate) {
        value.classList.add(cssClass('date'));
      }
      if (this.isUrl) {
        value.classList.add(cssClass('url'));
        value.setAttribute('href', this.json);
      }

      // Append value content to value element
      const valuePreview = getValuePreview(this.json, this.json);
      value.appendChild(this.renderHighlighted(valuePreview));

      // append the value element to toggler link
      togglerLink.appendChild(value);
    }

    // if hover preview is enabled, append the inline preview element
    if (this.isObject && this.config.hoverPreviewEnabled) {
      const preview = createElement('span', 'preview-text');
      preview.appendChild(document.createTextNode(this.getInlinepreview()));
      togglerLink.appendChild(preview);
    }

    // construct a children element
    const children = createElement('div', 'children');

    // set CSS classes for children
    if (this.isObject) {
      children.classList.add(cssClass('object'));
    }
    if (this.isArray) {
      children.classList.add(cssClass('array'));
    }
    if (this.isEmpty) {
      children.classList.add(cssClass('empty'));
    }

    // set CSS classes for root element
    if (this.config && this.config.theme) {
      this.element.classList.add(cssClass(this.config.theme));
    }
    if (this.isOpen) {
      this.element.classList.add(cssClass('open'));
    }

    // append toggler and children elements to root element
    this.element.appendChild(togglerLink);

    if(this.config.expandButtonsEnabled && this.isObject) {
      this.expandLink = createElement('a', 'expand-link', this.config.expandButtonText) as HTMLAnchorElement;
      this.expandLink.href = 'javascript:';
      this.expandLink.addEventListener('click', this.doExpand.bind(this));
      if(this.isOpen) {
        this.expandLink.style.display = 'none';
      }
      this.element.appendChild(this.expandLink);

    }

    this.element.appendChild(children);

    // if formatter is set to be open call appendChildren
    if (this.isObject && this.isOpen) {
      this.appendChildren();
    }

    // add event listener for toggling
    if (this.isObject) {
      togglerLink.addEventListener('mousedown', function(e) {
        e.preventDefault();
      });
      togglerLink.addEventListener('click', this.toggleOpen.bind(this));
      togglerLink.addEventListener('dblclick', this.doExpand.bind(this));
    }

    return this.element as HTMLDivElement;
  }

  private renderHighlighted(text): Node {
    text = `${text}`;
    if(this.highlightedText === '' || !this.highlightedText) {
      return document.createTextNode(text);
    }
    const highlightPart = this.highlightedText.toLowerCase();
    const fullText = text.toLowerCase();
    const container = document.createDocumentFragment();
    let start = 0;
    do {
      const index = fullText.indexOf(highlightPart, start);
      if(index === -1) {
        container.appendChild(document.createTextNode(text.substring(start)));
        break;
      } else {
        container.appendChild(document.createTextNode(text.substring(start, index)));
        const hText = document.createElement('span');
        hText.className = cssClass('highlight');
        hText.appendChild(document.createTextNode(text.substr(index, highlightPart.length)));
        container.appendChild(hText);
        start = index + highlightPart.length;
      }

    } while(true);
    return container;
  }

  /**
   * Appends all the children to children element
   * Animated option is used when user triggers this via a click
  */
  appendChildren(animated: boolean = false, finishedCallback: Function = null) {
    const children = this.element.querySelector(`div.${cssClass('children')}`);

    if (!children || this.isEmpty) {
      if(finishedCallback) {
        finishedCallback();
      }
      return;
    }

    if (animated) {
      let index = 0;
      const addAChild = ()=> {
        const key = this.keys[index];
        const formatter = new JSONFormatter(this.json[key], this.open - 1, this.config, key);
        formatter.highlightedText = this.highlightedText;
        this.children.push(formatter);
        children.appendChild(formatter.render());

        index += 1;

        if (index < this.keys.length) {
          if (index > MAX_ANIMATED_TOGGLE_ITEMS) {
            addAChild();
          } else {
            requestAnimationFrame(addAChild);
          }
        } else if(finishedCallback) {
          finishedCallback();
        }
      };

      requestAnimationFrame(addAChild);

    } else {
      this.keys.forEach(key => {
        const formatter = new JSONFormatter(this.json[key], this.open - 1, this.config, key);
        formatter.highlightedText = this.highlightedText;
        this.children.push(formatter);
        children.appendChild(formatter.render());
      });
      if(finishedCallback) {
        finishedCallback();
      }
    }
  }

  /**
   * Removes all the children from children element
   * Animated option is used when user triggers this via a click
  */
  removeChildren(animated: boolean = false, finishedCallback: Function = null) {
    this.children = [];
    const childrenElement = this.element.querySelector(`div.${cssClass('children')}`) as HTMLDivElement;

    if (animated) {
      let childrenRemoved = 0;
      const removeAChild = ()=> {
        if (childrenElement && childrenElement.children.length) {
          childrenElement.removeChild(childrenElement.children[0]);
          childrenRemoved += 1;
          if (childrenRemoved > MAX_ANIMATED_TOGGLE_ITEMS) {
            removeAChild();
          } else {
            requestAnimationFrame(removeAChild);
          }
        } else if(finishedCallback) {
          finishedCallback();
        }
      };
      requestAnimationFrame(removeAChild);
    } else {
      if (childrenElement) {
        childrenElement.innerHTML = '';
      }
      if(finishedCallback) {
        finishedCallback();
      }
    }
  }

  /**
   * Returns a list of all opened paths
   */
  getOpenedPaths(parentPath = []) {
    const paths = [];
    if(!this.isObject) {
      if(parentPath.length) {
        paths.push(parentPath);
      }
      return paths;
    }
    const keys = Object.keys(this.json);
    this.children.forEach((child, i) => {
      const keyPath = parentPath.slice();
      keyPath.push(keys[i]);
      if(child.isObject) {
        paths.push(...child.getOpenedPaths(keyPath));
      }
    });
    if(this.children.length && !paths.length && parentPath.length) {
      paths.push(parentPath);
    }
    return paths;
  }

  /**
   * Opens a set of paths in the tree
   */
  openPaths(paths = [], finished: Function = null) {
    let index = 0;
    const openPath = () => {
      const path = paths[index++];
      this.openPath(path, () => {
        if(index < paths.length) {
          openPath();
        } else if(finished) {
          finished();
        }
      });
    };
    if(paths.length) {
      openPath();
    } else if(finished) {
      finished();
    }
  }

  /**
   * Opens a specified path in the tree
   */
  openPath(path = [], finished: Function = null) {
    if(!this.isObject) {
      if(finished) {
        finished();
      }
      return;
    }
    path = path.slice();
    const keyName = path.shift();
    const keys = Object.keys(this.json);
    const childIndex = keys.indexOf(keyName);
    if(childIndex !== -1 && this.children[childIndex]) {
      const child = this.children[childIndex];
      child.doOpen(() => {
        if(path.length) {
          child.openPath(path, finished);
        } else if(finished) {
          finished();
        }
      });
    } else if(finished) {
      finished();
    }
  }

  private reRender() {
    const currentElement = this.element;
    this.render();
    if(currentElement.parentNode) {
      currentElement.parentNode.replaceChild(this.element, currentElement);
    }
  }

  /**
   * Search the tree for a certain term (case insensitive).
   * The term will be highlighted at all found positions
   */
  searchTerm(term) {
    this.highlightedText = term;
    this.reRender();

    const paths = findPathsForTerm(this.json, term);
    this.openPaths(paths);

  }

}
