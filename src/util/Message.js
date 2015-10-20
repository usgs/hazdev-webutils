'use strict';

var Events = require('./Events');


var _ID_SEQUENCE = 0;

var __get_id = function () {
  return 'hazdev-webutils-message-' + (_ID_SEQUENCE++);
};


var Message = function (params) {
  var _this,
      _initialize,

      _autoclose,
      _classes,
      _closeable,
      _closeButton,
      _container,
      _content,
      _id,
      _insertBefore,
      _message,

      _createCloseButton,
      _onAlertClose,
      _show;


  _this = Events();

  _initialize = function (params) {
    _id = __get_id();

    _container = params.container || document.body;
    _content = params.content || 'Something just happened...';

    _autoclose = parseInt(params.autoclose, 10) || 0;
    _classes = ['alert', 'webutils-message'].concat(params.classes || []);
    _closeable = params.closeable || true;
    _insertBefore = params.insertBefore || false;

    _show();
  };


  _createCloseButton = function () {
    _closeButton = document.createElement('button');
    _closeButton.setAttribute('href', '#');
    _closeButton.setAttribute('tabindex', '0');
    _closeButton.setAttribute('aria-label', 'Close Alert');
    _closeButton.setAttribute('aria-controls', _id);
    _closeButton.classList.add('webutils-message-close');
    _closeButton.classList.add('material-icons');
    _closeButton.innerHTML = 'close';

    _closeButton.addEventListener('click', _onAlertClose);

    return _closeButton;
  };

  _onAlertClose = function (evt) {
    _this.hide(true);
    return evt.preventDefault();
  };

  _show = function () {
    _message = document.createElement('div');
    _message.setAttribute('id', _id);
    _message.setAttribute('role', 'alert');
    _message.setAttribute('aria-live', 'polite');

    _message.innerHTML = _content;


    _classes.forEach(function (className) {
      _message.classList.add(className);
    });

    if (_closeable) {
      _message.classList.add('webutils-message-closeable');
      _message.appendChild(_createCloseButton());
    }

    if (_autoclose) {
      window.setTimeout(_this.hide, _autoclose);
    }

    if (_container) {
      if (_insertBefore && _container.firstChild) {
        _container.insertBefore(_message, _container.firstChild);
      } else {
        _container.appendChild(_message);
      }
    }
  };


  _this.hide = function (userTriggered) {
      _message.classList.add('invisible');

    window.setTimeout(function () {
        if (_message.parentNode) {
          _message.parentNode.removeChild(_message);
        }

        _this.trigger('hide', {userTriggered: userTriggered});
        _this.destroy();
    }, 262);
  };

  _this.destroy = function () {
    if (_closeButton) {
      _closeButton.removeEventListener('click', _onAlertClose);
    }

    _autoclose = null;
    _classes = null;
    _closeable = null;
    _closeButton = null;
    _container = null;
    _content = null;
    _id = null;
    _insertBefore = null;
    _message = null;

    _createCloseButton = null;
    _onAlertClose = null;
    _show = null;

    _initialize = null;
    _this = null;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = Message;
