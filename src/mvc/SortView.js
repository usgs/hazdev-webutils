'use strict';

var Collection = require('./Collection'),
    CollectionSelectBox = require('./CollectionSelectBox'),
    View = require('./View');

/**
 * Construct a SortView.
 *
 * Sort objects can specify a custom sort function (sort),
 * or a value to be sorted (sortBy) and sort order (descending).
 *
 * @param options {Object}
 * @param options.sorts {Array<Object>}
 *        array of sort objects, with properties:
 *        - id {String|Number} unique identifier for sort
 *        - title {String} display name for sort
 *        And:
 *        - sort {Function(a, b)} sorting function.
 *        Or:
 *        - sortBy {Function(Object)} return value for sorting.
 *        - descending {Boolean} default false, whether to
 *          sort ascending (true) or descending (false).
 * @param options.defaultSort {ID}
 *        Optional.
 *        If specified, should match "id" of a sort object.
 * @see mvc/View
 */
var SortView = function (params) {
  var _this,
      _initialize,

      _collection,
      _selectView,
      _sortCollection,

      _getSortFunction,
      _onSelect,
      _parentDestroy;


  _this = Object.create(View(params));

  /**
   * Initialize the SortView.
   */
  _initialize = function () {
    var el = _this.el;

    _collection = params.collection;

    el.innerHTML = '<label>Sort by <select></select></label>';
    el.classList.add('sortview');

    _sortCollection = new Collection(params.sorts);
    _sortCollection.on('select', _onSelect, this);

    // initial sort order
    if (params.defaultSort) {
      _sortCollection.select(_sortCollection.get(params.defaultSort));
    } else {
      _sortCollection.select(_sortCollection.data()[0]);
    }

    _selectView = new CollectionSelectBox({
      el: el.querySelector('select'),
      collection: _sortCollection,
      format: function (item) {
        return item.title;
      }
    });

    params = null;
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
  _getSortFunction = function (sortBy, descending) {
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

  /**
   * Handle sort collection select event.
   */
  _onSelect = function () {
    var selected = this._sortCollection.getSelected(),
        sort;

    if (selected) {
      sort = selected.sort;
      if (!sort) {
        sort = this._getSortFunction(selected.sortBy, selected.descending);
      }
      this._collection.sort(sort);
    }
  };


  /**
   * Destroy the SortView.
   */
  _parentDestroy = _this.destroy || function () {}; // TODO :: Better way?
  _this.destroy = function () {
    _sortCollection.off('select', _onSelect, this);
    _sortCollection = null;
    _collection = null;
    _selectView.destroy();

    // call parent destroy
    _parentDestroy.call(this);
  };


  _initialize();
  return _this;
};

module.exports = SortView;