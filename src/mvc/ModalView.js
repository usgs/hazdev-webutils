'use strict';
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

var Util = require('../util/Util'),
    View = require('./View');


var __INITIALIZED__ = false,
    _DIALOG_STACK = null,
    _FOCUS_STACK = null,
    _MASK = null,
    _MASK_VISIBLE = null,
    _DEFAULTS = {
      closable: true, // Should modal box include little "X' in corner
      title: document.title + ' Says...'
    };

var _static_initialize = function () {
  // Create the dialog stack
  _DIALOG_STACK = [];

  // Create the focus stack
  _FOCUS_STACK = [];

  // Create the modal mask
  _MASK = document.createElement('div');
  _MASK.classList.add('modal');

  _MASK_VISIBLE = false;
  __INITIALIZED__ = true;
};

var _buttonCallback = function (evt) {
  if (this.info && this.info.callback &&
      typeof this.info.callback === 'function') {
    this.info.callback(evt, this.modal||{});
  }
};

var ModalView = function (message, params) {
  var _this,
      _initialize,

      _buttons,
      _classes,
      _closable,
      _closeButton,
      _content,
      _footer,
      _message,
      _title,
      _titleEl,

      _createButton,
      _createViewSkeleton,
      _onKeyDown;


  params = Util.extend({}, _DEFAULTS, params);
  _this = View(params);

  _initialize = function () {

    _buttons = params.buttons;
    _classes = params.classes;
    _closable = params.closable;
    _message = message;
    _title = params.title;

    _this.el.modal = _this;

    _createViewSkeleton();
    _this.render();

    if (!__INITIALIZED__) {
      _static_initialize();
    }

    params = null;
  };


  _createButton = function (info) {
    var i,
        len,
        button = document.createElement('button'),
        buttonInfo;

    buttonInfo = Util.extend({}, {
      classes: [],
      text: 'Click Me',
      title: '',
      callback: function () {}
    }, info);

    for (i = 0, len = buttonInfo.classes.length; i < len; i++) {
      button.classList.add(buttonInfo.classes[i]);
    }

    button.innerHTML = buttonInfo.text;

    if (buttonInfo.title !== '') {
      button.setAttribute('title', buttonInfo.title);
    }

    button.modal = _this;
    button.info = buttonInfo;

    if (buttonInfo.callback) {
      button.addEventListener('click', _buttonCallback);
    }

    return button;
  };

  _createViewSkeleton = function () {
    var header, i, len;

    Util.empty(_this.el);
    _this.el.classList.add('modal-dialog');

    // Add custom classes to the view
    if (_classes && _classes.length > 0) {
      for (i = 0, len = _classes.length; i < len; i++) {
        _this.el.classList.add(_classes[i]);
      }
    }

    if (_title) {
      header = _this.el.appendChild(document.createElement('header'));
      header.classList.add('modal-header');

      _titleEl = header.appendChild(document.createElement('h3'));
      _titleEl.setAttribute('tabIndex', '-1');
      _titleEl.classList.add('modal-title');


      if (_closable) {
        _closeButton = header.appendChild(document.createElement('span'));
        _closeButton.classList.add('modal-close-link');
        _closeButton.setAttribute('title', 'Cancel');
        _closeButton.innerHTML = 'x';
        _closeButton.addEventListener('click', _this.hide);
      }
    }  else {
      _this.el.classList.add('no-header');
    }

    _content = _this.el.appendChild(document.createElement('section'));
    _content.setAttribute('tabIndex', '-1');
    _content.classList.add('modal-content');

    if (_buttons && _buttons.length) {
      _footer = _this.el.appendChild(document.createElement('footer'));
      _footer.classList.add('modal-footer');
    } else {
      _this.el.classList.add('no-footer');
    }
  };

  /**
   * This method is bound to the ModalView instance using the
   * Function.prototype.bind method, thus the reference to "this" is correct
   * even though this is a keydown event handler.
   *
   * @param event {KeyEvent}
   *      The event that triggered this call.
   */
  _onKeyDown = function (event) {
    if (event.keyCode === 27) {
      _this.hide();
    }
  };


  /**
   * Remove event listeners and free references.
   *
   * You should call hide first.
   */
  _this.destroy = function () {
    var button;

    if (_buttons && _buttons.length) {
      while (_footer.childNodes.length > 0) {
        button = _footer.firstChild;
        button.removeEventListener('click', _buttonCallback);
        _footer.removeChild(button);
      }
    }

    if (_closeButton) {
      _closeButton.removeEventListener('click', _this.hide);
      _closeButton = null;
    }

    delete _this.el.modal;

    _footer = null;
    _titleEl = null;
    _content = null;
    _this.el = null;
  };

  _this.hide = function (clearAll) {
    var nextFocus;

    if (clearAll === true) {
      // Remove any/all dialogs attached to _MASK
      Util.empty(_MASK);

      // Clear stack of previous dialogs to return user to normal application.
      _DIALOG_STACK.splice(0, _DIALOG_STACK.length);
    }

    if (this.el.parentNode === _MASK) {
      // This modal is currently visible
      this.el.parentNode.removeChild(this.el);

      // Check if any other dialogs exist in stack, if so, show it
      if (_DIALOG_STACK.length > 0) {
        _DIALOG_STACK.pop().show();
      } else if (_MASK_VISIBLE) {
        _MASK.parentNode.removeChild(_MASK);
        document.body.classList.remove('backgroundScrollDisable');
        _MASK_VISIBLE = false;
        window.removeEventListener('keydown', _onKeyDown);
      }

      if (_FOCUS_STACK.length > 0) {
        nextFocus = _FOCUS_STACK.pop();
        if (nextFocus instanceof Node) {
          nextFocus.focus();
        }
      }

      _this.trigger('hide', this);
    }

    return _this;
  };

  _this.render = function (message) {
    var m = message || _message,
        button = null,
        buttons = _buttons || [],
        i, len = buttons.length;

    // Set the modal dialog content
    Util.empty(_content);

    if (typeof m === 'string') {
      _content.innerHTML = m;
    } else if (typeof m === 'function') {
      return _this.render(m(_this));
    } else if (m instanceof Node) {
      _content.appendChild(m);
    }

    // Set the modal dialog title
    if (_title) {
      _titleEl.innerHTML = _title;
    }

    // Clear any old footer content
    if (_buttons && _buttons.length) {
      while (_footer.childNodes.length > 0) {
        button = _footer.firstChild;
        Util.removeEvent(button, 'click', _buttonCallback);
        _footer.removeChild(button);
      }
    }

    // Set new footer content
    for (i = 0; i < len; i++) {
      _footer.appendChild(_createButton(buttons[i]));
    }

    _this.trigger('render', _this);
    return _this;
  };

  _this.setMessage = function (message) {
    _message = message;

    _this.trigger('message', _this);
    return _this;
  };

  _this.setOptions = function (params, extend) {
    if (extend) {
      params = Util.extend({}, {
        buttons: _buttons,
        classes: _classes,
        closable: _closable,
        message: _message,
        title: _title
      }, params);
    }

    _buttons = params.buttons;
    _classes = params.classes;
    _closable = params.closable;
    _message = message;
    _title = params.title;

    _this.trigger('options', _this);
    return _this;
  };

  _this.show = function () {
    var oldChild = null;

    // Mask already has a dialog in it, add to dialog stack and continue
    while (_MASK.firstChild) {
      oldChild = _MASK.firstChild;
      if (oldChild.modal) {
        _DIALOG_STACK.push(oldChild.modal);
      }
      _MASK.removeChild(oldChild);
    }

    // Add this dialog to the mask
    _MASK.appendChild(_this.el);

    // Show the mask if not yet visible
    if (!_MASK_VISIBLE) {
      document.body.appendChild(_MASK);
      document.body.classList.add('backgroundScrollDisable');
      _MASK_VISIBLE = true;
      window.addEventListener('keydown', _onKeyDown);
    }

    // For accessibility, focus the top of this new dialog
    _FOCUS_STACK.push(document.activeElement || false);

    if (_title) {
      _titleEl.focus();
    } else {
      _content.focus();
    }

    _this.trigger('show', _this);
    return _this;
  };

  _initialize();
  return _this;
};

module.exports = ModalView;
