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

// example bundles
[
  'DownloadViewUITest',
  'ModalViewUITest' ,
  'SelectViewUITest'
].forEach(function (bundle) {
  browserify[bundle] = {
    src: config.example + '/' + bundle + '.js',
    dest: config.build + '/' + config.example + '/' + bundle + '.js'
  };
});

// source bundles
[
  'bundle',
].forEach(function (bundle) {
  browserify[bundle] = {
    src: config.src + '/' + bundle + '.js',
    dest: config.build + '/' + config.src + '/' + bundle + '.js'
  };
});

// test bundles
[
  'index',
].forEach(function (bundle) {
  browserify[bundle] = {
    src: config.test + '/' + bundle + '.js',
    dest: config.build + '/' + config.test + '/' + bundle + '.js'
  };
});


module.exports = browserify;
