'use strict';

var config = require('./config');

var uglify = {
  dist: {
    src: config.build + '/' + config.src + '/hazdev-webutils.js',
    dest: config.dist + '/hazdev-webutils.js'
  }
};

module.exports = uglify;
