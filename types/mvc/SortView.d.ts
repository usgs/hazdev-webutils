import { ViewOptions } from './';

/**
 * Construct a SortView.
 *
 * Sort objects can specify a custom sort function (sort),
 * or a value to be sorted (sortBy) and sort order (descending).
 *
 * @see mvc/View
 */
export class SortView <T> {

  constructor(params: ViewOptions<T>);

  /**
   * Destroy the SortView.
   */
  destroy(): void;

}
