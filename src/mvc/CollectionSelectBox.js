'use strict';

var Util = require('../util/Util'),
    View = require('./View');


var _DEFAULTS = {
  // classname added to select box
  className: 'collection-selectbox',

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

      _collection,
      _format,
      _selectBox,

      _onChange,
      _onSelect;


  params = Util.extend({}, _DEFAULTS, params);
  _this = Object.create(View(params));

  /**
   * @constructor
   *
   */
  _initialize = function () {
    var el = _this.el;

    _collection = params.collection;
    _format = params.format;

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

    params = null;
  };


  /**
   * Handle selectbox change events.
   */
  _onChange = function () {
    var value = _selectBox.value,
        selected;

    if (value === '') {
      _collection.deselect();
    } else {
      selected = _collection.data()[parseInt(value, 10)];
      _collection.select(selected);
    }
  };

  /**
   * Handle collection select events.
   */
  _onSelect = function () {
    var selected = _collection.getSelected(),
        ids;

    if (selected) {
      ids = _collection.getIds();
      _selectBox.value = ids[selected.id];
    } else {
      _selectBox.value = '';
    }
  };


  /**
   * Destroy CollectionSelectBox.
   */
  _this.destroy = function () {
    _collection.off('add', _this.render);
    _collection.off('remove', _this.render);
    _collection.off('reset', _this.render);
    _collection.off('select', _onSelect);
    _collection.off('deselect', _onSelect);

    _selectBox.removeEventListener('change', _onChange);

    _collection = null;
    _selectBox = null;
    _this.el = null;
  };

  /**
   * Update select box items.
   */
  _this.render = function () {
    var data = _collection.data(),
        selected = _collection.getSelected(),
        i,
        len,
        markup = [];

    for (i = 0, len = data.length; i < len; i++) {
      markup.push('<option value="' + i + '"' +
          (selected === data[i] ? ' selected="selected"' : '') +
          '>' + _format(data[i]) + '</option>');
    }

    _selectBox.innerHTML = markup.join('');
    _onSelect();
  };


  _initialize();
  return _this;
};

module.exports = CollectionSelectBox;