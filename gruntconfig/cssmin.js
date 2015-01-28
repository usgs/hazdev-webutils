'use strict';

var config = require('./config');

var cssmin = {
  dist: {
    files: {}
  }
};

cssmin.dist.files[config.dist + '/index.css'] = [
  config.build + '/' + config.src + '/bundle.css'
];

module.exports = cssmin;