'use strict';
/**
 * A Lightweight collection, inspired by backbone.
 *
 * Lazily builds indexes to avoid overhead until needed.
 */

var Events = require('../util/Events'),
    Util = require('../util/Util');


var __compare,
    __index,
    __intersect,
    __remove;


/**
 * Find differences between arrays.
 *
 * @param before {Array<Object>}
 *        array of objects.
 * @param after {Array<Object>}
 *        array of objects.
 * @return {Object}
 *         object with comparison.
 *         keys are "added", "removed", "same".
 *         values are {Array<Object>}.
 */
__compare = function (before, after) {
  var added,
      afterIndex,
      beforeIndex,
      id,
      removed,
      same;
  beforeIndex = __index(before);
  afterIndex = __index(after);
  same = __intersect(before, after);
  // remove same from before/after indexes, leafing added/removed
  for (id in same) {
    delete beforeIndex[id];
    delete afterIndex[id];
  }
  removed = [];
  for (id in beforeIndex) {
    removed.push(before[beforeIndex[id]]);
  }
  added = [];
  for (id in afterIndex) {
    added.push(after[afterIndex[id]]);
  }
  // return comparison
  return {
    added: added,
    removed: removed,
    same: same
  };
};

/**
 * Create an index from object ids to array indexes.
 *
 * @param array {Array<Object>}
 *        array to index.
 *        objects must have an "id" property, unique within the array.
 * @return {Object}
 *         keys are object ids, values are object indexes within array.
 * @throws Error
 *         if a duplicate id is found.
 */
__index = function (array) {
  var i,
      len,
      id,
      index;

  index = {};
  len = array.length;
  for (i = 0; i < len; i++) {
    id = array[i].id;
    if (index.hasOwnProperty(id)) {
      throw new Error('duplicate object in collection');
    }
    index[id] = i;
  }

  return index;
};


/**
 * Find the intersection of two arrays.
 *
 * @param array1 {Array<Object>}
 *        array of objects.
 * @param array2 {Array<Object>}
 *        array of objects.
 * @return {Array<Object>}
 *         array containing objects that appear in array1 and array2.
 */
__intersect = function (array1, array2) {
  var id,
      index1,
      index2,
      intersect,
      temp;
  // loop over shortest array
  if (array1.length > array2.length) {
    temp = array1;
    array1 = array2;
    array2 = temp;
    temp = null;
  }
  // find intersection
  intersect = [];
  index1 = __index(array1);
  index2 = __index(array2);
  for (id in index1) {
    if (id in index2) {
      intersect.push(array1[index1[id]]);
    }
  }
  // done
  return intersect;
};


/**
 * Remove items from an array.
 *
 * @param array {Array<Object>}
 *        array containing items.
 *        objects must have an "id" property, unique within the array.
 * @param toremove {Array<Object>}
 *        objects to remove.
 *        objects must have an "id" property, unique within the array.
 * @param options {Object}
 *        remove options.
 * @param options.index {Object}
 *        default _index(array).
 *        index mapping ids to array indexes.
 * @param options.throw {Boolean}
 *        default true.
 *        throw exception if attempting to remove object not in original array.
 * @return {Array<Object>}
 *         items that were removed.
 * @throws Error
 *         if any object toremove is not found.
 */
