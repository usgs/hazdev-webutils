'use strict';


var Collection = require('mvc/Collection'),
    CollectionView = require('mvc/CollectionView'),
    ModalView = require('mvc/ModalView'),
    Model = require('mvc/Model'),
    View = require('mvc/View'),

    FileIO = require('util/FileIO'),
    Message = require('util/Message'),
    Util = require('util/Util');


var _FILE_SIZE_SUFFIXES = ['B', 'KB', 'MB', 'GB'];

var _DEFAULT_INTRO_TEXT = [
  'You may &ldquo;Browse&rdquo; for files, or drag-and-drop files using the ',
  'area below. Once you have added files, you may preview them by clicking ',
  'the blue file name. Preview behavior is browser-dependent. If you select ',
  'a file with the same name more than once, then only the most recent ',
  'selection will be used. Directories are not supported.'
].join('');

// Default values to be used by constructor
var _DEFAULTS = {
  browseText: 'Browse',

  cancelCallback: function () {},
  cancelText: 'Cancel',
  cancelTooltip: 'Cancel',

  dropzoneText: 'Drag &amp; drop file(s) here&hellip;',

  intro: {
    text: _DEFAULT_INTRO_TEXT,
    classes: 'alert info'
  },

  title: 'File Input',

  uploadCallback: function () {},
  uploadText: 'Upload',
  uploadTooltip: 'Upload file(s)'
};


/**
 * Private inner class. This is a view for rendering individual files in
 * a list-type format. It is provided to the CollectionView as the factory.
 *
 */
