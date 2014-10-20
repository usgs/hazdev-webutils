/* global define */

/**
 * A Lightweight event framework, inspired by backbone.
 *
 * Lazily builds indexes to avoid overhead until needed.
 */
define([
], function (
) {
	'use strict';

	var Events = function () {
		// map of listeners by event type
		this._listeners = {};
	};

	var instance = null;

	/**
	 * Add an event listener
	 *
	 * @param event {String}
	 *      event name (singular).  E.g. 'reset'
	 * @param callback {Function}
	 *      function to call when event is triggered.
	 */
	Events.prototype.on = function (event, callback, context) {
		if (!callback || !callback.apply) {
			throw new Error('Callback parameter is not callable.');
		}

		if (!this._listeners.hasOwnProperty(event)) {
			// first listener for event type
			this._listeners[event] = [];
		}

		// add listener
		this._listeners[event][this._listeners[event].length] = {
			callback: callback,
			context: context
		};
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
	Events.prototype.off = function (evt, callback, context) {
		if (typeof evt === 'undefined') {
			// removing all listeners on this object
			this._listeners = null;
			this._listeners = {};
		} else if (typeof callback === 'undefined') {
			// removing all listeners for this event
			delete this._listeners[evt];
		} else {
			var listener = null;

			// search for callback to remove
			for (var i=this._listeners[evt].length-1; i>=0; i--) {
				listener = this._listeners[evt][i];
				if (listener.callback === callback &&
						(!context || listener.context === context)) {
					// found callback, remove
					this._listeners[evt].splice(i,1);
					if (context) {
						// found callback with context, stop searching
						break;
					}
				}
			}

			// cleanup if last callback of this type
			if (this._listeners[evt].length === 0) {
				delete this._listeners[evt];
			}
			listener = null;
		}
	};


	/**
	 * Trigger an event
	 *
	 * @param event {String}
	 *      event name.
	 * @param args {…}
	 *      variable length arguments after event are passed to listeners.
	 */
	Events.prototype.trigger = function (event) {
		var listener,
		    listeners,
		    args,
		    i,
		    len;

		if (this._listeners.hasOwnProperty(event)) {

			args = Array.prototype.slice.call(arguments, 1);
			listeners = this._listeners[event].slice(0);

			for (i = 0, len = listeners.length; i < len; i++) {
				listener = listeners[i];

				// NOTE: if listener throws exception, this will stop...
				listener.callback.apply(listener.context, args);
			}
		}
	};

	// make Events a global event source
	instance = new Events();
	Events.on = function _events_on () {
		return Events.prototype.on.apply(instance, arguments);
	};
	Events.off = function _events_off () {
		return Events.prototype.off.apply(instance, arguments);
	};
	Events.trigger = function _events_trigger () {
		return Events.prototype.trigger.apply(instance, arguments);
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
	} else if (window.attachEvent) {
		window.attachEvent('onhashchange', _onHashChange);
	}

	// return constructor from closure
	return Events;
});
