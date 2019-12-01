/*
 * Escapes `"` charachters from string
*/
function escapeString(str: string): string {
  return str.replace(/"/g, '\\"');
}

export function getType(value: any): string {
  if (value === null) { return 'null'; }
  return typeof value;
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
 * Generates inline preview for a JavaScript object based on a type and value
*/
export function getValuePreview (type: string, object: Object, value: string): string {
  if (type === 'null' || type === 'undefined') { return type; }

  if (type === 'string' || type === 'stringifiable') {
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
export function getPreview(object: any): string {
  let value = '';
  if (isObject(object)) {
    value = getObjectName(object);
    if (Array.isArray(object))
      value += '[' + object.length + ']';
  } else {
    value = getValuePreview(getType(object), object, object);
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
export function createElement(type: string, className?: string, content?: Element|string): Element {
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
