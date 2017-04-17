'use strict';
/**
 * A Lightweight collection, inspired by backbone.
 *
 * Lazily builds indexes to avoid overhead until needed.
 */

var Events = require('../util/Events'),
    Util = require('../util/Util');


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
      _selected,

      _isSilent;


  _this = Events();

  _initialize = function () {
    _data = data || [];
    _ids = null;
    _selected = null;

    data = null;
  };

  /**
   * Whether "silent" option is true.
   *
   * @param options {Object}
   * @param options.silent {Boolean}
   *        default false.
   * @return {Boolean} true if options.silent is true.
   */
  _isSilent = function (options) {
    return options && options.silent === true;
  };

  /**
   * Add objects to the collection.
   *
   * Calls wrapped array.push, and clears the id cache.
   *
   * @param {Object…}
   *      a variable number of objects to append to the collection.
   * @deprecated see #addAll()
   */
  _this.add = function () {
    _this.addAll(Array.prototype.slice.call(arguments, 0));
  };

  /**
   * Add objects to the collection.
   *
   * Calls wrapped array.push, and clears the id cache.
   *
   * @param toadd {Array<Object>}
   *        objects to be added to the collection.
   */
   _this.addAll = function (toadd, options) {
     _data.push.apply(_data, toadd);
     _ids = null;
     if (!_isSilent(options)) {
       _this.trigger('add', toadd);
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
   * Deselect current selection.
   */
  _this.deselect = function (options) {
    if (_selected !== null) {
      var oldSelected = _selected;
      _selected = null;
      if (!_isSilent(options)) {
        _this.trigger('deselect', oldSelected);
      }
    }
  };

  /**
   * Free the array and id cache.
   *
   * @param options {Object}
   *        passed to #deselect().
   */
  _this.destroy = Util.compose(function (options) {
    _data = null;
    _ids = null;
    _selected = null;
    if (!_isSilent(options)) {
      _this.trigger('destroy');
    }
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
   * Remove objects from the collection.
   *
   * This method calls array.splice to remove item from array.
   * Reset would be faster if modifying large chunks of the array.
   *
   * @param o {Object}
   *      object to remove.
   * @deprecated see #removeAll()
   */
  _this.remove = function (/* o */) {
    // trigger remove event
    _this.removeAll(Array.prototype.slice.call(arguments, 0));
  };

  /**
   * Remove objects from the collection.
   *
   * Reset is faster if modifying large chunks of the array.
   *
   * @param toremove {Array<Object>}
   *        objects to remove.
   * @param options {Object}
   * @param options.silent {Boolean}
   *        default false.
   *        whether to trigger events (false), or not (true).
   */
  _this.removeAll = function (toremove, options) {
    var i,
        len = toremove.length,
        indexes = [],
        ids = _this.getIds(),
        o;

    // select indexes to be removed
    for (i = 0; i < len; i++) {
      o = toremove[i];

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

    if (!_isSilent(options)) {
      // trigger remove event
      _this.trigger('remove', toremove);
    }
  };

  /**
   * Replace the wrapped array with a new one.
   */
  _this.reset = function (data, options) {
    // check for existing selection
    var selectedId = null;
    if (_selected !== null) {
      selectedId = _selected.id;
    }

    // free array and id cache
    _data = null;
    _ids = null;
    _selected = null;

    // set new array
    _data = data || [];

    // notify listeners
    if (!options || options.silent !== true) {
      _this.trigger('reset', data);
    }

    // reselect if there was a previous selection
    if (selectedId !== null) {
      var selected = _this.get(selectedId);
      if (selected !== null) {
        options = Util.extend({}, options, {'reset': true});
        _this.select(selected, options);
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
    // no selection
    if (obj === null) {
      _this.deselect();
      return;
    }
    // already selected
    if (obj === _selected) {
      return;
    }
    // deselect previous selection
    if (_selected !== null) {
      _this.deselect(options);
    }

    if (obj === null || obj === _this.get(obj.id)) {
      // make sure it's part of this collection…
      _selected = obj;
      if (!options || options.silent !== true) {
        _this.trigger('select', _selected, options);
      }
    } else {
      throw 'selecting object not in collection';
    }
  };

  /**
   * Utility method to select collection item using its id.
   *
   * Selects matching item if it exists, otherwise clears any selection.
   *
   * @param id {?}
   *        id of item to select.
   * @param options {Object}
   *        options passed to #select() or #deselect().
   */
  _this.selectById = function (id, options) {
    var obj = _this.get(id);
    if (obj !== null) {
      _this.select(obj, options);
    } else {
      _this.deselect(options);
    }
  };

  /**
   * Sorts the data.
   *
   * @param method {Function}
   *        javascript sort method.
   * @param options {Object}
   *        passed to #reset()
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

module.exports = Collection;
