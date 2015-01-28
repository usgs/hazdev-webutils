'use strict';

var config = require('./config');

var uglify = {
  dist: {
    files: {}
  }
};

uglify.dist.files[config.dist + '/index.js'] = [
  config.build + '/' + config.src + '/bundle.js'
];

module.exports = uglify;