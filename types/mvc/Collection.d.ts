import { ViewOptions } from './'

/**
 * Create a new Collection.
 */
export class Collection <T> {

  constructor(data: T[]);

  /**
   * Add objects to the collection.
   *
   * Calls wrapped array.push, and clears the id cache.
   *
   * @param
   *      a variable number of objects to append to the collection.
   * @deprecated see #addAll()
   */
  add(...object: T[]): void;

  /**
   * Add objects to the collection.
   *
   * Calls wrapped array.push, and clears the id cache.
   *
   * @param toadd
   *        objects to be added to the collection.
   */
  addAll(toadd: T[], options?: ViewOptions<T>): void;

  /**
   * Get the wrapped array.
   *
   * @return
   *      the wrapped array.
   */
  data(): T[];

  /**
   * Deselect current selection.
   */
  deselect(options: ViewOptions<T>): void;

  /**
   * Free the array and id cache.
   *
   * @param options
   *        passed to #deselect().
   */
  destroy(options: ViewOptions<T>): void;

  /**
   * Get an object in the collection by ID.
   *
   * Uses getIds(), so builds map of ID to INDEX on first access O(N).
   * Subsequent access should be O(1).
   *
   * @param id
   *      if the collection contains more than one object with the same id,
   *      the last element with that id is returned.
   */
  get<V>(id: V): T;

  /**
   * Get a map from ID to INDEX.
   *
   * @param force
   *      rebuild the map even if it exists.
   */
  getIds<V>(force: boolean): V[];

  /**
   * Get the currently selected object.
   */
  getSelected(): T;

  /**
   * Remove objects from the collection.
   *
   * This method calls array.splice to remove item from array.
   * Reset would be faster if modifying large chunks of the array.
   *
   * @param o
   *      object to remove.
   * @deprecated see #removeAll()
   */
  remove(...o: T[]): void;

  /**
   * Remove objects from the collection.
   *
   * Reset is faster if modifying large chunks of the array.
   *
   * @param toremove
   *        objects to remove.
   * @param options
   *        default false.
   *        whether to trigger events (false), or not (true).
   */
  removeAll(toremove: T[], options: ViewOptions<T>): void;

  /**
   * Replace the wrapped array with a new one.
   */
  reset(data: T[], options: ViewOptions<T>): void;

  /**
   * Select an object in the collection.
   *
   * @param obj
   *      object in the collection to select.
   * @throws exception
   *      if obj not in collection.
   */
  select(obj: T, options: ViewOptions<T>): void;

  /**
   * Utility method to select collection item using its id.
   *
   * Selects matching item if it exists, otherwise clears any selection.
   *
   * @param id
   *        id of item to select.
   * @param options
   *        options passed to #select() or #deselect().
   */
  selectById<V>(id: V, options: ViewOptions<T>): T;

  /**
   * Sorts the data.
   *
   * @param method
   *        javascript sort method.
   * @param options
   *        passed to #reset()
   */
  sort(method: () => {}, options: ViewOptions<T>): void;

  /**
   * Override toJSON method to serialize only collection data.
   */
  toJSON(): T[];
}
