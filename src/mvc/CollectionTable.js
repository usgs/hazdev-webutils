'use strict';

var Util = require('../util/Util'),
    View = require('./View');


var _DEFAULTS = {
  // class name for table
  className: 'collection-table',
  // click on table rows to trigger select in collection
  clickToSelect: false,
  // columns of data to display
  columns: [
    //{
      // class name for header and data cells
      //   className: '',
      // header content for column
      //   title: '',
      // format function for data cells
      //   format: function (item) { return ''; }
      // whether column is header for its row
      //   header: false
    //}
  ],
  emptyMarkup: 'No data to display',
  // whether to render after initialization
  renderNow: true
};


/**
 * Create a CollectionTable to display a collection.
 *
 * @param params {Object}
 * @param params.collection {Collection}
 *        Collection to display.
 * @param params.columns {Array<Object>}
 *        Array of column objects defining display.
 *        Each object should have these properties:
 *        - className {String} class name for header and data cells.
 *        - title {String} markup for header cell.
 *        - format {Function(item)} function to format data cell.
 *        - header {Boolean} default false.
 *          whether column is row header and should use th scope=row (true),
 *          or a regular data cell and should use td (false).
 * @param params.clickToSelect {Boolean}
 *        Default false.  Whether clicking on table rows should select
 *        the corresponding collection item.
 * @see mvc/View
 */
var CollectionTable = function (params) {
  var _this,
      _initialize,

      _className,
      _clickToSelect,
      _collection,
      _columns,
      _emptyMarkup,

      _onClick,
      _onSelect;


  params = Util.extend({}, _DEFAULTS, params);
  _this = Object.create(View(params));

  _initialize = function () {
    _className = params.className;
    _clickToSelect = params.clickToSelect;
    _collection = params.collection;
    _columns = params.columns;
    _emptyMarkup = params.emptyMarkup;

    // respond to collection events
    _collection.on('add', _this.render);
    _collection.on('remove', _this.render);
    _collection.on('reset', _this.render);
    _collection.on('select', _onSelect);
    _collection.on('deselect', _onSelect);

    // add click handler
    if (_clickToSelect) {
      _this.el.addEventListener('click', _onClick);
    }

    if (params.renderNow) {
      _this.render();
    }
  };


  /**
   * Handle table click events.
   * Listener is only added when options.clickToSelect is true.
   */
  _onClick = function (e) {
    var target = e.target,
        row = Util.getParentNode(target, 'TR', _this.el);

    if (row !== null) {
      if (row.parentNode.nodeName.toUpperCase() === 'TBODY') {
        _collection.selectById(row.getAttribute('data-id'));
      }
    }
  };

  /**
   * Handle collection select and deselect events.
   */
  _onSelect = function () {
    var el = _this.el,
        selected;

    // remove previous selection
    selected = el.querySelector('.selected');
    if (selected) {
      selected.classList.remove('selected');
    }

    // set new selection
    selected = _collection.getSelected();
    if (selected) {
      selected = el.querySelector('[data-id="' + selected.id + '"]');
      selected.classList.add('selected');
    }
  };


  /**
   * Undo initialization and free references.
   */
  _this.destroy = function () {

    _collection.off('add', _this.render);
    _collection.off('remove', _this.render);
    _collection.off('reset', _this.render);
    _collection.off('select', _onSelect);
    _collection.off('deselect', _onSelect);
    _collection = null;

    if (_clickToSelect) {
      _this.el.removeEventListener('click', _onClick);
    }
    _clickToSelect = null;

    _this.el = null;
  };

  /**
   * Render the view.
   */
  _this.render = function () {
    var c,
        cLen,
        column,
        data,
        i,
        id,
        iLen,
        item,
        markup;

    data = _collection.data();
    markup = [];

    if (data.length === 0) {
      _this.el.innerHTML = _emptyMarkup;
      return;
    }

    markup.push('<table class="', _className, '"><thead>');
    for (c = 0, cLen = _columns.length; c < cLen; c++) {
      column = _columns[c];
      markup.push('<th class="' + column.className + '">' +
          column.title + '</th>');
    }
    markup.push('</thead><tbody>');
    for (i = 0, iLen = data.length; i < iLen; i++) {
      item = data[i];
      id = ('' + item.id).replace(/"/g, '&quot;');
      markup.push('<tr data-id="' + id + '">');
      for (c = 0, cLen = _columns.length; c < cLen; c++) {
        column = _columns[c];
        markup.push('<' + (column.header ? 'th scope="row"' : 'td') +
            ' class="' + column.className + '">' +
            column.format(item) + '</td>');
      }
      markup.push('</tr>');
    }
    markup.push('</tbody></table>');

    _this.el.innerHTML = markup.join('');
  };


  _initialize();
  return _this;
};

module.exports = CollectionTable;