'use strict';

var JSONFormatter = require('../dist/bundle.js');

var complex = {
  numbers: [1, 2, 3],
  boolean: true,
  'null': null,
  number: 123,
  anObject: {
    a: 'b',
    c: 'd',
    e: 'f\"'
  },
  string: 'Hello World',
  url: 'https://github.com/mohsen1/json-formatter',
  date: 'Sun Aug 03 2014 20:46:55 GMT-0700 (PDT)',
  func: function add(a,b){return a + b; }
};

var deep = {a:{b:{c:{d:{}}}}};

var examples = [
  {title: 'Complex', json: complex},
  {title: 'Number', json: 42},
  {title: 'null', json: null},
  {title: 'Empty Object', json: Object.create(null)},
  {title: 'Empty Array', json: []},
  {title: 'Deep', json: deep},
  {title: 'Dark', json: complex, config: {theme: 'dark'}}
];

var result = document.querySelector('.result');

examples.forEach(function(example) {
  var title = document.createElement('h3');
  var formatter = new JSONFormatter(example.json, 1, example.config);

  title.innerText = example.title;

  result.appendChild(title)
  var el = formatter.render();

  if (example.config && example.config.theme === 'dark') {
    el.style.backgroundColor = '#1E1E1E';
  }

  result.appendChild(el);
});

fetch('giant.json')
  .then(function(resp) {
    return resp.json();
  })
  .then(function(giant) {
    var giantFormatter = new JSONFormatter(giant, 2, {hoverPreviewEnabled: true});
    var title = document.createElement('h3');

    title.innerText = 'Giant JSON';
    result.appendChild(title);

    console.time('Rendering giant JSON');
    result.appendChild(giantFormatter.render());
    console.timeEnd('Rendering giant JSON');
  })
  .catch(alert);

