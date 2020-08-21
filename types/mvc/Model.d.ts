import { ViewOptions } from './';

/**
 * Constructor
 *
 */
export class Model <T, U> {

  /**
   * @param data
   *      key/value attributes of this model.
   */
  constructor(data: T);

  /**
   * Get one or more values.
   *
   * @param key
   *      the value to get; when key is undefined, returns the object with all
   *      values.
   * @return
   *      - if key is specified, the value or null if no value exists.
   *      - when key is not specified, the underlying object is returned.
   *        (Any changes to this underlying object will not trigger events!!!)
   */
  get<V>(key: string): V;

  /**
   * Update one or more values.
   *
   * @param data
   *      the keys and values to update.
   * @param options
   *      options for this method.
   */
  set(data: T, options: ViewOptions<U>): void;

  /**
   * Override toJSON method to serialize only model data.
   */
  toJSON(): T;

}
