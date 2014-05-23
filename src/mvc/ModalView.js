/* global define */

/**
 * Generic class for modal dialog views. Modal dialogs present a blocking
 * interface to the user and require user-interaction in order to be closed
 * (i.e. clicking a button etc...).
 *
 * It is important to note that while the interface appears blocked while a
 * modal dialog is open, Javascript continues to execute in the background.
 *
 * Only one modal dialog can be visible at any given time.
 *
 * If a second modal dialog is opened while the first modal dialog is still
 * visible, the first modal dialog is hidden and the second is shown. Upon
 * closing the second modal dialog, the first modal dialog is re-shown (unless
 * the "clear" method is passed to the hide method). This process continues in a
 * last-in, first-out (stack) ordering until all modal dialogs are closed.
 *
 */
define([
	'mvc/View',
	'util/Util'
], function (
	View,
	Util
) {
	'use strict';

	var __INITIALIZED__ = false,
	    DIALOG_STACK = null,
	    FOCUS_STACK = null,
	    MASK = null,
	    MASK_VISIBLE = null,
	    DEFAULTS = {
				closable: true, // Should modal box include little "X' in corner
				title: document.title + ' Says...'
	    };

	var _initialize = function () {
		// Create the dialog stack
		DIALOG_STACK = [];

		// Create the focus stack
		FOCUS_STACK = [];

		// Create the modal mask
		MASK = document.createElement('div');
		Util.addClass(MASK, 'modal');
		MASK_VISIBLE = false;
		__INITIALIZED__ = true;
	};

	var _buttonCallback = function (evt) {
		if (this.info && this.info.callback &&
				typeof this.info.callback === 'function') {
			this.info.callback(evt, this.modal||{});
		}
	};

	var ModalView = function (message, options) {
		// Call parent constructor
		View.call(this, options); // Parent constructor will set this._el

		this.message = message;
		this.options = Util.extend({}, DEFAULTS, options||null);
		this._el.modal = this;
		this._createViewSkeleton(this._el, this.options);
		this._onKeyDown = this._onKeyDown.bind(this);
		this.render();

		if (!__INITIALIZED__) {
			_initialize();
		}
	};

	ModalView.prototype = Object.create(View.prototype);

	ModalView.prototype._createViewSkeleton = function () {
		var header, closeButton, i, len;

		Util.empty(this._el);
		Util.addClass(this._el, 'modal-dialog');

		// Add custom classes to the view
		if (this.options.classes && this.options.classes.length > 0) {
			for (i = 0, len = this.options.classes.length; i < len; i++) {
				Util.addClass(this._el, this.options.classes[i]);
			}
		}

		if (this.options.title) {
			header = this._el.appendChild(document.createElement('header'));
			Util.addClass(header, 'modal-header');

			this._title = header.appendChild(document.createElement('h3'));
			this._title.setAttribute('tabIndex', '-1');
			Util.addClass(this._title, 'modal-title');


			if (this.options.closable) {
				closeButton = header.appendChild(document.createElement('span'));
				Util.addClass(closeButton, 'modal-close-link');
				closeButton.setAttribute('title', 'Cancel');
				closeButton.innerHTML = 'x';
				Util.addEvent(closeButton, 'click', (function (modal) {
					return function () {
						modal.hide();
					};
				})(this));
			}
		}

		this._content = this._el.appendChild(document.createElement('section'));
		this._content.setAttribute('tabIndex', '-1');
		Util.addClass(this._content, 'modal-content');

		if (this.options.buttons && this.options.length) {
			this._footer = this._el.appendChild(document.createElement('footer'));
			Util.addClass(this._footer, 'modal-footer');
		}

	};

	ModalView.prototype._createButton = function (info) {
		var i, len, button = document.createElement('button'), buttonInfo;

		buttonInfo = Util.extend({}, {
			classes: [],
			text: 'Click Me',
			title: '',
			callback: function () {}
		}, info);

		for (i = 0, len = buttonInfo.classes.length; i < len; i++) {
			Util.addClass(button, buttonInfo.classes[i]);
		}

		button.innerHTML = buttonInfo.text;

		if (buttonInfo.title !== '') {
			button.setAttribute('title', buttonInfo.title);
		}

		button.modal = this;
		button.info = buttonInfo;

		if (buttonInfo.callback) {
			Util.addEvent(button, 'click', _buttonCallback);
		}

		return button;
	};

	/**
	 * This method is bound to the ModalView instance using the
	 * Function.prototype.bind method, thus the reference to "this" is correct
	 * even though this is a keydown event handler.
	 *
	 * @param event {KeyEvent}
	 *      The event that triggered this call.
	 */
	ModalView.prototype._onKeyDown = function (event) {
		if (event.keyCode === 27) {
			this.hide();
		}
	};


	ModalView.prototype.setMessage = function (message) {
		this.message = message;

		this.trigger('message', this);
		return this;
	};

	ModalView.prototype.setOptions = function (options, extend) {
		if (extend) {
			this.options = Util.extend({}, this.options, options);
		} else {
			this.options = options;
		}

		this.trigger('options', this);
		return this;
	};

	ModalView.prototype.render = function (message) {
		var m = message || this.message,
		    button = null,
		    buttons = this.options.buttons || [],
		    i, len = buttons.length;

		// Set the modal dialog content
		Util.empty(this._content);
		if (typeof m === 'string') {
			this._content.innerHTML = m;
		} else if (typeof m === 'function') {
			return this.render(m(this));
		} else if (m instanceof Node) {
			this._content.appendChild(m);
		}

		// Set the modal dialog title
		if (this.options.title) {
			this._title.innerHTML = this.options.title;
		}
		// Clear any old footer content
		if (this.options.buttons && this.options.buttons.length) {
			while (this._footer.childNodes.length > 0) {
				button = this._footer.firstChild;
				Util.removeEvent(button, 'click', _buttonCallback);
				this._footer.removeChild(button);
			}
		}

		// Set new footer content
		for (i = 0; i < len; i++) {
			this._footer.appendChild(this._createButton(buttons[i]));
		}

		this.trigger('render', this);
		return this;
	};

	ModalView.prototype.show = function () {
		var oldChild = null;

		// Mask already has a dialog in it, add to dialog stack and continue
		while (MASK.firstChild) {
			oldChild = MASK.firstChild;
			if (oldChild.modal instanceof ModalView) {
				DIALOG_STACK.push(oldChild.modal);
			}
			MASK.removeChild(oldChild);
		}

		// Add this dialog to the mask
		MASK.appendChild(this._el);

		// Show the mask if not yet visible
		if (!MASK_VISIBLE) {
			document.body.appendChild(MASK);
			MASK_VISIBLE = true;
			window.addEventListener('keydown', this._onKeyDown);
		}

		// For accessibility, focus the top of this new dialog
		FOCUS_STACK.push(document.activeElement || false);

		if (this.options.title) {
			this._title.focus();
		} else {
			this._content.focus();
		}

		this.trigger('show', this);
		return this;
	};

	ModalView.prototype.hide = function (clearAll) {
		var nextFocus;

		if (clearAll === true) {
			// Clear stack of previous dialogs to return user to normal application.
			DIALOG_STACK.splice(0, DIALOG_STACK.length);
		}

		// Hide this dialog
		Util.empty(MASK);

		// Check if any other dialogs exist in stack, pop first dialog and show it
		if (DIALOG_STACK.length > 0) {
			DIALOG_STACK.pop().show();
		} else if (MASK_VISIBLE) {
			MASK.parentNode.removeChild(MASK);
			MASK_VISIBLE = false;
			window.removeEventListener('keydown', this._onKeyDown);
		}

		if (FOCUS_STACK.length > 0) {
			nextFocus = FOCUS_STACK.pop();
			if (nextFocus instanceof Node) {
				nextFocus.focus();
			}
		}

		this.trigger('hide', this);
		return this;
	};

	return ModalView;
});
