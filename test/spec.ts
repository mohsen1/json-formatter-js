'use strict';
import { default as JSONFormatter } from '../src/index';

describe('null', () => {
    it('should render "null"', () => {
        const formatter = new JSONFormatter(null);
        const el = formatter.render();
        expect(el.textContent).toContain('null');
    });
});

describe('undefined', () => {
    it('should render "undefined"', () => {
        const formatter = new JSONFormatter(undefined);

        expect(formatter.render().textContent).toContain('undefined');
    });
});

describe('object function constructor', () => {
    it('should output "Format"', () => {
        function Format() {
        }
        const obj = new Format();

        const formatter = new JSONFormatter(obj);
        expect(formatter['constructorName']).toEqual('Format');
    });

    it('should output "BrokenFormat"', () => {
        const failConstructor = 'function BrokenFormat() {Object.assign(}';
        const funcNameRegex = /function ([^(]*)/;
        const results = (funcNameRegex).exec(failConstructor.toString());
        expect(results[1]).toEqual('BrokenFormat');
    });
});


describe('function', () => {
    it('should render the function', () => {
        const formatter = new JSONFormatter(function add(a, b) {
            return a + b;
        });
        const elementText = formatter.render().textContent;

        expect(elementText).toContain('function');
        expect(elementText).toContain('add');
        expect(elementText).toContain('(a, b)');
        expect(elementText.trim().match(/function\s[^\(]*\([^\)]*\)\s*(.*)/)[1]).toEqual('{…}');
    });
});

describe('string', () => {
    it('should render "Hello World!"', () => {
        const formatter = new JSONFormatter('Hello World!');

        expect(formatter.render().textContent).toContain('Hello World');
    });
});

describe('date string', () => {
    const formatter = new JSONFormatter(new Date(0).toString());

    it('should render "' + (new Date(0)).toString() + '"', () => {
        expect(formatter.render().textContent).toContain('"' + (new Date(0)).toString() + '"');
    });

    it('should assing date class to date string', () => {
        const formatter = new JSONFormatter('2015-12-05T18:58:53.727Z');
        expect(formatter.render().querySelector('.json-formatter-date')).not.toBeNull();
    });
});

describe('url string', () => {
    const formatter = new JSONFormatter('https://example.com');

    it('should render "https://example.com"', () => {
        expect(formatter.render().textContent).toContain('"https://example.com"');
    });

    it('should make a link and add class "url"', () => {
        expect(formatter.render().querySelector('a.json-formatter-url')).not.toEqual(null);
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
        expect(element.outerHTML).toContain('depth1');
        expect(element.outerHTML).not.toContain('depth2');
        expect(element.outerHTML).not.toContain('depth3');
        expect(element.outerHTML).not.toContain('depth4');
    });

    it('should collapses all', () => {
        formatter.openAtDepth(0);
        expect(element.outerHTML).not.toContain('depth1');
    });

    it('should expand all', () => {
        formatter.openAtDepth(Infinity);
        expect(element.outerHTML).toContain('depth1');
        expect(element.outerHTML).toContain('depth2');
        expect(element.outerHTML).toContain('depth3');
        expect(element.outerHTML).toContain('depth4');
        expect(element.outerHTML).toContain('21');
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
        expect(element.outerHTML).toContain('depth1');
        expect(element.outerHTML).not.toContain('depth2');
        expect(element.outerHTML).not.toContain('depth3');
        expect(element.outerHTML).not.toContain('depth4');
    });
});

describe('toggleOpen after rendering', () => {

    it('should toggle', () => {
        const formatter = new JSONFormatter({depth1: {depth2: {depth3: {depth4: 21}}}}, Infinity, {
            animateOpen: false,
            animateClose: false
        });
        const element = formatter.render();

        expect(element.outerHTML).toContain('Object');
        expect(element.outerHTML).toContain('depth1');

        const openedPaths = formatter.getOpenedPaths();
        expect(openedPaths.length).toBe(1);
        expect(openedPaths[0].length).toBe(3);
        expect(openedPaths[0][0]).toBe('depth1');
        expect(openedPaths[0][1]).toBe('depth2');
        expect(openedPaths[0][2]).toBe('depth3');

        formatter.toggleOpen();

        expect(element.outerHTML).toContain('Object');
        expect(element.outerHTML).not.toContain('depth1');
        expect(element.outerHTML).not.toContain('depth2');
        expect(element.outerHTML).not.toContain('depth3');
        expect(element.outerHTML).not.toContain('depth4');

        const openedPathsClosed = formatter.getOpenedPaths();
        expect(openedPathsClosed.length).toBe(0);
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
        expect(element.outerHTML).toContain('Object');
        expect(element.outerHTML).not.toContain('depth1');
        expect(element.outerHTML).not.toContain('depth2');
        expect(element.outerHTML).not.toContain('depth3');
        expect(element.outerHTML).not.toContain('depth4');
    });
});

describe('openPaths', () => {
  it('should open paths', () => {
    const formatter = new JSONFormatter({
      elem1: {
        part1: 1,
        part2: 2
      },
      elem2: [
        {part3: 3},
        {part4: 4}
      ]
    }, 1, {
      animateOpen: false,
      animateClose: false
    });

    const element = formatter.render();

    formatter.openPaths([
      ['elem1'],
      ['elem2', '1']
    ]);

    expect(element.outerHTML).toContain('Object');
    expect(element.outerHTML).toContain('elem1');
    expect(element.outerHTML).toContain('part1');
    expect(element.outerHTML).toContain('part2');

    expect(element.outerHTML).toContain('elem2');
    expect(element.outerHTML).not.toContain('part3');
    expect(element.outerHTML).toContain('part4');

  });
});
