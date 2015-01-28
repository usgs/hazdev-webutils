'use strict';

var ModalView = require('./ModalView'),
    Util = require('../util/Util'),
    View = require('./View');


var _DEFAULTS = {
  // title of modal dialog.
  title: 'Download',
  // markup to describe download content.
  help: '',
  // callback function to format collection for download.
  format: function (collection) {
    return JSON.stringify(collection);
  }
};


/**
 * Create a DownloadView.
 *
 * @param options {Object}
 * @param options.title {String}
 *        Default 'Download'.
 *        Modal dialog title.
 * @param options.format {Function(Collection)}
 *        Default JSON.stringify.
 *        function to format collection for download.
 * @see mvc/View
 */
var DownloadView = function (params) {
  var _this,
      _initialize,

      _collection,
      _format,
      _modal,
      _textarea,
      _title;


  params = Util.extend({}, _DEFAULTS, params);
  _this = Object.create(View(params));

  /**
   * Initialize the download view.
   */
  _initialize = function () {
    var el = _this.el;

    _collection = params.collection;
    _format = params.format;
    _title = params.title;

    el.className = 'download-view';
    el.innerHTML = '<div class="help">' + params.help + '</div>' +
        '<textarea class="download" readonly="readonly"></textarea>';
    _textarea = el.querySelector('.download');

    params = null;
  };

  /**
   * Destroy the download view.
   */
  _this.destroy = Util.compose(function () {
    if (_modal) {
      // TODO: hide first?
      _modal.destroy();
      _modal = null;
    }

    _collection = null;
    _format = null;
    _textarea = null;
  }, _this.destroy);

  /**
   * Format collection for download.
   */
  _this.render = function () {
    _textarea.value = _format(_collection);
  };

  /**
   * Show the download view, calls render before showing modal.
   */
  _this.show = function () {
    if (!_modal) {
      _modal = new ModalView(_this.el, {
        title: _title
      });
    }

    _this.render();
    _modal.show();
    _textarea.select();
  };

  _initialize();
  return _this;
};

module.exports = DownloadView;