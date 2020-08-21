import { UtilOptions } from './';

export class Xhr {

  /**
   * Make an AJAX request.
   *
   * @param options
   *      the AJAX options.
   * options.url
   *      the url to request.
   * options.success
   *      called with data loaded by script
   * options.error
   *      called when script fails to load
   * options.done
   *      called when ajax is complete, after success or error.
   * options.method
   *      request method, default is 'GET'
   * options.headers
   *      request header name as key, value as value.
   * options.data
   *      request data, sent using content type
   *      'application/x-www-form-urlencoded'.
   * options.rawdata
   *      passed directly to send method, when options.data is null.
   *      Content-type header must also be specified. Default is null.
   * options.timeout
   *      time in milliseconds a request can take, default is 5000.
   * options.ontimeout
   *      called when script fails to load due to network timeout.
   */
  static ajax(options: UtilOptions): void;

  /**
   * Generate a unique callback name.
   *
   * @return a unique callback name.
   */
  static getCallbackName(): string;

  /**
   * Make a JSONP request.
   *
   * @param options
   *      the options
   * options.url
   *      url to load
   * options.success
   *      called with data loaded by script
   * options.error
   *      called when script fails to load
   * options.done
   *        called when jsonp is complete, after success or error.
   * options.data
   *      request parameters to add to url
   *
   * options.callbackName {String} optional
   * options.callbackParameter {String} optional
   *      default is 'callback'
   */
  static jsonp(options: UtilOptions): void;

  static restrictOrigin(url: string): void;

  /**
   * URL encode an object.
   *
   * @param obj
   *      object to encode
   *
   * @return
   *      url encoded object
   */
  static urlEncode(obj: object): string;

}
