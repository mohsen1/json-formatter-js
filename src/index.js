'use strict';

/* globals JSONFormatter */

import template from 'lodash.template';
import {
  isObject,
  getObjectName,
  getType,
  getValuePreview,
  getPreview
} from './helpers.js';

export default class JSONFormatter {

  constructor(json, open, config, key) {
    this.json = json;
    this.key = key;
    this.open = open === undefined ? 1 : open;
    this.config = config || {};
    this.config.hoverPreviewEnabled = this.config.hoverPreviewEnabled === undefined ?
      false : this.config.hoverPreviewEnabled;
    this.config.hoverPreviewArrayCount = this.config.hoverPreviewArrayCount === undefined ?
      100 : this.config.hoverPreviewArrayCount;
    this.config.hoverPreviewFieldCount = this.config.hoverPreviewFieldCount === undefined ?
      5 : this.config.hoverPreviewFieldCount;

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
    this.isEmpty = this.isEmptyObject || (this.keys && !this.keys.length && this.isArray);
  }



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

  openLink() {
    if (typeof this.json === 'string') {
      window.location.href = this.json;
    }
  }

  parseValue(value){
    return getValuePreview(this.json, value);
  }

  showInlinePreview() {
    return !!this.config.hoverPreviewEnabled && this.isObject;
  }

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

  template() {
    const templateString = `
      <a class="toggler-link">
        <% if (this.isObject) { %>
          <span class="toggler"></span>
        <% } %>

        <% if (this.hasKey) { %>
          <span class="key">${this.key}:</span>
        <% } %>

        <span class="value">

          <% if (this.isObject) { %>
            <span>
              <span class="constructor-name">${this.onstructorName}</span>

              <% if (this.isArray) { %>
               <span><span class="bracket">[</span><span class="number"><%= this.json.length %></span><span class="bracket">]</span></span>
              <% } %>

            </span>
          <% } else if (!this.isObject) {%>
            <span class="${this.type} ${this.isDate ? 'date' : ''} ${this.isUrl? 'url' : ''}"><%= this.parseValue(this.json) %></span>
          <% } %>

        </span>

        <% if (this.showInlinePreview()) { %>
          <span class="preview-text">${this.getInlinepreview()}</span>
        <% } %>
      </a>

      <div class="children ${this.isObject ? 'object': ''} ${this.isArray ? 'array' : ''} ${this.isEmpty ? 'empty': ''}"></div>
    `;

    return template(templateString).call(this)
      .replace(/\s*\n/g, '\n'); // clean up empty lines
  }

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

    // add URL link event listener
    if (this.element.querySelector('span.url')) {
      this.element.querySelector('span.url')
        .addEventListener('click', this.openLink.bind(this));
    }

    return this.element;
  }

  appendChildern() {
    const children = this.element.querySelector('div.children');

    if (!children) { return; }

    this.keys.forEach((key)=> {
      const formatter = new JSONFormatter(this.json[key], this.open - 1, this.config, key);

      children.appendChild(formatter.render());
    });
  }

  removeChildren() {
    if (this.element.querySelector('div.children')) {
      this.element.querySelector('div.children').innerHTML = '';
    }
  }
}

// TODO: UMD
window.JSONFormatter = JSONFormatter;
