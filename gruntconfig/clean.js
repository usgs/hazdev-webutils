'use strict';

var config = require('./config');

var clean = {
  build: ['.sass-cache', config.build],
  dist: [config.dist]
};

module.exports = clean;