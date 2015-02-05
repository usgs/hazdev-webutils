'use strict';

var config = require('./config');

var cssmin = {
  dist: {
    src: config.build + '/' + config.src + '/hazdev-webutils.css',
    dest: config.dist + '/hazdev-webutils.css'
  }
};

module.exports = cssmin;
