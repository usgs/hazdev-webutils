'use strict';
/**
 * This class creates a simple toggle view. The toggle view has a toggle
 * control and toggle-able content. Clicking the toggle control will show/hide
 * the toggle-able content.
 *
 */

var Util = require('../util/Util'),
    View = require('./View');


var _CSS_EXPANDED_CLASS = 'toggle-expanded';

var _DEFAULTS = {
  expanded: false,

  header: null,

  control: 'Click to Toggle',
  controlClasses: [],

  content: 'Default Toggle Content',
  contentClasses: []
};

var ToggleView = function (params) {
  var _this,
      _initialize,

      _content,
      _control,
      _contentClasses,
      _controlClasses,
      _contentElement,
      _controlElement,
      _createViewSkeleton,
      _header,
      _headerElement;


  params = Util.extend({}, _DEFAULTS, params);
  _this = Object.create(View(params));


  _initialize = function () {
    _controlClasses = params.controlClasses;
    _contentClasses = params.contentClasses;

    _createViewSkeleton();

    _this.el.classList.add('toggle');

    if (params.expanded) {
      _this.el.classList.add(_CSS_EXPANDED_CLASS);
    }

    _this.setHeader(params.header, true);
    _this.setControl(params.control, true);
    _this.setContent(params.content, true);

    _this.render();

    params = null;
  };


  _createViewSkeleton = function () {
    var i = 0,
        len = 0;

    _headerElement = _this.el.appendChild(document.createElement('header'));
    _headerElement.classList.add('toggle-header');

    _controlElement = _headerElement.appendChild(
        document.createElement('button'));
    _controlElement.classList.add('toggle-control');

    for (i = 0, len = _controlClasses.length; i < len; i++) {
      _controlElement.classList.add(_controlClasses[i]);
    }

    _contentElement = _this.el.appendChild(document.createElement('div'));
    _contentElement.classList.add('toggle-content');

    for (i = 0, len = _contentClasses.length; i < len; i++) {
      _contentElement.classList.add(_contentClasses[i]);
    }

    _this._controlElement.addEventListener('click', function () {
      _this.el.classList.toggle(_CSS_EXPANDED_CLASS);
    });
  };


  _this.render = function () {
    Util.empty(this._headerElement);

    _controlElement.innerHTML = _control;
    _headerElement.appendChild(_controlElement);

    if (_header instanceof Node) {
      _headerElement.appendChild(_header);
    }

    if (_content instanceof Node) {
      Util.empty(_contentElement);
      _contentElement.appendChild(_content);
    } else {
      _contentElement.innerHTML = _content;
    }

    return _this;
  };

  /**
   * @param content {String|DOMElement}
   *      Content to show/hide in the view
   * @param deferRender {Boolean} Optional.
   *      Do not render after setting content. Default false.
   */
  _this.setContent = function (content, deferRender) {
    _content = content;

    if (!deferRender) {
      _this.render();
    }
  };

  /**
   * @param control {String}
   *      Text to use on the control element
   * @param deferRender {Boolean} Optional.
   *      Do not render after setting content. Default false.
   */
  _this.setControl = function (control, deferRender) {
    _control = control;

    if (!deferRender) {
      _this.render();
    }
  };

  _this.setHeader = function (header, deferRender) {
    _header = header;

    if (!deferRender) {
      _this.render();
    }
  };


  _initialize();
  return _this;
};

module.exports = ToggleView;