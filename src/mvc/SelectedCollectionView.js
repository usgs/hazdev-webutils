'use strict';

var Collection = require('./Collection'),
    Events = require('../util/Events'),
    Util = require('../util/Util');


/** create a new view based on a collection of models. */
var SelectedCollectionView = function (params) {
  var _this,
      _initialize,

      _destroyCollection;

  _this = Events();

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    params = params || {};

    // Element where this view is rendered
    _this.el = (params.hasOwnProperty('el')) ?
        params.el : document.createElement('div');

    _this.collection = params.collection;
    if (!_this.collection) {
      _this.collection = Collection();
      _destroyCollection = true;
    }
    _this.model = null;

    _this.onCollectionSelect();
    _this.collection.on('change:select', 'onCollectionSelect', _this);
  };

  /**
   * clean up the view
   */
  _this.destroy = Util.compose(function (options) {
    if (_this !== null) {
      // undo event bindings
      _this.setModel(null);
      _this.collection.off('change:select', 'onCollectionSelect', _this);

      if (_destroyCollection) {
        _this.collection.destroy();
      }

      _destroyCollection = null;
      _this = null;
      _initialize = null;
    }

    return options;
  }, _this.destroy);

  /**
   * set event bindings for the collection
   */
  _this.onCollectionSelect = function () {
    var len,
        selected;
    selected = _this.collection.getSelected();
    len = selected.length;
    if (len > 1) {
      throw new Error('SelectedCollectionView only supports single selection');
    } else if (len === 1) {
      _this.setModel(selected[0]);
    } else {
      _this.setModel(null);
    }
  };

  _this.setModel = function (model) {
    if (_this.model === model) {
      // nothing to do
      return;
    }
    if (_this.model !== null) {
      // unbind existing model
      _this.model.off('change', 'render', _this);
    }
    // set new model
    _this.model = model;
    if (_this.model !== null) {
      // bind to new model
      _this.model.on('change', 'render', _this);
    }
    _this.render({model: _this.model});
  };

  /**
   * render the selected model in the view
   */
  _this.render = function () {};

  _initialize(params);
  params = null;
  return _this;
};

module.exports = SelectedCollectionView;
