import { ViewOptions } from './';

/**
 * Create a new DataTable to display a collection.
 *
 * @see CollectionTable
 * @see SortView
 * @see DownloadView
 */
export class DataTable <T> {

  constructor(params: ViewOptions<T>)

  /**
   * Destroy the DataTable.
   */
  destroy(): void;

}
