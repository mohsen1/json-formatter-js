'use strict';

// import {expect} from 'chai';

// import JSONFormatter from '../index.js';

describe('rendering', ()=> {
  describe('null', ()=> {
    it('should render "null"', function () {
      const formatter = new JSONFormatter(null);

      expect(formatter.render().innerText).to.contain('null');
    });
  });

  describe('undefined', ()=> {
    it('should render "undefined"', ()=> {
      const formatter = new JSONFormatter(undefined);

      expect(formatter.render().innerText).to.contain('undefined');
    });
  });

  describe('function', ()=> {
    it('should render the function', ()=> {
      const formatter = new JSONFormatter(function add(a, b) { return a + b; });
      const elementText = formatter.render().innerText;

      expect(elementText).to.contain('function');
      expect(elementText).to.contain('add');
      expect(elementText).to.contain('(a, b)');
      expect(elementText.trim().match(/function\s[^\(]*\([^\)]*\)\s*(.*)/)[1]).to.equal('{…}');
    });
  });

  describe('string', ()=> {
    it('should render "Hello World!"', ()=> {
      const formatter = new JSONFormatter('Hello World!');

      expect(formatter.render().innerText).to.contain('Hello World');
    });
  });

  describe('date string', ()=> {
    const formatter = new JSONFormatter(new Date(0).toString());

    it('should render "' + (new Date(0)).toString() + '"', ()=> {
      expect(formatter.render().innerText).to.contain('"' + (new Date(0)).toString() + '"');
    });

    it('add the "date" class', ()=> {

      expect(formatter.render().querySelector('.date')).not.to.equal(null);
    });
  });

  describe('url string', function(){
    const formatter = new JSONFormatter('https://example.com');

    it('should render "https://example.com"', function () {
      expect(formatter.render().innerText).to.contain('"https://example.com"');
    });

    it('should make a link and add class "url"', function() {
      expect(formatter.render().querySelector('a.url')).not.to.equal(null);
    });
  });

});


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
  //       expect(formatter.render().innerText).to.contain('Object');
  //     });
  //   });
  //   describe('with open="1"', function() {
  //     beforeEach(function(){
  //       element = createDirective(key, 1);
  //     });
  //     it('should render "Object"', function() {
  //       expect(formatter.render().innerText).to.contain('Object');
  //     });
  //     it('should render have toggler opened', function() {
  //       expect(element.find('.toggler').hasClass('open')).to.equal(true);
  //     });
  //   });
  // }

  // describe('object with empty key', function(){
  //   beforeEach(function(){
  //     element = createDirective('objectWithEmptyKey', 1);
  //   });

  //   it('should render "" for key', function(){
  //     debugger
  //     expect(element.find('.key').text()).to.contain('""');
  //   });
  // });

  // describe('empty array', function(){
  //   beforeEach(function(){
  //     element = createDirective('emptyArray');
  //   });
  //   it('should render "Array"', function(){
  //     expect(formatter.render().innerText).to.contain('Array');
  //   });
  //   it('should have brackets and length: [0]', function(){
  //     expect(formatter.render().innerText).to.contain('[0]');
  //   });
  // });

  // describe('array', function(){
  //   beforeEach(function(){
  //     element = createDirective('array');
  //   });
  //   it('should render "Array"', function(){
  //     expect(formatter.render().innerText).to.contain('Array');
  //   });
  //   it('should have brackets and length: [3]', function(){
  //     expect(formatter.render().innerText).to.contain('[3]');
  //   });
  // });

  // describe('object', function(){
  //   beforeEach(function(){
  //     element = createDirective('simpleObject');
  //   });
  //   it('should render "Object"', function(){
  //     expect(formatter.render().innerText).to.contain('Object');
  //   });
  //   it('should open when clicking on "Object"', function(){
  //     element.find('.constructor-name').click();
  //     expect(element.find('.toggler').hasClass('open')).to.equal(true);
  //   });
  // });

  // describe('hover preview', function() {

  //   it('default is disabled', function () {
  //     element = createDirective('mixArray');
  //     expect(element.find('.thumbnail-text').length).to.equal(0);
  //   });

  //   describe('set enable', function () {
  //     beforeEach(function () {
  //       JSONFormatterConfig.hoverPreviewEnabled = true;
  //     });

  //     it('should render "simple object"', function () {
  //       element = createDirective('simpleObject', 0);
  //       expect(element.find('.thumbnail-text').text().trim()).to.equal('{me:1}');
  //     });

  //     it('should render "longer object"', function () {
  //       element = createDirective('longerObject', 0);
  //       expect(element.find('.thumbnail-text').text().trim()).to.equal('{numbers:Array[3], boolean:true, null:null, number:123, anObject:Object…}');
  //     });

  //     it('should render "array"', function () {
  //       element = createDirective('array', 0);
  //       expect(element.find('.thumbnail-text').text().trim()).to.equal('["one", "two", "three"]');
  //     });

  //     it('should render "mixArray"', function () {
  //       element = createDirective('mixArray', 0);
  //       expect(element.find('.thumbnail-text').text().trim()).to.equal('[1, "2", Object]');
  //     });
  //   });

// });