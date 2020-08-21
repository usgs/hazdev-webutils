'use strict';


var Util = require('./Util');


// Default values to be used by constructor
var _DEFAULTS = {
   maxFileSize: 209715200 // 200MB
};


/**
 * Class: FileIO
 *
 * @param params {Object}
 *      Configuration options. See _DEFAULTS for more details.
 */
var FileIO = function (params) {
  var _this,
      _initialize,

      _maxFileSize,

      _getReadMethod;


  // Inherit from parent class
  _this = {
    read: null,
    write: null
  };

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    // Enumerate each property expected to be given in params method
    params = Util.extend({}, _DEFAULTS, params);

    _maxFileSize = params.maxFileSize;
  };

  _getReadMethod = function (params) {
    var reader,
        type;

    reader = params.reader;

    if (!params.hasOwnProperty('url')) {
      return reader.readAsDataURL;
    } else if (params.method && typeof reader[params.method] === 'function') {
      // If specific method is requested then use it
      return reader[params.method];
    }

    // Try to choose a decent method based on file type
    type = params.file.type;

    if (type.indexOf('text') !== -1 || type.indexOf('txt') !== -1 ||
        type === 'application/xml' || type === 'application/json') {
      return reader.readAsText;
    } else {
      return reader.readAsBinaryString;
    }
  };


  _this.destroy = function () {
    _maxFileSize = null;

    _getReadMethod = null;

    _initialize = null;
    _this = null;
  };

  /**
   * Asynchronously read file contents. This method has no return value.
   *
   * @param params {Object}
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
  _this.read = function (params) {
    var method,
        onReadError,
        onReadSuccess,
        onReadComplete,
        reader;

    if (!params || !params.file) {
      throw new Error('Parameters are required for reading.');
    }

    if (params.file.size > _maxFileSize) {
      throw new Error('File size is too large.');
    }

    reader = params.reader = new FileReader();
    method = _getReadMethod(params);

    onReadComplete = function () {
      if (params.success) {
        reader.removeEventListener('load', onReadSuccess);
        onReadSuccess = null;
      }

      if (params.error) {
        reader.removeEventListener('error', onReadError);
        onReadError = null;
      }

      reader.removeEventListener('loadend', onReadComplete);
      onReadComplete = null;

      reader = null;
    };
    reader.addEventListener('loadend', onReadComplete);


    onReadSuccess = function () {

      if (!params.url) {
        params.url = reader.result;
        _this.read(params);
      } else if (params.success) {
        params.success({
          file: params.file,
          content: reader.result,
          method: method.name,
          url: params.url
        });
      }
    };
    reader.addEventListener('load', onReadSuccess);

    if (params.error) {
      onReadError = function (/*event*/) {
        params.error({
          error: reader.error,
          file: params.file,
          result: reader.result
        });
      };

      reader.addEventListener('error', onReadError);
    }

    method.call(reader, params.file);
  };

  _this.write = function (params) {
    var blob,
        url;

    if (!params || !params.content) {
      throw new Error('Parameters are required for writing.');
    }

    blob = new Blob([params.content], {type: params.type || 'text/plain'});

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, params.name || 'download');
    } else {
      url = window.URL.createObjectURL(blob);
      window.open(url, params.name || 'download');
      window.URL.revokeObjectURL(url);
    }
  };


  // Always call the constructor
  _initialize(params);
  params = null;
  return _this;
};


module.exports = FileIO;
