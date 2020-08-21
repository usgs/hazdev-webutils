import { UtilOptions } from './';

export class Util {

  /**
   * Merge properties from a series of objects.
   *
   * @param dst
   *      target where merged properties are copied to.
   * @param <variable>
   *      source objects for properties. When a source is non null, it's
   *      properties are copied to the dst object. Properties are copied in
   *      the order of arguments: a property on a later argument overrides a
   *      property on an earlier argument.
   */
  static extend(dst: object): object;

  /**
   * Checks if objects are equal.
   *
   * @param a
   *      Object a.
   * @param b
   *      Object b.
   */
  static equals(objA: object, objB: object): boolean;

  /**
   * Get an event object for an event handler.
   *
   * @param e the event that was received by the event handler.
   * @return
   *      with two properties:
   *      target
   *           the element where the event occurred.
   *      originalEvent
   *           the event object, either parameter e or window.event (in IE).
   */
  static getEvent(e: Event): { target: HTMLElement, originalEvent: Event };

  /**
   * Get a parent node based on it's node name.
   *
   * @param el
   *      element to search from.
   * @param nodeName
   *      node name to search for.
   * @param maxParent
   *      element to stop searching.
   * @return
   *      matching element, or null if not found.
   */
  static getParentNode(el: HTMLElement, nodeName: string, maxParent: HTMLElement): HTMLElement;

  // remove an elements child nodes
  static empty(el: HTMLElement): void;

  // detach an element from its parent
  static detach(el: HTMLElement): void;

  static getWindowSize(): { width: number, height: number};

  /**
   * Creates a function that is a composition of other functions.
   *
   * For example:
   *      a(b(c(x))) === compose(c, b, a)(x);
   *
   * Each function should accept as an argument, the result of the previous
   * function call in the chain. It is allowable for all functions to have no
   * return value as well.
   *
   * @param functions variable set of functions to call, in order.
   *
   * @return The composition of the functions provided as arguments.
   */
  static compose(...functions: (() => {})[]): () => {};

  /**
   * Checks the elements of a looking for b. b is assumed to be found if for
   * some object in a (a[i]), a[i] === b. Note strict equality.
   *
   * @param a
   *      An array to search
   * @param b
   *      A value to search for
   *
   * @return
   *      true if array a contains b
   */
  static contains(a: any[], b: any): boolean;

  /**
   * @return
   *      true if object is an array
   */
  static isArray(a: any): boolean;

  /**
   * Load a script asynchronously.
   *
   * @param url
   *        script to load.
   * @param options
   *        additional options.
   */
  static loadScript(url: string, options: UtilOptions): void;

}
