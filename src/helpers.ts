/*
 * Escapes `"` charachters from string
*/
function escapeString(str: string): string {
  return str.replace('"', '\"');
}

/*
 * Determines if a value is an object
*/
export function isObject(value: any): boolean {
  var type = typeof value;
  return !!value && (type == 'object');
}

/*
 * Gets constructor name of an object.
 * From http://stackoverflow.com/a/332429
 *
*/
export function getObjectName(object: Object):string {
  if (object === undefined) {
    return '';
  }
  if (object === null) {
    return 'Object';
  }
  if (typeof object === 'object' && !object.constructor) {
      return 'Object';
  }

  const funcNameRegex = /function ([^(]*)/;
  const results = (funcNameRegex).exec((object).constructor.toString());
  if (results && results.length > 1) {
    return results[1];
  } else {
    return '';
  }
}

/*
 * Gets type of an object. Returns "null" for null objects
*/
export function getType(object: Object): string {
  if (object === null) { return 'null'; }
  return typeof object;
}

/*
 * Generates inline preview for a JavaScript object based on a value
*/
export function getValuePreview (object: Object, value: string): string {
  var type = getType(object);

  if (type === 'null' || type === 'undefined') { return type; }

  if (type === 'string') {
    value = '"' + escapeString(value) + '"';
  }
  if (type === 'function'){

    // Remove content of the function
    return object.toString()
        .replace(/[\r\n]/g, '')
        .replace(/\{.*\}/, '') + '{…}';
  }
  return value;
}

/*
 * Generates inline preview for a JavaScript object
*/
export function getPreview(object: string): string {
  let value = '';
  if (isObject(object)) {
    value = getObjectName(object);
    if (Array.isArray(object))
      value += '[' + object.length + ']';
  } else {
    value = getValuePreview(object, object);
  }
  return value;
}

/*
 * Generates a prefixed CSS class name
*/
export function cssClass(className:string): string {
  return `json-formatter-${className}`;
}

/*
  * Creates a new DOM element wiht given type and class
  * TODO: move me to helpers
*/
export function createElement(type: string, className?: string, content?: Node|string): Element {
  const el = document.createElement(type);
  if (className) {
    el.classList.add(cssClass(className));
  }
  if (content !== undefined) {
    if (content instanceof Node) {
      el.appendChild(content);
    } else {
      el.appendChild(document.createTextNode(String(content)));
    }
  }
  return el;
}

export function findPathsForTerm(json, term, basePath = []): string[][] {
  const searchTerm = term.toLowerCase();
  const containsTerm = (text) => {
    text = `${text}`;
    return text.toLowerCase().indexOf(searchTerm) !== -1;
  };
  const paths = [];
  if(searchTerm === '') {
    return paths;
  }
  if(isObject(json)) {
    const keys = Object.keys(json);
    keys.forEach(key => {
      if(containsTerm(key) && paths.indexOf(basePath) === -1) {
        paths.push(basePath);
      }
      const path = basePath.slice();
      path.push(key);
      paths.push(...findPathsForTerm(json[key], term, path));
    });

  } else {
    const value = getValuePreview(json, json);
    if(containsTerm(value)) {
      paths.push(basePath);
    }
  }
  return paths;
}