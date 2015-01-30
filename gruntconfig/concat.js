'use strict';

var config = require('./config');

var concat = {
  build: {
    src: [config.build + '/' + config.src + '/**/*.css'],
    dest: config.build + '/' + config.src + '/hazdev-webutils.css'
  }
};

module.exports = concat;
