import './style.less';
export interface JSONFormatterConfiguration {
    hoverPreviewEnabled?: boolean;
    hoverPreviewArrayCount?: number;
    hoverPreviewFieldCount?: number;
    animateOpen?: boolean;
    animateClose?: boolean;
    theme?: string;
    expandButtonsEnabled?: boolean;
    expandButtonText?: string;
}
/**
 * @class JSONFormatter
 *
 * JSONFormatter allows you to render JSON objects in HTML with a
 * **collapsible** navigation.
*/
export default class JSONFormatter {
    json: any;
    private open;
    private config;
    private key;
    private _isOpen;
    private element;
    private expandLink;
    private children;
    /**
     * In case of a search, this text should be highlighted in values and keys
     */
    private highlightedText;
    /**
     * @param {object} json The JSON object you want to render. It has to be an
     * object or array. Do NOT pass raw JSON string.
     *
     * @param {number} [open=1] his number indicates up to how many levels the
     * rendered tree should expand. Set it to `0` to make the whole tree collapsed
     * or set it to `Infinity` to expand the tree deeply
     *
     * @param {object} [config=defaultConfig] -
     *  defaultConfig = {
     *   hoverPreviewEnabled: false,
     *   hoverPreviewArrayCount: 100,
     *   hoverPreviewFieldCount: 5
     * }
     *
     * Available configurations:
     *  #####Hover Preview
     * * `hoverPreviewEnabled`:  enable preview on hover
     * * `hoverPreviewArrayCount`: number of array items to show in preview Any
     *    array larger than this number will be shown as `Array[XXX]` where `XXX`
     *    is length of the array.
     * * `hoverPreviewFieldCount`: number of object properties to show for object
     *   preview. Any object with more properties that thin number will be
     *   truncated.
     *
     * @param {string} [key=undefined] The key that this object in it's parent
     * context
    */
    constructor(json: any, open?: number, config?: JSONFormatterConfiguration, key?: string);
    private isOpen;
    private readonly isDate;
    private readonly isUrl;
    private readonly isArray;
    private readonly isObject;
    private readonly isEmptyObject;
    private readonly isEmpty;
    private readonly hasKey;
    private readonly constructorName;
    private readonly type;
    private readonly keys;
    /**
     * Toggles `isOpen` state
     *
    */
    toggleOpen(): void;
    doOpen(finished?: Function): void;
    doClose(finished?: Function): void;
    /**
     * Expands the element and its children
     *
     */
    doExpand(): void;
    /**
    * Open all children up to a certain depth.
    * Allows actions such as expand all/collapse all
    *
    */
    openAtDepth(depth?: number): void;
    /**
     * Generates inline preview
     *
     * @returns {string}
    */
    getInlinepreview(): string;
    /**
     * Renders an HTML element and installs event listeners
     *
     * @returns {HTMLDivElement}
    */
    render(): HTMLDivElement;
    private renderHighlighted(text);
    /**
     * Appends all the children to children element
     * Animated option is used when user triggers this via a click
    */
    appendChildren(animated?: boolean, finishedCallback?: Function): void;
    /**
     * Removes all the children from children element
     * Animated option is used when user triggers this via a click
    */
    removeChildren(animated?: boolean, finishedCallback?: Function): void;
    /**
     * Returns a list of all opened paths
     */
    getOpenedPaths(parentPath?: any[]): any[];
    /**
     * Opens a set of paths in the tree
     */
    openPaths(paths?: any[], finished?: Function): void;
    /**
     * Opens a specified path in the tree
     */
    openPath(path?: any[], finished?: Function): void;
    private reRender();
    /**
     * Search the tree for a certain term (case insensitive).
     * The term will be highlighted at all found positions
     */
    searchTerm(term: any): void;
}