__remove = function (array, toremove, options) {
  var i,
      index,
      indexes,
      len,
      o,
      removed;


  options = options || {};
  index = options.index || __index(array);
  removed = [];

  // find indexes of objects to be removed
  indexes = [];
  len = toremove.length;
  for (i = 0; i < len; i++) {
    o = toremove[i];
    if (index.hasOwnProperty(o.id)) {
      indexes.push(index[o.id]);
    } else {
      if (options.throw !== false) {
        throw new Error('object not in collection');
      }
    }
  }
  // remove in descending index order,
  // so indexes of items being removed do not change.
  indexes.sort(function (a, b) {
    return a - b;
  });
  for (i = indexes.length - 1; i >= 0; i--) {
    removed = removed.concat(array.splice(indexes[i], 1));
  }

  return removed;
};


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
    _selected = [];

    data = null;
  };


  /**
   * Add objects to the collection.
   *
   * Calls addAll().
   *
   * @param {Object…}
   *      a variable number of objects to append to the collection.
   * @deprecated use allAll() instead.
   */
  _this.add = function () {
    _this.addAll(Array.prototype.slice.call(arguments, 0));
  };

  /**
   * Add objects to the collection.
   *
   * @param toadd {Array<Object>}
   *        objects to add.
   * @param options {Object}
   *        options are passed to listeners.
   * @param options.silent {Boolean}
   *        default true.
   *        do not notify listeners.
   */
  _this.addAll = function (toadd, options) {
    var change;

    _data.push.apply(_data, toadd);
    _ids = null;

    options = options || {};
    if (options.silent !== true) {
      // trigger events
      change = {
        type: 'add',
        added: toadd,
        options: options
      };
      _this.trigger('change:add', change);
      _this.trigger('change');
    }
  };

  /**
   * Add one or more objects to selection.
   *
   * @param toadd {Array<Object>}
   *        objects to add.
   * @param options {Object}
   *        options are passed to _this.selectAll.
   * @param options.allowExisting {Boolean}
   *        default false.
   *        when true, do not throw exceptions if an object is already selected.
   */
  _this.addToSelection = function (toadd, options) {
    var i,
        id,
        ids,
        len,
        selected,
        selected_ids;

    options = options || {};
    ids = _this.getIds();
    selected = _selected.slice(0);
    selected_ids = __index(selected);
    // verify objects being selected
    len = toadd.length;
    for (i = 0; i < len; i++) {
      id = toadd[i].id;
      if (!ids.hasOwnProperty(id)) {
        throw new Error('object not in collection');
      }
      if (selected_ids.hasOwnProperty(id)) {
        if (options.allowExisting !== true) {
          throw new Error('object already selected');
        }
      } else {
        selected.push(_this.get(id));
        // mark that item is selected
        selected_ids[id] = true;
      }
    }
    if (selected.length !== _selected.length) {
      // update selection
      _this.selectAll(selected, options);
    }
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
   * Free the array and id cache.
   *
   * Util.compose calls Events.destroy after Collection.destroy.
   *
   * @param options {Object}
   *        options passed to Events.destroy.
   */
  _this.destroy = Util.compose(function (options) {
    _data = null;
    _ids = null;
    _selected = null;

    return options;
  }, _this.destroy);

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
    if (force || _ids === null) {
      _ids = __index(_data);
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
   * Remove objects from the collection.
   *
   * This method calls array.splice and removes one item from array.
   * Reset would be faster if modifying large chunks of the array.
   *
   * @param {Object…}
   *      a variable number of objects to remove from the collection.
   * @deprecated use removeAll() instead.
   */
  _this.remove = function () {
    _this.removeAll(Array.prototype.slice.call(arguments, 0));
  };

  /**
   * Remove objects from the collection.
   *
   * @param toremove {Array<Object>}
   *        objects to remove.
   * @param options {Object}
   *        options are passed to listeners.
   * @param options.silent {Boolean}
   *        default true.
   *        do not notify listeners.
   */
  _this.removeAll = function (toremove, options) {
    var change,
        removed;

    // remove from selection first
    _this.removeFromSelection(__intersect(_selected, toremove), {silent: true});
    // remove from array
    removed = __remove(_data, toremove, {index: _this.getIds()});
    // reset id cache
    _ids = null;

    options = options || {};
    if (options.silent !== true) {
      // trigger events
      change = {
        type: 'remove',
        removed: toremove,
        options: options
      };
      _this.trigger('change:remove', change);
      _this.trigger('change', change);
    }
  };

  /**
   * Remove one or more objects from selection.
   *
   * @param toremove {Array<Object>}
   *        objects to remove.
   * @param options {Object}
   *        options are passed to _this.select.
   */
  _this.removeFromSelection = function (toremove, options) {
    var i,
        id,
        ids,
        len,
        removed,
        selected,
        selected_ids;

    ids = _this.getIds();
    selected = _selected.slice(0);
    selected_ids = __index(selected);
    // verify objects being deselected
    len = toremove.length;
    for (i = 0; i < len; i++) {
      id = toremove[i].id;
      if (!ids.hasOwnProperty(id)) {
        throw new Error('object not in collection');
      }
      if (!selected_ids.hasOwnProperty(id)) {
        throw new Error('object not selected');
      }
      // mark that item is deselected
      delete selected_ids[id];
    }
    // remove from array
    removed = __remove(selected, toremove);
    if (selected.length !== _selected.length) {
      // update selection
      _this.selectAll(selected, options);
    }
  };

  /**
   * Replace the wrapped array with a new one.
   */
  _this.reset = function (data, options) {
    var change,
        oldData,
        oldSelected;

    // save existing
    oldData = _data;
    oldSelected = _selected;
    // set new array
    _data = data || [];
    _selected = [];
    _ids = null;
    // restore any selection
    _this.addToSelection(__intersect(oldSelected, _data));

    // notify listeners
    options = options || {};
    if (options.silent !== true) {
      change = {
        type: 'reset',
        data: _data,
        oldData: oldData,
        selected: _selected,
        oldSelected: oldSelected,
        options: options
      };
      _this.trigger('change:reset', change);
      _this.trigger('change', change);
    }
    oldData = null;
    oldSelected = null;
  };

  /**
   * Select an object in the collection.
   *
   * @param obj {Object}
   *      object in the collection to select.
   * @throws exception
   *      if obj not in collection.
   * @deprecated use selectAll().
   */
  _this.select = function (obj, options) {
    _this.selectAll((obj !== null ? [obj] : []), options);
  };

  /**
   * Select objects in the collection.
   *
   * @param toselect {Array<Object>}
   *        objects to select.
   * @param options {Object}
   *        options are passed to listeners.
   * @param options.silent {Boolean}
   *        default true.
   *        do not notify listeners.
   */
  _this.selectAll = function (toselect, options) {
    var change,
        i,
        id,
        ids,
        index,
        len,
        oldSelected,
        selected_ids;

    ids = _this.getIds();
    selected_ids = __index(_selected);

    // track whether selection is changing
    change = false;
    // check things being selected
    len = toselect.length;
    for (i = 0; i < len; i++) {
      id = toselect[i].id;
      if (!ids.hasOwnProperty(id)) {
        throw new Error('object not in collection');
      }
      // see if already selected
      if (selected_ids.hasOwnProperty(id)) {
        // already selected
        delete selected_ids[id];
      } else {
        // adding to selection
        change = true;
      }
    }
    if (!change) {
      if (toselect.length !== _selected.length) {
        // selection size is changing
        change = true;
      } else {
        for (id in index) {
          // anything left in index is being removed
          change = true;
          break;
        }
      }
    }

    if (!change) {
      // no change to selection
      return;
    }
    // make change
    oldSelected = _selected;
    _selected = toselect;
    // notify listeners
    options = options || {};
    if (options.silent !== true) {
      change = {
        type: 'select',
        selected: _selected,
        oldSelected: oldSelected,
        options: options
      };
      _this.trigger('change:select', change);
      _this.trigger('change', change);
    }
  };

  /**
   * Utility method to select collection item using its id.
   *
   * @param id {?}
   *        id of object to select.
   * @deprecated use addToSelection.
   */
  _this.selectById = function (id) {
    var obj = _this.get(id);
    _this.select(obj);
  };

  /**
   * Sorts the data.
   *
   * @param method {Function(Object, Object)}
   *        sorting method.
   * @param options {Object}
   *        options are passed to reset after sort.
   */
  _this.sort = function (method, options) {
    _data.sort(method);
    // "reset" to new sort order
    _this.reset(_data, options);
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


// export global functions
Collection.compare = __compare;
Collection.index = __index;
Collection.intersect = __intersect;
Collection.remove = __remove;


module.exports = Collection;
