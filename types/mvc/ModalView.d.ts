import { ViewOptions } from './';

/**
 * Generic class for modal dialog views. Modal dialogs present a blocking
 * interface to the user and require user-interaction in order to be closed
 * (i.e. clicking a button etc...).
 *
 * It is important to note that while the interface appears blocked while a
 * modal dialog is open, Javascript continues to execute in the background.
 *
 * Only one modal dialog can be visible at any given time.
 *
 * If a second modal dialog is opened while the first modal dialog is still
 * visible, the first modal dialog is hidden and the second is shown. Upon
 * closing the second modal dialog, the first modal dialog is re-shown (unless
 * the "clear" method is passed to the hide method). This process continues in a
 * last-in, first-out (stack) ordering until all modal dialogs are closed.
 *
 */
export class ModalView <T> {

  constructor(message: string, params: ViewOptions<T>);

  /**
   * Remove event listeners and free references.
   *
   * You should call hide first.
   */
  destroy(): void;

  hide(clearAll: boolean): ModalView<T>;

  render(message: string): ModalView<T>;

  setMessage(message: string): ModalView<T>;

  setOptions(params: ViewOptions<T>, extend: boolean): ModalView<T>;

  show(): ModalView<T>;

}