var FileView = function (params) {
  var _this,
      _initialize,

      _collection,
      _delete,
      _fileName,
      _fileSize,

      _bindEventListeners,
      _createViewSkeleton,
      _formatFileSize,
      _onDeleteClick;


  _this = View(params);

  _initialize = function (/*params*/) {
    _collection = params.collection;
    _createViewSkeleton();
    _bindEventListeners();

    _this.render();
  };


  _bindEventListeners = function () {
    _delete.addEventListener('click', _onDeleteClick);
  };

  _createViewSkeleton = function () {
    _this.el.classList.add('file-view');

    _this.el.innerHTML = [
      '<span class="file-view-label">',
        '<a href="javascript:void(null);" target="_blank" ',
            'class="file-view-name"></a>',
        '<span class="file-view-size"></span>',
      '</span>',
      '<a href="javascript:void(null);" class="file-view-delete" ',
          'title="Delete File">&times;</a>'
    ].join('');

    _fileName = _this.el.querySelector('.file-view-name');
    _fileSize = _this.el.querySelector('.file-view-size');
    _delete = _this.el.querySelector('.file-view-delete');
  };

  _formatFileSize = function (size) {
    var numDecimals,
        suffixIndex;

    numDecimals = 0;
    suffixIndex = 0;

    while (size > 1024 && suffixIndex < _FILE_SIZE_SUFFIXES.length) {
      size /= 1024;
      suffixIndex++;
    }

    if (size - parseInt(size, 10) !== 0) {
      numDecimals = 1;
    }

    return size.toFixed(numDecimals) + _FILE_SIZE_SUFFIXES[suffixIndex];
  };

  _onDeleteClick = function () {
    if (_collection) {
      _collection.remove(_this.model);
    }

    _this.destroy();
  };


  _this.destroy = Util.compose(function () {
    _createViewSkeleton = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    var file;

    file = _this.model.get('file');

    _fileName.innerHTML = file.name;
    _fileName.setAttribute('title', file.name);
    _fileName.setAttribute('href', _this.model.get('url'));
    _fileName.setAttribute('download', file.name);

    _fileSize.innerHTML = '(' + _formatFileSize(file.size) + ')';
  };

  _initialize(params);
  params = null;
  return _this;
};


/**
 * Class: FileInputView
 *
 * @param params {Object}
 *      Configuration options. See _DEFAULTS for more details.
 */
var FileInputView = function (params) {
  var _this,
      _initialize,

      _browseButton,
      _cancelCallback,
      _collection,
      _collectionView,
      _dropzone,
      _fileInput,
      _filesContainer,
      _io,
      _messageContainer,
      _modal,
      _uploadCallback,

      _bindEventListeners,
      _createViewSkeleton,
      _handleFile,
      _onBrowseClick,
      _onCancelClick,
      _onDragLeave,
      _onDragOver,
      _onDrop,
      _onReadError,
      _onReadSuccess,
      _onUploadClick,
      _showError;


  // Inherit from parent class
  _this = View(params);

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    // Enumerate each property expected to be given in params method
    params = Util.extend({}, _DEFAULTS, params);

    _collection = Collection([]);
    _io = FileIO();

    _uploadCallback = params.uploadCallback;
    _cancelCallback = params.cancelCallback;

    _createViewSkeleton(params);
    _bindEventListeners();

    _modal = ModalView(_this.el, {
      title: params.title,
      buttons: [
        {
          text: params.uploadText,
          title: params.uploadTooltip,
          callback: _onUploadClick
        },
        {
          text: params.cancelText,
          title: params.cancelTooltip,
          callback: _onCancelClick
        }
      ],
      classes: ['file-input']
    });
  };


  _bindEventListeners = function () {
    _dropzone.addEventListener('dragleave', _onDragLeave);
    _dropzone.addEventListener('dragover', _onDragOver);
    _dropzone.addEventListener('drop', _onDrop);

    _browseButton.addEventListener('click', _onBrowseClick);
    _fileInput.addEventListener('change', _onDrop);
  };

  _createViewSkeleton = function (params) {
    var intro;

    _this.el.innerHTML = [
      '<input type="file" class="file-input-input" multiple/>',
      '<div class="file-input-dropzone">',
        '<span class="file-input-dropzone-text">',
          params.dropzoneText,
        '</span>',
        '<button class="file-input-browse-button">',
          params.browseText,
        '</button>',
      '</div>',
      '<div class="file-input-messages"></div>',
      '<ul class="file-input-files no-style"></ul>'
    ].join('');

    if (params.intro) {
      if (params.intro instanceof Node) {
        intro = params.intro;
      } else if (typeof params.intro === 'string') {
        intro = document.createElement('div');
        intro.innerHTML = params.intro;
      } else {
        intro = document.createElement('div');
        intro.innerHTML = params.intro.text || '';
        if (params.intro.classes) {
          intro.className = params.intro.classes;
        }
      }

      intro.classList.add('file-input-intro');

      _this.el.insertBefore(intro, _this.el.firstChild);
    }


    _dropzone = _this.el.querySelector('.file-input-dropzone');
    _browseButton = _this.el.querySelector('.file-input-browse-button');
    _fileInput = _this.el.querySelector('.file-input-input');
    _filesContainer = _this.el.querySelector('.file-input-files');
    _messageContainer = _this.el.querySelector('.file-input-messages');

    _collectionView = CollectionView({
      collection: _collection,
      el: _filesContainer,
      factory: FileView
    });
  };

  _handleFile = function (file) {
    try {
      // Get the data URL
      _io.read({
        file: file,
        success: _onReadSuccess,
        error: _onReadError
      });
    } catch (e) {
      _showError(e.message);
    }
  };

  _onBrowseClick = function () {
    var evt;

    if (_fileInput.click) {
      _fileInput.click();
    } else {
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', true, true);
      _fileInput.dispatchEvent(evt);
    }
  };

  _onCancelClick = function () {
    _cancelCallback();
    _this.hide();
  };

  _onDragLeave = function (e) {
    e.preventDefault();
    _dropzone.classList.remove('drag-over');
  };

  _onDragOver = function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    _dropzone.classList.add('drag-over');
  };

  _onDrop = function (e) {
    var files,
        i;

    _onDragLeave(e);

    files = e.target.files || e.dataTransfer.files;
    for (i = 0; i < files.length; i++) {
      _handleFile(files[i]);
    }

    _fileInput.value = '';
  };

  _onReadError = function (params) {
    var error;

    error = [
      'An error occurred reading &ldquo;', params.file.name, '&rdquo;.',
      '<br/>',
      '<small>', params.error.message, '</small>'
    ].join('');

    _showError(error);
  };

  _onReadSuccess = function (params) {
    var oldFile;

    params.id = params.file.name;

    try {
      oldFile = _collection.get(params.id);

      if (oldFile) {
        oldFile.set(params);
        _showError(
          'A file name &ldquo;' + params.file.name + '&rdquo; was already ' +
          'selected. That file has been replaced by this file. To load both ' +
          'files, please rename one of the files.', 'info'
        );
      } else {
        _collection.add(Model(params));
      }
    } catch (e) {
      _showError(e.message);
    }
  };

  _onUploadClick = function () {
    _uploadCallback(_collection.data().slice(0));
    _this.hide();
  };

  _showError = function (error, type) {
    Message({
      container: _messageContainer,
      content: error,

      autoclose: false,
      classes: [type || 'error']
    });
  };


  _this.destroy = Util.compose(function () {
    // TODO
  }, _this.destroy);

  _this.hide = function () {
    _modal.hide();
  };

  _this.show = function (clean) {
    if (clean) {
      _collection.reset([]);
      _messageContainer.innerHTML = '';
    }

    _modal.show();
  };


  // Always call the constructor
  _initialize(params);
  params = null;
  return _this;
};


module.exports = FileInputView;
