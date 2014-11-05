/* global define */
define([
  'util/Util',
  './View',
  './CollectionTable',
  './SortView',
  './DownloadView'
], function (
  Util,
  View,
  CollectionTable,
  SortView,
  DownloadView
) {
  'use strict';

  /**
   * Create a new DataTable to display a collection.
   *
   * @param options {Object}
   *        all options except "el" are passed to CollectionTable.
   * @param options.sorts {Array<Object>}
   *        sort objects used by SortView.
   * @param options.formatDownload {Function(Collection)}
   *        Optional, default is Tab Separated Values.
   * @param options.columns {Array<Object>}
   *        column objects used by CollectionTable.
   * @param options.columns[X].formatDownload {Function(Object)}
   *        Optional, default is column.format.
   *        Function used to format a column value for download.
   *        Used by DataTable._formatDownload.
   * @see CollectionTable
   * @see SortView
   * @see DownloadView
   */
  var DataTable = function (options) {
    this._options = options;
    View.call(this, options);
  };

  /**
   * Initialize the DataTable.
   */
  DataTable.prototype._initialize = function () {
    var el,
        options = this._options,
        collection = options.collection,
        tools;

    // call parent initialize
    View.prototype._initialize.call(this);

    el = this._el;
    el.innerHTML = '<div class="datatable-tools"></div>' +
        '<div class="datatable-data"></div>';
    el.classList.add('datatable');

    tools = el.querySelector('.datatable-tools');

    // sort
    if (options.sorts) {
      this._sortView = new SortView({
        collection: collection,
        sorts: options.sorts,
        defaultSort: options.defaultSort
      });
      tools.appendChild(this._sortView._el);
    }

    // download
    this._formatDownload = this._formatDownload.bind(this);
    this._downloadView = new DownloadView({
      collection: collection,
      help: options.help || 'Copy then paste into a spreadsheet application',
      format: options.formatDownload || this._formatDownload
    });

    this._downloadButton = document.createElement('button');
    this._downloadButton.innerHTML = 'Download';
    this._downloadButton.className = 'download';
    this._downloadButton.addEventListener('click', this._downloadView.show);
    tools.appendChild(this._downloadButton);

    // data
    this._collectionTable = new CollectionTable(
        Util.extend({}, options, {
          el: el.querySelector('.datatable-data')
        }));
  };

  /**
   * Destroy the DataTable.
   */
  DataTable.prototype.destroy = function () {
    if (this._sortView) {
      this._sortView.destroy();
      this._sortView = null;
    }

    this._downloadButton.removeEventListener('click', this._downloadView.show);
    this._downloadButton = null;

    delete this._formatDownload;
    this._downloadView.destroy();
    this._downloadView = null;

    this._collectionTable.destroy();
    this._collectionTable = null;

    this._options = null;

    // call parent destroy
    View.prototype.destroy.call(this);
  };

  /**
   * Callback used to format downloads.
   * This implementation outputs Tab Separated Values.
   */
  DataTable.prototype._formatDownload = function (collection) {
    var options = this._options,
        columns = options.columns,
        data = collection.data(),
        item, i, iLen,
        column, c, cLen,
        content = [],
        format,
        row;

    row = [];
    for (c = 0, cLen = columns.length; c < cLen; c++) {
      column = columns[c];
      row.push(column.title);
    }
    content.push(row.join('\t'));

    for (i = 0, iLen = data.length; i < iLen; i++) {
      item = data[i];
      row = [];
      for (c = 0, cLen = columns.length; c < cLen; c++) {
        column = columns[c];
        format = column.downloadFormat || column.format;
        row.push(format(item));
      }
      content.push(row.join('\t'));
    }

    return content.join('\n');
  };

  // return constructor
  return DataTable;
});