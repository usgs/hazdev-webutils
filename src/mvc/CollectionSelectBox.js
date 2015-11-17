'use strict';

var Util = require('../util/Util'),
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

  // callback to return valid options to remain enabled; falsey = enable all
  getValidOptions: false,

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
    _getValidOptions = params.getValidOptions;

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
    var value = _selectBox.value;

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
    var selected = _collection.getSelected();

    if (selected) {
      _selectBox.value = selected.id;
    } else if (_includeBlankOption) {
      _selectBox.value = _blankOption.value;
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


    _blankOption = null;
    _collection = null;
    _includeBlankOption = null;
    _format = null;
    _getValidOptions = null;
    _selectBox = null;


    _createBlankOption = null;
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
        selected,
        i,
        id,
        len,
        markup,
        validOptions;

    data = _collection.data();
    selected = _collection.getSelected();
    markup = [];

    if (_includeBlankOption === true) {
      markup.push(_createBlankOption());
    }

    if (_getValidOptions) {
      validOptions = _getValidOptions();
    } else {
      validOptions = data.map(function (o) { return o.id; });
    }

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


  _initialize();
  return _this;
};

module.exports = CollectionSelectBox;
