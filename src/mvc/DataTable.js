'use strict';


var CollectionTable = require('./CollectionTable'),
    DownloadView = require('./DownloadView'),
    SortView = require('./SortView'),
    Util = require('../util/Util'),
    View = require('./View');


/**
 * Create a new DataTable to display a collection.
 *
 * @param params {Object}
 *        all params except "el" are passed to CollectionTable.
 * @param params.sorts {Array<Object>}
 *        sort objects used by SortView.
 * @param params.formatDownload {Function(Collection)}
 *        Optional, default is Tab Separated Values.
 * @param params.columns {Array<Object>}
 *        column objects used by CollectionTable.
 * @param params.columns[X].formatDownload {Function(Object)}
 *        Optional, default is column.format.
 *        Function used to format a column value for download.
 *        Used by DataTable._formatDownload.
 * @see CollectionTable
 * @see SortView
 * @see DownloadView
 */
var DataTable = function (params) {
  var _this,
      _initialize,

      _collection,
      _collectionTable,
      _columns,
      _downloadButton,
      _downloadView,
      _sorts,
      _sortView,

      _formatDownload;


  _this = Object.create(View(params));

  /**
   * Initialize the DataTable.
   */
  _initialize = function () {
    var el,
        tools;

    el = _this.el;
    el.innerHTML = '<div class="datatable-tools"></div>' +
        '<div class="datatable-data"></div>';
    el.classList.add('datatable');
    tools = el.querySelector('.datatable-tools');

    _collection = params.collection;
    _columns = params.columns;

    // sort
    _sorts = params.sorts;
    if (_sorts) {
      _sortView = new SortView({
        collection: _collection,
        sorts: _sorts,
        defaultSort: params.defaultSort
      });
      tools.appendChild(_sortView.el);
    }

    // data
    _collectionTable = new CollectionTable(
        Util.extend({}, params, {
          el: el.querySelector('.datatable-data')
        }));

    // download
    _downloadView = new DownloadView({
      collection: _collection,
      help: params.help || 'Copy then paste into a spreadsheet application',
      format: params.formatDownload || _formatDownload
    });

    _downloadButton = document.createElement('button');
    _downloadButton.innerHTML = 'Download';
    _downloadButton.className = 'download';
    _downloadButton.addEventListener('click', _downloadView.show);
    tools.appendChild(_downloadButton);


    params = null;
  };


  /**
   * Callback used to format downloads.
   * This implementation outputs Tab Separated Values.
   */
  _formatDownload = function (collection) {
    var c,
        cLen,
        content,
        column,
        data,
        format,
        i,
        iLen,
        item,
        row;

    content = [];
    data = collection.data();
    row = [];

    for (c = 0, cLen = _columns.length; c < cLen; c++) {
      column = _columns[c];
      row.push(column.title);
    }
    content.push(row.join('\t'));

    for (i = 0, iLen = data.length; i < iLen; i++) {
      item = data[i];
      row = [];
      for (c = 0, cLen = _columns.length; c < cLen; c++) {
        column = _columns[c];
        format = column.downloadFormat || column.format;
        row.push(format(item));
      }
      content.push(row.join('\t'));
    }

    return content.join('\n');
  };


  /**
   * Destroy the DataTable.
   */
  _this.destroy = Util.compose(function () {
    if (_sortView) {
      _sortView.destroy();
      _sortView = null;
    }

    _downloadButton.removeEventListener('click', _downloadView.show);
    _downloadButton = null;

    _downloadView.destroy();
    _downloadView = null;

    _collectionTable.destroy();
    _collectionTable = null;
  }, _this.destroy);


  _initialize();
  return _this;
};

module.exports = DataTable;