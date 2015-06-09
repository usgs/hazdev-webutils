'use strict';

var Collection = require('./Collection');


/** create a new view based on a collection of models. */
var SelectedCollectionView = function (params) {
  var _this,
      _initialize,

      _destroyCollection;

  _this = {};

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

    if (_this.collection.getSelected()) {
      _this.onCollectionSelect();
    }

    _this.collection.on('deselect', 'onCollectionDeselect', _this);
    _this.collection.on('select', 'onCollectionSelect', _this);
  };

  /**
   * clean up the view
   */
  _this.destroy = function () {
    // undo event bindings
    if (_this.model) {
      _this.model.off('change', 'render', _this);
      _this.model = null;
    }
    _this.collection.off('deselect', 'onCollectionDeselect', _this);
    _this.collection.off('select', 'onCollectionSelect', _this);

    if (_destroyCollection) {
      _this.collection.destroy();
    }

    _destroyCollection = null;

    _this = null;
    _initialize = null;
  };

  /**
   * unset the event bindings for the collection
   */
  _this.onCollectionDeselect = function () {
    _this.model.off('change', 'render', _this);
    _this.model = null;
    _this.render();
  };

  /**
   * set event bindings for the collection
   */
  _this.onCollectionSelect = function () {
    _this.model = _this.collection.getSelected();
    _this.model.on('change', 'render', _this);
    _this.render();
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
