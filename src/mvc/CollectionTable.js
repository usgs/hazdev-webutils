/* global define */
define([
	'util/Util',
	'./View'
], function (
	Util,
	View
) {
	'use strict';

	var DEFAULTS = {
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
			//}
		],
		emptyMarkup: 'No data to display',
		// whether to render after initialization
		renderNow: true
	};

	/**
	 * Create a CollectionTable to display a collection.
	 *
	 * @param options {Object}
	 * @param options.collection {Collection}
	 *        Collection to display.
	 * @param options.columns {Array<Object>}
	 *        Array of column objects defining display.
	 *        Each object should have these properties:
	 *        - className {String} class name for header and data cells.
	 *        - title {String} markup for header cell.
	 *        - format {Function(item)} function to format data cell.
	 * @param options.clickToSelect {Boolean}
	 *        Default false.  Whether clicking on table rows should select
	 *        the corresponding collection item.
	 * @see mvc/View
	 */
	var CollectionTable = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, options);
	};

	/**
	 * Initialize the CollectionTable.
	 */
	CollectionTable.prototype._initialize = function () {
		var options = this._options,
		    collection = options.collection;

		// respond to collection events
		collection.on('add', this.render, this);
		collection.on('remove', this.render, this);
		collection.on('reset', this.render, this);
		collection.on('select', this._onSelect, this);
		collection.on('deselect', this._onSelect, this);
		this._collection = options.collection;

		// add click handler
		if (options.clickToSelect) {
			this._onClick = this._onClick.bind(this);
			this._el.addEventListener('click', this._onClick);
		}

		if (options.renderNow) {
			this.render();
		}
	};

	/**
	 * Undo initialization and free references.
	 */
	CollectionTable.prototype.destroy = function () {
		var options = this._options,
		    collection = options.collection;

		collection.off('add', this.render, this);
		collection.off('remove', this.render, this);
		collection.off('reset', this.render, this);
		collection.off('select', this._onSelect, this);
		collection.off('deselect', this._onSelect, this);
		this._collection = null;

		if (options.clickToSelect) {
			this._el.removeEventListener('click', this._onClick);
			delete this._onClick;
		}

		this._options = null;

		// call parent destroy()
		View.prototype.destroy.call(this);
	};

	/**
	 * Render the view.
	 */
	CollectionTable.prototype.render = function () {
		var options = this._options,
		    columns = options.columns,
		    column,
		    c, cLen,
		    data = this._collection.data(),
		    item, id,
		    i, iLen,
		    markup = [];

		if (data.length === 0) {
			this._el.innerHTML = options.emptyMarkup;
			return;
		}

		markup.push('<table class="', options.className, '"><thead>');
		for (c = 0, cLen = columns.length; c < cLen; c++) {
			column = columns[c];
			markup.push('<th class="' + column.className + '">' +
					column.title + '</th>');
		}
		markup.push('</thead><tbody>');
		for (i = 0, iLen = data.length; i < iLen; i++) {
			item = data[i];
			id = ('' + item.id).replace(/"/g, '&quot;');
			markup.push('<tr data-id="' + id + '">');
			for (c = 0, cLen = columns.length; c < cLen; c++) {
				column = columns[c];
				markup.push('<td class="' + column.className + '">' +
						column.format(item) + '</td>');
			}
			markup.push('</tr>');
		}
		markup.push('</tbody></table>');

		this._el.innerHTML = markup.join('');
	};

	/**
	 * Handle collection select and deselect events.
	 */
	CollectionTable.prototype._onSelect = function () {
		var el = this._el,
		    collection = this._collection,
		    selected;

		// remove previous selection
		selected = el.querySelector('.selected');
		if (selected) {
			selected.classList.remove('selected');
		}

		// set new selection
		selected = collection.getSelected();
		if (selected) {
			selected = el.querySelector('[data-id="' + selected.id + '"]');
			selected.classList.add('selected');
		}
	};

	/**
	 * Handle table click events.
	 * Listener is only added when options.clickToSelect is true.
	 */
	CollectionTable.prototype._onClick = function (e) {
		var target = e.target,
		    row = Util.getParentNode(target, 'TR', this._el);

		if (row !== null) {
			if (row.parentNode.nodeName.toUpperCase() === 'TBODY') {
				this._collection.selectById(row.getAttribute('data-id'));
			}
		}
	};

	// return constructor
	return CollectionTable;
});