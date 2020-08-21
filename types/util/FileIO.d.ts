import { UtilOptions } from './';

/**
 * Class: FileIO
 *
 * @param params
 *      Configuration options. See _DEFAULTS for more details.
 */
export class FileIO {

  constructor(params: UtilOptions);

  destroy(): void;

  /**
   * Asynchronously read file contents. This method has no return value.
   *
   * @param params
   *      Parameters given to the method including:
   *      'file': {File} The file object to read
   *      'success': {Function} Callback method to execute on success.
   *      'error': {Function} Callback method to execute on error.
   *      'reader': {FileReader} The reader to use for reading. Optional.
   *      'method': {String} The name of the reader method. Optional.
   *
   * @throws {Error}
   *      If params.file is not provided.
   */
  read(params: UtilOptions): void;

}
