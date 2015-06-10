'use strict';
/**
 * A Lightweight collection, inspired by backbone.
 *
 * Lazily builds indexes to avoid overhead until needed.
 */

var Events = require('../util/Events');


/**
 * Create a new Collection.
 *
 * @param data {Array}
 *      When omitted a new array is created.
 */
var Collection = function (data) {

  var _this,
      _initialize,

      _data,
      _ids,
      _selected;


  _this = Events();

  _initialize = function () {
    _data = data || [];
    _ids = null;
    _selected = null;

    data = null;
  };


  /**
   * Add objects to the collection.
   *
   * Calls wrapped array.push, and clears the id cache.
   *
   * @param {Object…}
   *      a variable number of objects to append to the collection.
   */
  _this.add = function () {
    _data.push.apply(_data, arguments);
    _ids = null;
    _this.trigger('add', Array.prototype.slice.call(arguments, 0));
  };

  /**
   * Get the wrapped array.
   *
   * @return
   *      the wrapped array.
   */
  _this.data = function () {
    return _data;
  };

  /**
   * Deselect current selection.
   */
  _this.deselect = function () {
    if (_selected !== null) {
      var oldSelected = _selected;
      _selected = null;
      _this.trigger('deselect', oldSelected);
    }
  };

  /**
   * Free the array and id cache.
   */
  _this.destroy = function () {
    _data = null;
    _ids = null;
    _this.deselect();
  };

  /**
   * Get an object in the collection by ID.
   *
   * Uses getIds(), so builds map of ID to INDEX on first access O(N).
   * Subsequent access should be O(1).
   *
   * @param id {Any}
   *      if the collection contains more than one object with the same id,
   *      the last element with that id is returned.
   */
  _this.get = function (id) {
    var ids = _this.getIds();

    if (ids.hasOwnProperty(id)) {
      // use cached index
      return _data[ids[id]];
    } else {
      return null;
    }
  };

  /**
   * Get a map from ID to INDEX.
   *
   * @param force {Boolean}
   *      rebuild the map even if it exists.
   */
  _this.getIds = function (force) {
    var i = 0,
        len = _data.length,
        id;

    if (force || _ids === null) {
      // build up ids first time through
      _ids = {};

      for (; i < len; i++) {
        id = _data[i].id;

        if (_ids.hasOwnProperty(id)) {
          throw 'model with duplicate id "' + id + '" found in collection';
        }

        _ids[id] = i;
      }
    }

    return _ids;
  };

  /**
   * Get the currently selected object.
   */
  _this.getSelected = function () {
    return _selected;
  };

  /**
   * Remove one object from the collection.
   *
   * This method calls array.splice and removes one item from array.
   * Reset would be faster if modifying large chunks of the array.
   *
   * @param o {Object}
   *      object to remove.
   */
  _this.remove = function (o) {
    var i,
        len = arguments.length,
        indexes = [],
        ids = _this.getIds();

    // select indexes to be removed
    for (i = 0; i < len; i++) {
      o = arguments[i];

      // clear current selection if being removed
      if (o === _selected) {
        _this.deselect();
      }

      // add to list to be removed
      if (ids.hasOwnProperty(o.id)) {
        indexes.push(ids[o.id]);
      } else {
        throw 'removing object not in collection';
      }
    }

    // remove in descending index order
    indexes.sort(function(a,b) { return a-b; });

    for (i = indexes.length-1; i >= 0; i--) {
      _data.splice(indexes[i], 1);
    }

    // reset id cache
    _ids = null;

    // trigger remove event
    _this.trigger('remove', Array.prototype.slice.call(arguments, 0));
  };

  /**
   * Replace the wrapped array with a new one.
   */
  _this.reset = function (data) {
    // check for existing selection
    var selectedId = null;
    if (_selected !== null) {
      selectedId = _selected.id;
    }

    // free array and id cache
    _this.destroy();

    // set new array
    _data = data || [];

    // notify listeners
    _this.trigger('reset', data);

    // reselect if there was a previous selection
    if (selectedId !== null) {
      var selected = _this.get(selectedId);
      if (selected !== null) {
        _this.select(selected, {'reset':true});
      }
    }
  };

  /**
   * Select an object in the collection.
   *
   * @param obj {Object}
   *      object in the collection to select.
   * @throws exception
   *      if obj not in collection.
   */
  _this.select = function (obj, options) {
    if (_selected !== null) {
      _this.deselect();
    }

    if (obj === null || obj === _this.get(obj.id)) {
      // make sure it's part of this collection…
      _selected = obj;
      _this.trigger('select', _selected, options);
    } else {
      throw 'selecting object not in collection';
    }
  };

  /**
   * Utility method to select collection item using its id.
   */
  _this.selectById = function (id) {
    var obj = _this.get(id);
    if (obj !== null) {
      _this.select(obj);
    } else {
      _this.deselect();
    }
  };

  /**
   * Sorts the data.
   */
  _this.sort = function (method) {
    _data.sort(method);

    // "reset" to new sort order
    _this.reset(_data);
  };

  /**
   * Override toJSON method to serialize only collection data.
   */
  _this.toJSON = function () {
    var json = _data.slice(0),
        item,
        i,
        len;

    for (i = 0, len = json.length; i < len; i++) {
      item = json[i];
      if (typeof item === 'object' &&
          item !== null &&
          typeof item.toJSON === 'function') {
        json[i] = item.toJSON();
      }
    }

    return json;
  };


  _initialize();
  return _this;
};

module.exports = Collection;