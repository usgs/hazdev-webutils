'use strict';
/**
 * A lightweight view class.
 *
 * Primarily manages an element where a view can render its data.
 */


var Model = require('./Model'),

    Events = require('../util/Events'),
    Util = require('../util/Util');


var _DEFAULTS = {
};


/** create a new view. */
var View = function (params) {
  var _this,
      _initialize,

      _destroyModel;


  _this = Events();

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    params = Util.extend({}, _DEFAULTS, params);

    // Element where this view is rendered
    _this.el = (params && params.hasOwnProperty('el')) ?
        params.el : document.createElement('div');

    _this.model = params.model;

    if (!_this.model) {
      _this.model = Model({});
      _destroyModel = true;
    }

    _this.model.on('change', 'render', _this);
  };


  /**
   * API Method
   *
   * Renders the view
   */
  _this.render = function () {
    // Impelementations should update the view based on the current
    // model properties.
  };

  /**
   * API Method
   *
   * Cleans up resources allocated by the view. Should be called before
   * discarding a view.
   */
  _this.destroy = Util.compose(function () {
    _this.model.off('change', 'render', _this);

    if (_destroyModel) {
      _this.model.destroy();
    }

    _destroyModel = null;

    _this.model = null;
    _this.el = null;
  }, _this.destroy);


  _initialize(params);
  params = null;
  return _this;
};

module.exports = View;
