import { ViewOptions } from './';

/**
 * Create a CollectionTable to display a collection.
 *
 * @see mvc/View
 */
export class CollectionTable <T> {

  constructor(params: ViewOptions<T>);

  /**
   * Undo initialization and free references.
   */
  destroy(): void;

  /**
   * Render the view.
   */
  render(): void;

}
