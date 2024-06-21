# JSON Formatter

> Render JSON objects in HTML with a **collapsible** navigation.

**Check out [`<pretty-json>` Custom Element](https://github.com/mohsen1/pretty-json) for a more portable and light solution**

## Usage

**[Live Demo](http://azimi.me/json-formatter-js/)**

Install via npm

```shell
npm install --save json-formatter-js
```

Include `json-formatter.js` from the `dist` folder in your page.

```js
import JSONFormatter from "json-formatter-js";

const myJSON = { ans: 42 };

const formatter = new JSONFormatter(myJSON);

document.body.appendChild(formatter.render());
```

## API

### `JSONFormatter(json [, open [, config] ])`

#### `json` (`Object`) - **required**

The JSON object you want to render. It has to be an object or array. Do NOT pass a raw JSON string.

#### `open` (`Number`)

Default: `1`
This number indicates up to how many levels the rendered tree should expand. Set it to `0` to make the whole tree collapsed or set it to `Infinity` to expand the tree deeply.

#### `config` (`Object`)

Default:

```js
{
  hoverPreviewEnabled: false,
  hoverPreviewArrayCount: 100,
  hoverPreviewFieldCount: 5,
  animateOpen: true,
  animateClose: true,
  theme: null,
  useToJSON: true,
  sortPropertiesBy: null,
  maxArrayItems: 100,
  exposePath: false
}
```

Available configurations:

##### Hover Preview

- `hoverPreviewEnabled`: enable preview on hover.
- `hoverPreviewArrayCount`: number of array items to show in preview. Any array larger than this number will be shown as `Array[XXX]` where `XXX` is the length of the array.
- `hoverPreviewFieldCount`: number of object properties to show for object preview. Any object with more properties than this number will be truncated.

##### Theme

- `theme`: a string that can be any of these options: `['dark']`. Look at [`src/style.less`](src/style.less) for making new themes.

##### Animation

- `animateOpen`: enable animation when expanding a JSON object. True by default.
- `animateClose`: enable animation when closing a JSON object. True by default.

##### Rendering Options

- `useToJSON`: use the `toJSON` method to render an object as a string, if available. Useful for objects like `Date` or Mongo's `ObjectID` that might make more sense as a string than as empty objects. True by default.
- `sortPropertiesBy`: use the given sorting function to deeply sort the object properties.
- `maxArrayItems`: use to split arrays into multiple smaller groups. This value defines the size of each group. If the length of the array is less than this number, no groups are created. It's the same behavior as the Webkit developer tool's console.
- `exposePath`: add an array of keys to each node dataset so it is possible to correlate nodes to the original JSON.

### `openAtDepth([depth])`

```js
const formatter = new JSONFormatter({ ... });
document.body.appendChild(formatter.render());
formatter.openAtDepth(3);
```

#### `depth` (`Number`)

Default: `1`
This number indicates up to how many levels the rendered tree should open. It allows use cases such as collapsing all levels (with value `0`) or expanding all levels (with value `Infinity`).

## Development

Install the dependencies:

```shell
npm install
```

Run the dev server:

```shell
npm run dev
```

### Running Tests

**Once:**

```shell
npm test
```

## License

[MIT](./LICENSE)
