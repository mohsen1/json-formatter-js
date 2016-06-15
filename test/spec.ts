'use strict';

declare const describe;
declare const it;
declare const expect;
declare const JSONFormatter;


describe('null', ()=> {
  it('should render "null"', ()=> {
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

  it('should assing date class to date string', ()=> {
    const formatter = new JSONFormatter('2015-12-05T18:58:53.727Z');
    expect(formatter.render().querySelector('.json-formatter-date')).not.to.be.null;
  });
});

describe('url string', ()=> {
  const formatter = new JSONFormatter('https://example.com');

  it('should render "https://example.com"', ()=> {
    expect(formatter.render().innerText).to.contain('"https://example.com"');
  });

  it('should make a link and add class "url"', ()=> {
    expect(formatter.render().querySelector('a.json-formatter-url')).not.to.equal(null);
  });
});