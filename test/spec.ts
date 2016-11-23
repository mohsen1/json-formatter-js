'use strict';

declare const describe;
declare const it;
declare const expect;
declare const JSONFormatter;


describe('null', () => {
    it('should render "null"', () => {
        const formatter = new JSONFormatter(null);

        expect(formatter.render().innerText).to.contain('null');
    });
});

describe('undefined', () => {
    it('should render "undefined"', () => {
        const formatter = new JSONFormatter(undefined);

        expect(formatter.render().innerText).to.contain('undefined');
    });
});

describe('object function constructor', () => {
    it('should output "Format"', () => {
        function Format() {
        }
        const obj = new Format();

        const formatter = new JSONFormatter(obj);
        expect(formatter.constructorName).to.equal('Format');
    });

    it('should output "BrokenFormat"', () => {
        const failConstructor = 'function BrokenFormat() {Object.assign(}';
        const funcNameRegex = /function ([^(]*)/;
        const results = (funcNameRegex).exec(failConstructor.toString());
        expect(results[1]).to.equal('BrokenFormat');
    });
});


describe('function', () => {
    it('should render the function', () => {
        const formatter = new JSONFormatter(function add(a, b) {
            return a + b;
        });
        const elementText = formatter.render().innerText;

        expect(elementText).to.contain('function');
        expect(elementText).to.contain('add');
        expect(elementText).to.contain('(a, b)');
        expect(elementText.trim().match(/function\s[^\(]*\([^\)]*\)\s*(.*)/)[1]).to.equal('{…}');
    });
});

describe('string', () => {
    it('should render "Hello World!"', () => {
        const formatter = new JSONFormatter('Hello World!');

        expect(formatter.render().innerText).to.contain('Hello World');
    });
});

describe('date string', () => {
    const formatter = new JSONFormatter(new Date(0).toString());

    it('should render "' + (new Date(0)).toString() + '"', () => {
        expect(formatter.render().innerText).to.contain('"' + (new Date(0)).toString() + '"');
    });

    it('should assing date class to date string', () => {
        const formatter = new JSONFormatter('2015-12-05T18:58:53.727Z');
        expect(formatter.render().querySelector('.json-formatter-date')).not.to.be.null;
    });
});

describe('url string', () => {
    const formatter = new JSONFormatter('https://example.com');

    it('should render "https://example.com"', () => {
        expect(formatter.render().innerText).to.contain('"https://example.com"');
    });

    it('should make a link and add class "url"', () => {
        expect(formatter.render().querySelector('a.json-formatter-url')).not.to.equal(null);
    });
});

describe('openAtDepth after rendering', () => {
    const formatter = new JSONFormatter({depth1: {depth2: {depth3: {depth4: 21}}}}, Infinity, {
        animateOpen: false,
        animateClose: false
    });
    const element = formatter.render();

    it('should open at depth 1', () => {
        formatter.openAtDepth();
        expect(element.outerHTML).to.contain('depth1');
        expect(element.outerHTML).to.not.contain('depth2');
        expect(element.outerHTML).to.not.contain('depth3');
        expect(element.outerHTML).to.not.contain('depth4');
    });

    it('should collapses all', () => {
        formatter.openAtDepth(0);
        expect(element.outerHTML).to.not.contain('depth1');
    });

    it('should expand all', () => {
        formatter.openAtDepth(Infinity);
        expect(element.outerHTML).to.contain('depth1');
        expect(element.outerHTML).to.contain('depth2');
        expect(element.outerHTML).to.contain('depth3');
        expect(element.outerHTML).to.contain('depth4');
        expect(element.outerHTML).to.contain('21');
    });
});

describe('openAtDepth before any rendering', () => {
    const formatter = new JSONFormatter({depth1: {depth2: {depth3: {depth4: 21}}}}, Infinity, {
        animateOpen: false,
        animateClose: false
    });

    it('should open at depth 1', () => {
        formatter.openAtDepth();
        const element = formatter.render();
        expect(element.outerHTML).to.contain('depth1');
        expect(element.outerHTML).to.not.contain('depth2');
        expect(element.outerHTML).to.not.contain('depth3');
        expect(element.outerHTML).to.not.contain('depth4');
    });
});

describe('toggleOpen after rendering', () => {

    it('should toggle', () => {
        const formatter = new JSONFormatter({depth1: {depth2: {depth3: {depth4: 21}}}}, Infinity, {
            animateOpen: false,
            animateClose: false
        });
        const element = formatter.render();

        expect(element.outerHTML).to.contain('Object');
        expect(element.outerHTML).to.contain('depth1');

        formatter.toggleOpen();

        expect(element.outerHTML).to.contain('Object');
        expect(element.outerHTML).to.not.contain('depth1');
        expect(element.outerHTML).to.not.contain('depth2');
        expect(element.outerHTML).to.not.contain('depth3');
        expect(element.outerHTML).to.not.contain('depth4');
    });
});

describe('toggleOpen before any rendering', () => {
    it('should toggle', () => {
        const formatter = new JSONFormatter({depth1: {depth2: {depth3: {depth4: 21}}}}, Infinity, {
            animateOpen: false,
            animateClose: false
        });
        formatter.toggleOpen();
        const element = formatter.render();
        expect(element.outerHTML).to.contain('Object');
        expect(element.outerHTML).to.not.contain('depth1');
        expect(element.outerHTML).to.not.contain('depth2');
        expect(element.outerHTML).to.not.contain('depth3');
        expect(element.outerHTML).to.not.contain('depth4');
    });
});
