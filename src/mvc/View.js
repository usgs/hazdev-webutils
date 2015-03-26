'use strict';
/**
 * A lightweight view class.
 *
 * Primarily manages an element where a view can render its data.
 */


var Events = require('../util/Events'),
    Util = require('../util/Util');


var _DEFAULTS = {
};


/** create a new view. */
var View = function (params) {
  var _this,
      _initialize;


  _this = Events();

  /**
   * @constructor
   *
   */
  _initialize = function () {
    params = Util.extend({}, _DEFAULTS, params);

    // Element where this view is rendered
    _this.el = (params && params.hasOwnProperty('el')) ?
        params.el : document.createElement('div');

    params = null;
  };

  /**
   * API Method
   *
   * Renders the view
   */
  _this.render = function () {
  };

  /**
   * API Method
   *
   * Cleans up resources allocated by the view. Should be called before
   * discarding a view.
   */
  _this.destroy = function () {
    _this.el = null;
  };


  _initialize();
  return _this;
};

module.exports = View;