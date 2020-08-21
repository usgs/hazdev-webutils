/*
 * title {String}
 *        Default 'Download'.
 *        Modal dialog title.
 *
 * format {Function(Collection)}
 *        Default JSON.stringify.
 *        function to format collection for download.
 */
export interface DownloadOptions {
  title?: string;
  format?: () => {};
}
