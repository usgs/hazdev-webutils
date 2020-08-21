
export class Events {

  /**
   * Free all references.
   */
  destroy(): void;

  /**
   * Remove an event listener
   *
   * Omitting callback clears all listeners for given event.
   * Omitting event clears all listeners for all events.
   *
   * @param event
   *      event name to unbind.
   * @param callback
   *      callback to unbind.
   * @param context
   *      context for "this" when callback is called
   */
  off(evt: string, callback: () => {}, context: object): void;

  /**
   * Add an event listener
   *
   * @param event
   *      event name (singular).  E.g. 'reset'
   * @param callback
   *      function to call when event is triggered.
   * @param context
   *      context for "this" when callback is called
   */
  on(event: string, callback: () => {}, context: object): void;

  /**
   * Trigger an event
   *
   * @param event
   *      event name.
   * @param args
   *      variable length arguments after event are passed to listeners.
   */
  trigger(event: string, ...args: any[]): void;

}
