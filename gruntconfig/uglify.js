'use strict';

var config = require('./config');

var uglify = {
  dist: {
    files: {}
  }
};

// main bundle
uglify.dist.files[config.dist + '/hazdev-webutils.js'] =
    config.build + '/' + config.src + '/hazdev-webutils.js';

// examples
[
  'DownloadViewUITest.js',
  'ModalViewUITest.js',
  'SelectViewUITest.js'
].forEach(function (path) {
  uglify.dist.files[config.dist + '/' + path] =
    config.build + '/' + config.example + '/' + path;
});

module.exports = uglify;
