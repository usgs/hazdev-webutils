'use strict';

var config = require('./config');

var cssmin = {
  dist: {
    files: {}
  }
};

cssmin.dist.files[config.dist + '/hazdev-webutils.css'] = [
  config.build + '/' + config.src + '/hazdev-webutils.css'
];

module.exports = cssmin;
