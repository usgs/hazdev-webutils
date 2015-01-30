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


var EXTERNALS = [
  'mvc/Collection',
  'mvc/CollectionSelectBox',
  'mvc/CollectionTable',
  'mvc/DataTable',
  'mvc/DownloadView',
  'mvc/ModalView',
  'mvc/Model',
  'mvc/SelectView',
  'mvc/SortView',
  'mvc/View',
  'util/Events',
  'util/Util',
  'util/Xhr'
];


// example bundles
[
  'DownloadViewUITest',
  'ModalViewUITest' ,
  'SelectViewUITest'
].forEach(function (bundle) {
  browserify[bundle] = {
    src: config.example + '/' + bundle + '.js',
    dest: config.build + '/' + config.example + '/' + bundle + '.js',
    options: {
      external: EXTERNALS
    }
  };
});

// source bundles
browserify['bundle'] = {
  src: [],
  dest: config.build + '/' + config.src + '/hazdev-webutils.js',
  options: {
    alias: EXTERNALS.map(function (path) {
      return './' + config.src + '/' + path + ':' + path;
    })
  }
};


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
