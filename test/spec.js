'use strict';

// import {expect} from 'chai';

// import JSONFormatter from '../index.js';

describe('rendering', ()=> {
  describe('null', ()=> {
    it('should render "null"', function () {
      const element = new JSONFormatter(null);

      expect(element.render().innerText).to.contain('null');
    });
  });
});

  // describe('undefined', function(){
  //   it('should render "undefined"', function () {
  //     element = createDirective('_undefined');
  //     expect(element.text()).toContain('undefined');
  //   });
  // });

  // describe('function', function(){
  //   it('should render the function', function () {
  //     element = createDirective('_function');
  //     expect(element.text()).toContain('function');
  //     expect(element.text()).toContain('add');
  //     expect(element.text()).toContain('(a, b)');
  //     expect(element.text().trim().match(/function\s[^\(]*\([^\)]*\)\s*(.*)/)[1]).toBe('{…}');
  //   });
  // });

  // describe('promiseFunction', function(){
  //   it('should render the function', function () {
  //     element = createDirective('promiseFunction');
  //     expect(element.text()).toContain('function');
  //     expect(element.text()).toContain('getAdd');
  //     expect(element.text()).toContain('(service, a)');
  //     expect(element.text().trim().match(/function\s[^\(]*\([^\)]*\)\s*(.*)/)[1]).toBe('{…}');
  //   });
  // });

  // describe('string', function(){
  //   it('should render "Hello world!"', function () {
  //     element = createDirective('string');
  //     expect(element.text()).toContain('"Hello world!"');
  //   });
  // });

  // describe('date string', function(){
  //   beforeEach(function(){
  //     element = createDirective('date');
  //   });
  //   it('should render "' + (new Date(0)).toString() + '"', function () {
  //     expect(element.text()).toContain('"' + (new Date(0)).toString() + '"');
  //   });
  //   it('should add "date" class to string', function() {
  //     expect(element.find('span.date').length).toBe(1);
  //   });
  // });

  // describe('url string', function(){
  //   beforeEach(function(){
  //     element = createDirective('url');
  //   });
  //   it('should render "https://example.com"', function () {
  //     expect(element.text()).toContain('"https://example.com"');
  //   });
  //   it('should add "url" class to string', function() {
  //     expect(element.find('span.url').length).toBe(1);
  //   });
  // });

  // describe('empty object', function(){
  //   testEmptyObject('emptyObject');
  // });

  // describe('empty object without prototype: Object.create(null)', function(){
  //   testEmptyObject('emptyObjectWithoutPrototype');
  // });

  // // DRY for testing empty objects
  // function testEmptyObject(key) {
  //   describe('with open="0"', function() {
  //     beforeEach(function(){
  //       element = createDirective(key);
  //     });
  //     it('should render "Object"', function() {
  //       expect(element.text()).toContain('Object');
  //     });
  //   });
  //   describe('with open="1"', function() {
  //     beforeEach(function(){
  //       element = createDirective(key, 1);
  //     });
  //     it('should render "Object"', function() {
  //       expect(element.text()).toContain('Object');
  //     });
  //     it('should render have toggler opened', function() {
  //       expect(element.find('.toggler').hasClass('open')).toBe(true);
  //     });
  //   });
  // }

  // describe('object with empty key', function(){
  //   beforeEach(function(){
  //     element = createDirective('objectWithEmptyKey', 1);
  //   });

  //   it('should render "" for key', function(){
  //     debugger
  //     expect(element.find('.key').text()).toContain('""');
  //   });
  // });

  // describe('empty array', function(){
  //   beforeEach(function(){
  //     element = createDirective('emptyArray');
  //   });
  //   it('should render "Array"', function(){
  //     expect(element.text()).toContain('Array');
  //   });
  //   it('should have brackets and length: [0]', function(){
  //     expect(element.text()).toContain('[0]');
  //   });
  // });

  // describe('array', function(){
  //   beforeEach(function(){
  //     element = createDirective('array');
  //   });
  //   it('should render "Array"', function(){
  //     expect(element.text()).toContain('Array');
  //   });
  //   it('should have brackets and length: [3]', function(){
  //     expect(element.text()).toContain('[3]');
  //   });
  // });

  // describe('object', function(){
  //   beforeEach(function(){
  //     element = createDirective('simpleObject');
  //   });
  //   it('should render "Object"', function(){
  //     expect(element.text()).toContain('Object');
  //   });
  //   it('should open when clicking on "Object"', function(){
  //     element.find('.constructor-name').click();
  //     expect(element.find('.toggler').hasClass('open')).toBe(true);
  //   });
  // });

  // describe('hover preview', function() {

  //   it('default is disabled', function () {
  //     element = createDirective('mixArray');
  //     expect(element.find('.thumbnail-text').length).toBe(0);
  //   });

  //   describe('set enable', function () {
  //     beforeEach(function () {
  //       JSONFormatterConfig.hoverPreviewEnabled = true;
  //     });

  //     it('should render "simple object"', function () {
  //       element = createDirective('simpleObject', 0);
  //       expect(element.find('.thumbnail-text').text().trim()).toBe('{me:1}');
  //     });

  //     it('should render "longer object"', function () {
  //       element = createDirective('longerObject', 0);
  //       expect(element.find('.thumbnail-text').text().trim()).toBe('{numbers:Array[3], boolean:true, null:null, number:123, anObject:Object…}');
  //     });

  //     it('should render "array"', function () {
  //       element = createDirective('array', 0);
  //       expect(element.find('.thumbnail-text').text().trim()).toBe('["one", "two", "three"]');
  //     });

  //     it('should render "mixArray"', function () {
  //       element = createDirective('mixArray', 0);
  //       expect(element.find('.thumbnail-text').text().trim()).toBe('[1, "2", Object]');
  //     });
  //   });

// });