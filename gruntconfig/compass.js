'use strict';

var config = require('./config');

var compass = {
  src: {
    options: {
      sassDir: config.src,
      specify: config.src + '/hazdev-webutils.scss',
      cssDir: config.build + '/' + config.src,
      environment: 'development'
    }
  }
};

module.exports = compass;