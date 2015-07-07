'use strict';

var Collection = require('./Collection'),
    Util = require('../util/Util'),
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
  // allow multiple items to be selected
  multiSelect: false,
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
 * @param params.multiSelect {Boolean}
 *        Default false.  Whether to select multiple items.
 *        Only works with clickToSelect.
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
      _multiSelect,

      _onClick,
      _onSelect;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function (params) {
    _className = params.className;
    _clickToSelect = params.clickToSelect;
    _collection = params.collection;
    _columns = params.columns;
    _emptyMarkup = params.emptyMarkup;
    _multiSelect = params.multiSelect;

    // respond to collection events
    _collection.on('change', _this.render);
    _collection.on('change:select', _onSelect);

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
        row = Util.getParentNode(target, 'TR', _this.el),
        id;

    if (row !== null) {
      if (row.parentNode.nodeName.toUpperCase() === 'TBODY') {
        id = row.getAttribute('data-id');
        if (_multiSelect) {
          try {
            _collection.addToSelection({id: id});
          } catch (e) {
            _collection.removeFromSelection({id: id});
          }
        } else {
          _collection.selectById(row.getAttribute('data-id'));
        }
      }
    }
  };

  /**
   * Handle collection select events.
   */
  _onSelect = function () {
    var el,
        els,
        i,
        id,
        index,
        len,
        selected;
    // get collection selection
    selected = _collection.getSelected();
    index = Collection.index(selected);
    // deselect removed items
    el = _this.el;
    els = el.querySelectorAll('.selected');
    len = els.length;
    for (i = 0; i < len; i++) {
      el = els[i];
      id = el.getAttribute('data-id');
      if (id in index) {
        // still selected, don't need to select below
        delete index[id];
        continue;
      }
      // not selected anymore, remove class
      el.classList.remove('selected');
    }
    // select remaining items
    el = _this.el;
    for (id in index) {
      el.querySelector('[data-id="' + id + '"]').classList.add('selected');
    }
  };


  /**
   * Undo initialization and free references.
   */
  _this.destroy = Util.compose(function () {

    _collection.off('change:select', _onSelect);
    _collection.off('change', _this.render);
    _collection = null;

    if (_clickToSelect) {
      _this.el.removeEventListener('click', _onClick);
    }
    _clickToSelect = null;
  }, _this.destroy);

  /**
   * Render the view.
   *
   * @param change {Object}
   *        change event.
   */
  _this.render = function (change) {
    var c,
        cLen,
        column,
        data,
        i,
        id,
        iLen,
        item,
        markup;

    if (change && change.type === 'select') {
      // already handled by _onSelect
      return;
    }

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

    // update selection
    _onSelect();
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = CollectionTable;
