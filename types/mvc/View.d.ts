import { ViewOptions } from './';

/** create a new view. */
export class View <T> {

  constructor(params: ViewOptions<T>);

  /**
   * API Method
   *
   * Renders the view
   */
  render(): void;

  /**
   * API Method
   *
   * Cleans up resources allocated by the view. Should be called before
   * discarding a view.
   */
  destroy(): void;

}
