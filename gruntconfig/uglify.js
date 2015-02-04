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

module.exports = uglify;
