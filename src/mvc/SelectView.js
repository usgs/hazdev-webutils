'use strict';
/**
 * This class provides a simple select box widget for selecting an item
 * out of a collection. Best used on short-ish collections.
 *
 */

var Collection = require('./Collection'),
    Util = require('../util/Util'),
    View = require('./View');


var _SELECT_VIEW_COUNTER = 0;
var _DEFAULTS = {
  includeBlankOption: false,
  blankOption: {
    value: '-1',
    text: 'Please select&hellip;'
  }
};


var SelectView = function (params) {
  var _this,
      _initialize,

      _blankOption,
      _collection,
      _idstub,
      _includeBlankOption,
      _selectBox,

      _createBlankOption,
      _createItemMarkup,
      _getDOMIdForItem,
      _getModelIdForOption,
      _onCollectionAdd,
      _onCollectionDeselect,
      _onCollectionRemove,
      _onCollectionReset,
      _onCollectionSelect,
      _onSelectBoxChange;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);


  _initialize = function () {

    _collection = params.collection || null;
    _blankOption = params.blankOption;
    _includeBlankOption = params.includeBlankOption;
    _this.el = params.el || document.createElement('select');

    // Make a private DOM element. If _this.el is already a select DOM element,
    // then just use that, otherwise, create a new element and append it to
    // _this.el
    if (_this.el.nodeName === 'SELECT') {
      _selectBox = _this.el;
    } else {
      _selectBox = _this.el.appendChild(document.createElement('select'));
    }
    _selectBox.classList.add('view-selectview');

    // Bind to events on the collection
    if (_collection) {
      _collection.on('change', 'render', _this);
      _collection.on('change:select', _onCollectionSelect, _this);
    }

    // Bind to events on _selectBox
    _selectBox.addEventListener('change', _onSelectBoxChange);

    _this.render();
    params = null;
  };


  _createItemMarkup = function (item) {
    return [
    '<option',
        ' data-id="', item.id, '"',
        ' value="', item.get('value'), '"',
        '>',
      item.get('display'),
    '</option>'
    ].join('');
  };

  _createBlankOption = function () {
    return [
    '<option',
        ' data-id="blank"',
        ' value="', _blankOption.value, '"',
        '>',
      _blankOption.text,
    '</option>'
    ].join('');
  };

  _onCollectionSelect = function () {
    var el,
        i,
        id,
        index,
        len,
        selected;

    selected = _collection.getSelected();
    index = Collection.index(selected);
    // deselect old selection
    selected = _selectBox.querySelectorAll(':checked');
    len = selected.length;
    for (i = 0; i < len; i++) {
      el = selected[i];
      id = el.getAttribute('data-id');
      if (id in index) {
        // still selected, don't select below
        delete index[id];
      } else {
        el.selected = false;
      }
    }
    // add new selection
    for (id in index) {
      el = _selectBox.querySelector('[data-id="' + id + '"]');
      el.selected = true;
    }
  };

  _onSelectBoxChange = function () {
    var selectedIndex = _selectBox.selectedIndex,
        selectedDOM = _selectBox.childNodes[selectedIndex],
        selectedId = selectedDOM.getAttribute('data-id');
    if (_includeBlankOption && _selectBox.value === _blankOption.value) {
      _collection.select(null);
    } else {
      _collection.selectById(selectedId);
    }
  };


  _this.render = function () {
    var i = null,
        items = null,
        numItems = null,
        selected = null,
        markup = [];

    // If no collection available, just clear the options and return
    if (!_collection) {
      _selectBox.innerHTML = '';
      return;
    }

    // Set the select box option items
    items = _collection.data();

    if (!items) {
      _selectBox.innerHTML = '';
      return;
    }

    items = items.slice(0);
    numItems = items.length;

    if (_includeBlankOption === true) {
      markup.push(_createBlankOption());
    }

    for (i = 0; i < numItems; i++) {
      markup.push(_createItemMarkup(items[i]));
    }

    _selectBox.innerHTML = markup.join('');

    // Now select the currently selected item (if one is selected)
    selected = _collection.getSelected();
    if (selected) {
      _onCollectionSelect(selected);
    }
  };


  _initialize();
  return _this;
};

module.exports = SelectView;
