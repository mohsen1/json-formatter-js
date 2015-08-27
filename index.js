'use strict';

import template from 'lodash.template';
import isObject from 'lodash.isobject';
import {getObjectName, getType, getValuePreview, getPreview} from './helpers.js';

export default class JSONFormatter {

  constructor(json, open, key, config) {
    this.json = json;
    this.key = key;
    this.open = open;
    this.config = config || {
      hoverPreviewEnabled: false,
      hoverPreviewArrayCount: 100,
      hoverPreviewFieldCount: 5
    };

    this.type = getType(this.json);
    this.hasKey = typeof this.key !== 'undefined';

    // If 'open' attribute is present
    this.isOpen = !!this.open;

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

  }

  isArray() {
    return Array.isArray(this.json);
  }

  isObject() {
    return isObject(this.json);
  }

  getKeys(){
    if (this.isObject()) {
      return Object.keys(this.json).map(function(key) {
        if (key === '') { return '""'; }
        return key;
      });
    }
    return [];
  }

  getConstructorName(){
    return getObjectName(this.json);
  }

  isEmptyObject() {
    return this.getKeys() && !this.getKeys().length &&
      this.isOpen && !this.isArray();
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  childrenOpen() {
    if (this.open > 1){
      return this.open - 1;
    }
    return 0;
  }

  openLink(isUrl) {
    if(isUrl) {
      window.location.href = this.json;
    }
  }

  parseValue(value){
    return getValuePreview(this.json, value);
  }

  showThumbnail() {
    return !!this.config.hoverPreviewEnabled && this.isObject() && !this.isOpen;
  }

  getThumbnail() {
    if (this.isArray()) {

      // if array length is greater then 100 it shows "Array[101]"
      if (this.json.length > this.config.hoverPreviewArrayCount) {
        return 'Array[' + this.json.length + ']';
      } else {
        return '[' + this.json.map(getPreview).join(', ') + ']';
      }
    } else {

      var keys = this.getKeys();

      // the first five keys (like Chrome Developer Tool)
      var narrowKeys = keys.slice(0, this.config.hoverPreviewFieldCount);

      // json value schematic information
      var kvs = narrowKeys
        .map(function (key) { return key + ':' + getPreview(this.json[key]); });

      // if keys count greater then 5 then show ellipsis
      var ellipsis = keys.length >= 5 ? '…' : '';

      return '{' + kvs.join(', ') + ellipsis + '}';
    }
  }

  render() {
    const html = `
    <div class="json-formatter-row">
      <a>
        <% if (this.isObject()) { %>
          <span class="toggler ${this.isOpen ? 'open' : ''}"></span>
        <% } %>

        <% if (this.hasKey { %>
          <span class="key">${this.key}:</span>
        <% } %>

        <span class="value">

          <% if (this.isObject()) { %>
            <span>
              <span class="constructor-name">${this.getConstructorName(this.json)}</span>

              <% if (this.isArray()) { %>
               <span><span class="bracket">[</span><span class="number">${this.json.length}</span><span class="bracket">]</span></span>
              <% } %>

            </span>
          <% } else if (!this.isObject()) {%>
            <span class="{{type}}" class="${this.isDate ? 'date' : ''} ${this.isUrl? 'url' : ''}">{{this.parseValue(json)}}</span>
          <% } %>

        </span>

        <% if (this.showThumbnail()) { %>
          <span class="thumbnail-text">${this.getThumbnail()}</span>
        <% } %>
      </a>

      <% if (this.getKeys().length && this.isOpen()) { %>
        <div class="children"></div>
      <% } %>

      <% if (this.isEmptyObject()) { %>
        <div class="children empty object"></div>
      <% } %>

      <% if (this.getKeys() && !this.getKeys().length && this.isOpen && this.isArray())) { %>
        <div class="children empty array"></div>
      <% } %>
    </div>`;

    return template(html);
  }
}

// TODO: UMD
// window.JSONFormatter = JSONFormatter;
