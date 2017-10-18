var JSONFormatter = require('../dist/json-formatter.js').default;

var live = document.getElementById('live');
var hoverPreviewEnabledCheckbox = document.getElementById('hoverPreviewEnabled');

function render() {
    live.style.backgroundColor = 'transparent';
    var result = document.getElementById('live-result');
    try {
        var formatter = new JSONFormatter(JSON.parse(live.value), 1, { hoverPreviewEnabled: hoverPreviewEnabledCheckbox.checked });
        result.innerHTML = '';
        result.appendChild(formatter.render());
    } catch (e) {
        live.style.backgroundColor = 'rgba(255, 87, 34, 0.35)';
    }
}
live.addEventListener('keyup', render);
hoverPreviewEnabledCheckbox.addEventListener('change', render);
render();


var complex = {
    numbers: [
        1,
        2,
        3
    ],
    boolean: true,
    'null': null,
    number: 123,
    anObject: {
        a: 'b',
        c: 'd',
        e: 'f\"'
    },
    string: 'Hello World',
    url: 'https://github.com/mohsen1/json-formatter-js',
    date: 'Sun Aug 03 2014 20:46:55 GMT-0700 (PDT)',
    func: function add(a, b) { return a + b; }
};

var deep = { a: { b: { c: { d: {} } } } };

var examples = [
    { title: 'Complex', json: complex, config: { expandButtonsEnabled: true } },
    { title: 'Number', json: 42 },
    { title: 'null', json: null },
    { title: 'Empty Object', json: Object.create(null) },
    { title: 'Empty Array', json: [] },
    { title: 'Deep', json: deep },
    { title: 'Dark', json: complex, config: { theme: 'dark',  expandButtonsEnabled: true } }
];

var result = document.querySelector('.result');

examples.forEach(function (example) {
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

(function(){
  var data = {
    elem1: {
      part1: 1,
      part2: {
        partA: 'hello term text',
        partB: 'comm'
      }
    },
    elem2: [
      {part3: 3},
      {part4: 'text'},
      {text: 342},
      {zzzText: 342}
    ]
  };
  var title = document.createElement('h3');
  var formatter = new JSONFormatter(data, 1, { expandButtonsEnabled: true });

  title.innerText = 'Open paths example';
  result.appendChild(title);
  var el = formatter.render();
  result.appendChild(el);

  var openButton = document.createElement('a');
  openButton.href = 'javascript:';
  openButton.innerText = 'Open path elem2 -> 1';
  openButton.addEventListener('click', function(){
    formatter.openPaths([
      ['elem2', '1']
    ]);
  });
  result.appendChild(openButton);

  var searchBox = document.createElement('div');
  var searchField = document.createElement('input');
  searchField.type = 'text';
  searchField.placeholder = 'Search term';
  searchField.addEventListener('keyup', () => {
    formatter.searchTerm(searchField.value);
  });
  searchBox.appendChild(searchField);
  result.appendChild(searchBox);

})();


fetch('demo/giant.json').then(function (resp) {
    resp.json().then(function (giant) {
        var giantFormatter = new JSONFormatter(giant, 2, { hoverPreviewEnabled: true });
        var title = document.createElement('h3');

        title.innerText = 'Giant JSON';
        result.appendChild(title);

        console.time('Rendering giant JSON');
        result.appendChild(giantFormatter.render());
        console.timeEnd('Rendering giant JSON');
    });
})