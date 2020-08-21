import { DownloadOptions } from './';

/**
 * Create a DownloadView.
 *
 * @see mvc/View
 */
export class DownloadView {

  constructor(params: DownloadOptions)

  /**
   * Destroy the download view.
   */
  destroy(): void;

  /**
   * Format collection for download.
   */
  render(): void;

  /**
   * Show the download view, calls render before showing modal.
   */
  show(): void;

}
