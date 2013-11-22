/* global define */
define([
	'mvc/View',
	'util/Util'
], function (
	View,
	Util
) {
	'use strict';

	var SELECT_VIEW_COUNTER = 0;
	var DEFAULTS = {

	};

	/**
	 * This class provides a simple select box widget for selecting an item
	 * out of a collection. Best used on short-ish collections.
	 *
	 */
	var SelectView = function (options) {
		options = Util.extend({}, DEFAULTS, options || {});

		this._collection = options.collection || null;
		this._el = options.el || document.createElement('select');

		this._idstub = 'selectview-' + SELECT_VIEW_COUNTER + '-';
		SELECT_VIEW_COUNTER += 1;

		View.call(this, options);
	};
	SelectView.prototype = Object.create(View.prototype);

	SelectView.prototype.render = function () {
		var i = null,
		    items = null,
		    numItems = null,
		    selected = null,
		    markup = [];

		// If no collection available, just clear the options and return
		if (!this._collection) {
			this._selectBox.innerHTML = '';
			return;
		}

		// Set the select box option items
		items = this._collection.data();

		if (!items) {
			this._selectBox.innerHTML = '';
			return;
		}

		items = items.slice(0);
		numItems = items.length;

		for (i = 0; i < numItems; i++) {
			markup.push(this._createItemMarkup(items[i]));
		}

		this._selectBox.innerHTML = markup.join('');

		// Now select the currently selected item (if one is selected)
		selected = this._collection.getSelected();
		if (selected) {
			this._onCollectionSelect(selected);
		}
	};

	SelectView.prototype._initialize = function () {
		// Make a private DOM element. If this._el is already a select DOM element,
		// then just use that, otherwise, create a new element and append it to
		// this._el
		if (this._el.nodeName === 'SELECT') {
			this._selectBox = this._el;
		} else {
			this._selectBox = this._el.appendChild(document.createElement('select'));
		}

		Util.addClass(this._selectBox, 'view-selectview');

		// Bind to events on the collection
		if (this._collection) {
			this._collection.on('add', this._onCollectionAdd, this);
			this._collection.on('remove', this._onCollectionRemove, this);
			this._collection.on('reset', this._onCollectionReset, this);
			this._collection.on('select', this._onCollectionSelect, this);
			this._collection.on('deselect', this._onCollectionDeselect, this);
		}

		// Bind to events on this._selectBox
		Util.addEvent(this._selectBox, 'change', (function (selectView) {
			return function (evt) {
				selectView._onSelectBoxChange(evt);
			};
		})(this));

		this.render();
	};

	SelectView.prototype._createItemMarkup = function (item) {
		return [
		'<option ',
				'id="', this._getDOMIdForItem(item), '" ',
				'value="', item.get('value'), '">',
			item.get('display'),
		'</option>'
		].join('');
	};

	SelectView.prototype._getDOMIdForItem = function (item) {
		return this._idstub + item.get('id');
	};

	SelectView.prototype._getModelIdForOption = function (element) {
		return element.id.replace(this._idstub, '');
	};


	SelectView.prototype._onCollectionAdd = function () {
		this.render();
	};

	SelectView.prototype._onCollectionRemove = function () {
		this.render();
	};

	SelectView.prototype._onCollectionReset = function () {
		this.render();
	};

	SelectView.prototype._onCollectionSelect = function (selectedItem) {
		var selectedDOM = this._selectBox.querySelector(
				'#' + this._getDOMIdForItem(selectedItem));

		if (selectedDOM) {
			selectedDOM.setAttribute('selected', 'selected');
		}
	};

	SelectView.prototype._onCollectionDeselect = function (oldSelected) {
		var selectedDOM = this._selectBox.querySelector(
				'#' + this._getDOMIdForItem(oldSelected));

		if (selectedDOM) {
			selectedDOM.removeAttribute('selected');
		}
	};

	SelectView.prototype._onSelectBoxChange = function () {
		var selectedIndex = this._selectBox.selectedIndex,
		    selectedDOM = this._selectBox.childNodes[selectedIndex],
		    selectedId = this._getModelIdForOption(selectedDOM);

		this._collection.select(this._collection.get(selectedId));
	};

	return SelectView;
});
