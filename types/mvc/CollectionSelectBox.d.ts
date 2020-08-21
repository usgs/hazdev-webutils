import { ViewOptions } from './';

/**
 * Create a new CollectionSelectBox to select a collection item.
 *
 * @see mvc/View
 */
export class CollectionSelectBox <T> {

  constructor(params: ViewOptions<T>);

  /**
   * Destroy CollectionSelectBox.
   */
  destroy(): void;

  /**
   * Update select box items.
   */
  render(): void;

}
