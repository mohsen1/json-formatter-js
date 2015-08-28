# JSON Formatter (Pure JavaScript)

> Render JSON objects in HTML with a **collapsible** navigation.

JSON Formatter started as an [AngularJS directive](https://github.com/mohsen1/json-formatter). This is pure JavaScript implementation of the same module.


### Usage

Install via npm

```shell
npm install --save json-formatter-js
```
include `bundle.js` and `style.css` from `dist` folder in your page.
```js
import JSONFormatter from 'json-formatter-js'

const myJSON = {ans: 42};

const formatter = new JSONFormatter(myJSON);

document.body.appendChild(formatter.render());

```

### API

#### `JSONFormatter(json [, open [, config] ])`

##### `json` (`Object`) - **required**
The JSON object you want to render. It has to be an object or array. Do NOT pass raw JSON string.
##### `open` (`Number`)
Default: `1`
This number indicates up to how many levels the rendered tree should expand. Set it to `0` to make the whole tree collapsed or set it to `Infinity` to expand the tree deeply
##### `config` (`Object`)
Default:
```js
{
  hoverPreviewEnabled: false,
  hoverPreviewArrayCount: 100,
  hoverPreviewFieldCount: 5
}
```
Available configurations:
#####Hover Preview
* `hoverPreviewEnabled`:  enable preview on hover
* `hoverPreviewArrayCount`: number of array items to show in preview Any array larger than this number will be shown as `Array[XXX]` where `XXX` is length of the array.
* `hoverPreviewFieldCount`: number of object properties to show for object preview. Any object with more properties that thin number will be truncated.

### Development
Install `gulp` and run `gulp serve` to start the server that serves the development version of the project.

#### Running tests

**Once:**
```shell
npm test
```

**Continues:**
```shell
gulp test
```


### License
[MIT](./LICENSE)