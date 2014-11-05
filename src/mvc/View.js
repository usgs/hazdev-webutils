/* global define */

/**
 * A lightweight view class.
 *
 * Primarily manages an element where a view can render its data.
 */
define([
  'util/Events'
], function (
  Events
) {
  'use strict';

  /** create a new view. */
  var View = function (options) {
    // make view source of events
    Events.call(this);

    // element where this view is rendered
    this._el = (options && options.hasOwnProperty('el')) ?
        options.el : document.createElement('div');

    this._initialize();
  };
  View.prototype = Object.create(Events.prototype);

  View.prototype._initialize = function () {
  };

  View.prototype.render = function () {
  };

  /** Undo any initialization. */
  View.prototype.destroy = function () {
    this._el = null;
  };

  // return constructor from closure
  return View;
});
