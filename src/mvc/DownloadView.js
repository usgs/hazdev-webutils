/* global define */
define([
  'util/Util',
  'mvc/View',
  'mvc/ModalView'
], function (
  Util,
  View,
  ModalView
) {
  'use strict';


  var DEFAULTS = {
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
  var DownloadView = function (options) {
    this._options = Util.extend({}, DEFAULTS, options);
    View.call(this, options);
  };

  DownloadView.prototype = Object.create(View.prototype);


  /**
   * Initialize the download view.
   */
  DownloadView.prototype._initialize = function () {
    var el = this._el,
        options = this._options;

    View.prototype._initialize.call(this);

    this.show = this.show.bind(this);
    el.className = 'download-view';
    el.innerHTML = '<div class="help">' + options.help + '</div>' +
        '<textarea class="download" readonly="readonly"></textarea>';
    this._textarea = el.querySelector('.download');
  };

  /**
   * Destroy the download view.
   */
  DownloadView.prototype.destroy = function () {
    if (this._modal) {
      // TODO: hide first?
      this._modal.destroy();
      this._modal = null;
    }
    this._textarea = null;
    this._options = null;
    delete this.show;
    View.prototype.destroy.call(this);
  };

  /**
   * Show the download view, calls render before showing modal.
   */
  DownloadView.prototype.show = function () {
    if (!this._modal) {
      this._modal = new ModalView(this._el, {
        title: this._options.title
      });
    }

    this.render();
    this._modal.show();
    this._textarea.select();
  };

  /**
   * Format collection for download.
   */
  DownloadView.prototype.render = function () {
    var options = this._options;

    this._textarea.value = options.format(options.collection);
  };

  // return constructor.
  return DownloadView;
});
