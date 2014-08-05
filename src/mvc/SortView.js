/* global define */
define([
	'mvc/Collection',
	'mvc/View',
	'mvc/CollectionSelectBox'
], function (
	Collection,
	View,
	CollectionSelectBox
) {
	'use strict';

	/**
	 * Construct a SortView.
	 *
	 * @param options {Object}
	 * @param options.sorts {Array<Object>}
	 *        array of sort objects, with properties:
	 *        - id {String|Number} unique identifier for sort
	 *        - title {String} display name for sort
	 *        - sortBy {Function(Object)} return value for sorting.
	 *        - descending {Boolean} default false, whether to
	 *          sort ascending (true) or descending (false).
	 * @param options.defaultSort {ID}
	 *        Optional.
	 *        If specified, should match "id" of a sort object.
	 * @see mvc/View
	 */
	var SortView = function (options) {
		this._options = options;
		View.call(this);
	};

	// extend View
	SortView.prototype = Object.create(View.prototype);


	/**
	 * Initialize the SortView.
	 */
	SortView.prototype._initialize = function () {
		var el = this._el,
		    options = this._options,
		    sortCollection;

		// call parent initialize
		View.prototype._initialize.call(this);

		el.innerHTML = '<label>Sort by ' +
				'<select></select></label>';
		el.classList.add('sortview');

		this._collection = options.collection;

		sortCollection = new Collection(options.sorts);
		sortCollection.on('select', this._onSelect, this);
		this._sortCollection = sortCollection;
		// initial sort order
		if (options.defaultSort) {
			sortCollection.select(sortCollection.get(options.defaultSort));
		} else {
			sortCollection.select(sortCollection.data()[0]);
		}

		this._selectView = new CollectionSelectBox({
			el: el.querySelector('select'),
			collection: sortCollection,
			format: function (item) {
				return item.title;
			}
		});
	};

	/**
	 * Destroy the SortView.
	 */
	SortView.prototype.destroy = function () {
		this._sortCollection.off('select', this._onSelect, this);
		this._sortCollection = null;
		this._collection = null;
		this._selectView.destroy();

		// call parent destroy
		View.prototype.destroy.call(this);
	};

	/**
	 * Handle sort collection select event.
	 */
	SortView.prototype._onSelect = function () {
		var selected = this._sortCollection.getSelected();

		if (selected) {
			this._collection.sort(this._getSortFunction(selected.sortBy, selected.descending));
		}
	};

	/**
	 * Convert a sortBy function to a sort function.
	 *
	 * @param sortBy {Function(Object)}
	 *        function that returns sort key.
	 * @param descending {Boolean}
	 *        Default false.
	 *        Whether to sort ascending (false) or descending (true).
	 * @return {Function(a, b)} sort function.
	 */
	SortView.prototype._getSortFunction = function (sortBy, descending) {
		var cache = {};

		return function (a, b) {
			var aval = cache[a.id],
			    bval = cache[b.id],
			    tmp;

			if (!aval) {
				aval = cache[a.id] = sortBy(a);
			}
			if (!bval) {
				bval = cache[b.id] = sortBy(b);
			}

			if (descending) {
				// swap comparison order
				tmp = bval;
				bval = aval;
				aval = tmp;
			}

			if (aval < bval) {
				return -1;
			} else if (aval > bval) {
				return 1;
			} else {
				return 0;
			}
		};
	};

	// return constructor
	return SortView;
});
