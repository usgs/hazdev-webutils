'use strict';

var config = require('./config');

var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src
      ]
    }
  }
};

// bundles
[
  'index',
  'DownloadViewUITest',
  'ModalViewUITest' ,
  'SelectViewUITest'
].forEach(function (bundle) {
  var targetFile = config.build + '/' + config.test + '/' + bundle + '.js';
  var sourceFile = config.test + '/' + bundle + '.js';

  browserify[bundle] = {files: {}};
  browserify[bundle].files[targetFile] = [sourceFile];
});


module.exports = browserify;
