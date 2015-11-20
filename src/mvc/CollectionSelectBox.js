'use strict';

var Util = require('../util/Util'),
    View = require('./View');


var _DEFAULTS = {
  // classname added to select box
  className: 'collection-selectbox',
  includeBlankOption: false,
  blankOption: {
    id: 'Please select...',
    value: '-1'
  },

  // callback to format each collection item
  format: function (item) {
    return item.id;
  },

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
      _getValidOptions,
      _includeBlankOption,
      _selectBox,

      _defaultGetValidOptions,
      _onChange,
      _onSelect;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    var el;

    el = _this.el;

    _blankOption = params.blankOption;
    _collection = params.collection;
    _format = params.format;
    _getValidOptions = params.getValidOptions || _defaultGetValidOptions;
    _includeBlankOption = params.includeBlankOption;

    if (_includeBlankOption) {
      _collection.add(_blankOption);
    }
    // reuse or create select box
    if (el.nodeName === 'SELECT') {
      _selectBox = el;
    } else {
      _selectBox = el.appendChild(document.createElement('select'));
    }
    _selectBox.classList.add(params.className);

    // bind to events on the collection
    _collection.on('add', _this.render);
    _collection.on('remove', _this.render);
    _collection.on('reset', _this.render);
    _collection.on('select', _onSelect);
    _collection.on('deselect', _onSelect);

    // bind to events on this._selectBox
    _selectBox.addEventListener('change', _onChange);

    // populate select box
    if (params.renderNow) {
      _this.render();
    }
  };

  _defaultGetValidOptions = function () {
    return _collection.data().map(function (o) { return o.id; });
  };

  /**
   * Handle selectbox change events.
   */
  _onChange = function () {
    var value;

    value = _selectBox.value;

    if (_includeBlankOption && value === _blankOption.value) {
      _collection.deselect();
    } else {
      _collection.selectById(value);
    }
  };

  /**
   * Handle collection select events.
   */
  _onSelect = function () {
    var selected,
        validOptions;

    selected = _collection.getSelected();
    validOptions = _getValidOptions();

    if (selected) {
      if (validOptions.indexOf(selected.id) === -1) {
        _collection.deselect();
      } else {
        _selectBox.value = selected.id;
      }
    } else if (_includeBlankOption) {
      // _selectBox.value = _blankOption.value;
      _collection.selectById(_blankOption.value);
    }
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

    _blankOption = null;
    _collection = null;
    _format = null;
    _getValidOptions = null;
    _includeBlankOption = null;
    _selectBox = null;

    _defaultGetValidOptions = null;
    _onChange = null;
    _onSelect = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Update select box items.
   */
  _this.render = function () {
    var data,
        i,
        id,
        len,
        markup,
        selected,
        validOptions;

    data = _collection.data();
    markup = [];
    selected = _collection.getSelected();

    if (_includeBlankOption && selected === null) {
      data.map(function (d) {
        if (d.id === _blankOption.id) {
          _collection.select(d);
        }
      });
    }

    validOptions = _getValidOptions();

    for (i = 0, len = data.length; i < len; i++) {
      id = data[i].id;

      markup.push('<option value="' + id + '"' +
          (selected === data[i] ? ' selected="selected"' : '') +
          (validOptions.indexOf(id) === -1 ? ' disabled="disabled"' : '') +
          '>' + _format(data[i]) + '</option>');
    }

    _selectBox.innerHTML = markup.join('');
    _onSelect();
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = CollectionSelectBox;
