'use strict';

var config = require('./config');


var EXPORTS = [
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


var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src
      ]
    }
  },

  // source bundle
  source : {
    src: [],
    dest: config.build + '/' + config.src + '/hazdev-webutils.js',
    options: {
      alias: EXPORTS.map(function (path) {
        return './' + config.src + '/' + path + '.js:' + path;
      })
    }
  },

  // test bundle
  test: {
    src: config.test + '/index.js',
    dest: config.build + '/' + config.test + '/index.js'
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
    dest: config.build + '/' + config.example + '/' + bundle + '.js',
    options: {
      external: EXPORTS
    }
  };
});


module.exports = browserify;
