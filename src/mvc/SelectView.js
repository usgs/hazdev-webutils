'use strict';
/**
 * This class provides a simple select box widget for selecting an item
 * out of a collection. Best used on short-ish collections.
 *
 */

var Util = require('../util/Util'),
    View = require('./View');


var _SELECT_VIEW_COUNTER = 0;
var _DEFAULTS = {
};


var SelectView = function (params) {
  var _this,
      _initialize,

      _collection,
      _idstub,
      _selectBox,

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
  _this = Object.create(View(params));

  _initialize = function () {

    _collection = params.collection || null;
    _this.el = params.el || document.createElement('select');

    _idstub = 'selectview-' + _SELECT_VIEW_COUNTER + '-';
    _SELECT_VIEW_COUNTER += 1;


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
      _collection.on('add', _onCollectionAdd, _this);
      _collection.on('remove', _onCollectionRemove, _this);
      _collection.on('reset', _onCollectionReset, _this);
      _collection.on('select', _onCollectionSelect, _this);
      _collection.on('deselect', _onCollectionDeselect, _this);
    }

    // Bind to events on _selectBox
    _selectBox.addEventListener('change', _onSelectBoxChange);

    _this.render();
    params = null;
  };


  _createItemMarkup = function (item) {
    return [
    '<option ',
        'id="', _getDOMIdForItem(item), '" ',
        'value="', item.get('value'), '">',
      item.get('display'),
    '</option>'
    ].join('');
  };

  _getDOMIdForItem = function (item) {
    return _idstub + item.get('id');
  };

  _getModelIdForOption = function (element) {
    return element.id.replace(_idstub, '');
  };

  _onCollectionAdd = function () {
    _this.render();
  };

  _onCollectionDeselect = function (oldSelected) {
    var selectedDOM = _selectBox.querySelector(
        '#' + _getDOMIdForItem(oldSelected));

    if (selectedDOM) {
      selectedDOM.removeAttribute('selected');
    }
  };

  _onCollectionRemove = function () {
    _this.render();
  };

  _onCollectionReset = function () {
    _this.render();
  };

  _onCollectionSelect = function (selectedItem) {
    var selectedDOM = _selectBox.querySelector(
        '#' + _getDOMIdForItem(selectedItem));

    if (selectedDOM) {
      selectedDOM.setAttribute('selected', 'selected');
    }
  };

  _onSelectBoxChange = function () {
    var selectedIndex = _selectBox.selectedIndex,
        selectedDOM = _selectBox.childNodes[selectedIndex],
        selectedId = _getModelIdForOption(selectedDOM);

    _collection.select(_collection.get(selectedId));
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