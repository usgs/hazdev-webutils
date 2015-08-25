'use strict';

var Collection = require('./Collection'),
    Util = require('../util/Util'),
    View = require('./View');


var _DEFAULTS = {
  // classname added to select box
  className: 'collection-selectbox',
  includeBlankOption: false,
  blankOption: {
    value: '-1',
    text: 'Please select&hellip;'
  },

  // callback to format each collection item
  format: function (item) {
    return item.id;
  },

  multiSelect: false,

  // whether to render during initialize
  renderNow: true
};

/**
 * Create a new CollectionSelectBox to select a collection item.
 *
 * @param params {Object}
 * @param params.format {Function(Object)}
 *        callback function to format select box items.
 * @param params.className {String}
 *        Default 'collection-selectbox'.
 *        Class name for select box.
 * @param params.collection {Collection}
 *        the collection to display.
 *        NOTE: the collection should have an existing selection;
 *        otherwise, the first item in the select box will be selected
 *        in the UI and not in the collection.
 * @see mvc/View
 */
var CollectionSelectBox = function (params) {
  var _this,
      _initialize,

      _blankOption,
      _collection,
      _format,
      _includeBlankOption,
      _multiSelect,
      _selectBox,

      _createBlankOption,
      _onChange,
      _onSelect;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  /**
   * @constructor
   *
   */
  _initialize = function () {
    var el = _this.el;

    _collection = params.collection;
    _blankOption = params.blankOption;
    _includeBlankOption = params.includeBlankOption;
    _format = params.format;
    _multiSelect = params.multiSelect;

    // reuse or create select box
    if (el.nodeName === 'SELECT') {
      _selectBox = el;
    } else {
      _selectBox = el.appendChild(document.createElement('select'));
    }
    _selectBox.classList.add(params.className);
    if (_multiSelect) {
      _selectBox.setAttribute('multiple', 'multiple');
    }

    // bind to events on the collection
    _collection.on('change', _this.render);
    _collection.on('change:select', _onSelect);

    // bind to events on this._selectBox
    _selectBox.addEventListener('change', _onChange);

    // populate select box
    if (params.renderNow) {
      _this.render();
    }

    params = null;
  };


  /**
   * Handle selectbox change events.
   */
  _onChange = function () {
    var checked,
        i,
        len,
        toselect,
        value;

    value = _selectBox.value;
    if (_includeBlankOption && value === _blankOption.value) {
      _collection.deselect();
    } else if (_multiSelect) {
      toselect = [];
      checked = _selectBox.querySelectorAll(':checked');
      len = checked.length;
      for (i = 0; i < len; i++) {
        toselect.push(_collection.get(checked[i].value));
      }
      _collection.selectAll(toselect, {source: _this});
    } else {
      _collection.selectById(value);
    }
  };

  /**
   * Handle collection select events.
   */
  _onSelect = function (evt) {
    var checked,
        el,
        i,
        id,
        index,
        len,
        selected;

    if (evt && evt.options && evt.options.source === _this) {
      // select was triggered by this view, so should already be in sync.
      return;
    }

    selected = _collection.getSelected();
    len = selected.length;
    if (len === 0) {
      _selectBox.value = _blankOption.value;
    } else {
      index = Collection.index(selected);
      // deselect items that are no longer selected
      checked = _selectBox.querySelectorAll(':checked');
      len = checked.length;
      for (i = 0; i < len; i++) {
        el = checked[i];
        id = el.getAttribute('value');
        if (id in index) {
          // already selected
          delete index[id];
        } else {
          checked[i].selected = false;
        }
      }
      // select new item(s)
      for (id in index) {
        el = _selectBox.querySelector('[value="' + id + '"]');
        el.selected = true;
      }
    }
  };

  _createBlankOption = function () {
    return [
    '<option ',
        'value="', _blankOption.value, '">',
      _blankOption.text,
    '</option>'
    ].join('');
  };

  /**
   * Destroy CollectionSelectBox.
   */
  _this.destroy = Util.compose(function () {
    _collection.off('add', _this.render);
    _collection.off('remove', _this.render);
    _collection.off('reset', _this.render);
    _collection.off('select', _onSelect);
    _collection.off('deselect', _onSelect);

    _selectBox.removeEventListener('change', _onChange);

    _collection = null;
    _selectBox = null;
  }, _this.destroy);

  /**
   * Update select box items.
   */
  _this.render = function () {
    var data = _collection.data(),
        i,
        len,
        markup = [];

    if (_includeBlankOption === true) {
      markup.push(_createBlankOption());
    }

    for (i = 0, len = data.length; i < len; i++) {
      markup.push('<option value="' + data[i].id + '"' + '>' +
          _format(data[i]) + '</option>');
    }

    _selectBox.innerHTML = markup.join('');
    _onSelect();
  };


  _initialize();
  return _this;
};

module.exports = CollectionSelectBox;
