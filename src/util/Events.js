'use strict';

var __INSTANCE__ = null;

var Events = function () {
  var _this,
      _initialize,

      _listeners;


  _this = Object.create({});

  _initialize = function () {
    // map of listeners by event type
    _listeners = {};
  };


  /**
   * Remove an event listener
   *
   * Omitting callback clears all listeners for given event.
   * Omitting event clears all listeners for all events.
   *
   * @param event {String}
   *      event name to unbind.
   * @param callback {Function}
   *      callback to unbind.
   * @param context {Object}
   *      context for "this" when callback is called
   */
  _this.off = function (evt, callback, context) {
    var i;

    if (typeof evt === 'undefined') {
      // removing all listeners on this object
      _listeners = null;
      _listeners = {};
    } else if (typeof callback === 'undefined') {
      // removing all listeners for this event
      delete _listeners[evt];
    } else {
      var listener = null;

      // search for callback to remove
      for (i = _listeners[evt].length - 1; i >= 0; i--) {
        listener = _listeners[evt][i];

        if (listener.callback === callback &&
            (!context || listener.context === context)) {

          // found callback, remove
          _listeners[evt].splice(i,1);

          if (context) {
            // found callback with context, stop searching
            break;
          }
        }
      }

      // cleanup if last callback of this type
      if (_listeners[evt].length === 0) {
        delete _listeners[evt];
      }

      listener = null;
    }
  };

  /**
   * Add an event listener
   *
   * @param event {String}
   *      event name (singular).  E.g. 'reset'
   * @param callback {Function}
   *      function to call when event is triggered.
   * @param context {Object}
   *      context for "this" when callback is called
   */
  _this.on = function (event, callback, context) {
    if (!callback || !callback.apply) {
      throw new Error('Callback parameter is not callable.');
    }

    if (!_listeners.hasOwnProperty(event)) {
      // first listener for event type
      _listeners[event] = [];
    }

    // add listener
    _listeners[event].push({
      callback: callback,
      context: context
    });
  };

  /**
   * Trigger an event
   *
   * @param event {String}
   *      event name.
   * @param args {…}
   *      variable length arguments after event are passed to listeners.
   */
  _this.trigger = function (event) {
    var args,
        i,
        len,
        listener,
        listeners;

    if (_listeners.hasOwnProperty(event)) {

      args = Array.prototype.slice.call(arguments, 1);
      listeners = _listeners[event].slice(0);

      for (i = 0, len = listeners.length; i < len; i++) {
        listener = listeners[i];

        // NOTE: if listener throws exception, this will stop...
        listener.callback.apply(listener.context, args);
      }
    }
  };

  _initialize();
  return _this;
};

// make Events a global event source
__INSTANCE__ = Events();
Events.on = function _events_on () {
  return __INSTANCE__.on.apply(__INSTANCE__, arguments);
};
Events.off = function _events_off () {
  return __INSTANCE__.off.apply(__INSTANCE__, arguments);
};
Events.trigger = function _events_trigger () {
  return __INSTANCE__.trigger.apply(__INSTANCE__, arguments);
};

// intercept window.onhashchange events, or simulate if browser doesn't
// support, and send to global Events object
var _onHashChange = function (e) {
  Events.trigger('hashchange', e);
};

// courtesy of:
// http://stackoverflow.com/questions/9339865/get-the-hashchange-event-to-work-in-all-browsers-including-ie7
if (!('onhashchange' in window)) {
  var oldHref = document.location.hash;

  setInterval(function () {
    if (oldHref !== document.location.hash) {
      oldHref = document.location.hash;
      _onHashChange({
        'type': 'hashchange',
        'newURL': document.location.hash,
        'oldURL': oldHref
      });
    }
  }, 300);

} else if (window.addEventListener) {
  window.addEventListener('hashchange', _onHashChange, false);
}

module.exports = Events;