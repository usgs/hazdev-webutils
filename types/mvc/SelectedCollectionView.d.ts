import { ViewOptions } from './';

/** create a new view based on a collection of models. */
export class SelectedCollectionView <T> {

  constructor(params: ViewOptions<T>);

  /**
   * clean up the view
   */
  destroy(): void;

  /**
   * unset the event bindings for the collection
   */
  onCollectionDeselect(): void;

  /**
   * unset event bindings for the collection, if set.
   */
  onCollectionReset(): void;

  /**
   * set event bindings for the collection
   */
  onCollectionSelect(): void;

  /**
   * render the selected model in the view
   */
  render(): void;

}
