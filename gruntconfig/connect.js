'use strict';

var config = require('./config');

var connect = {
  options: {
    hostname: '*'
  },
  dev: {
    options: {
      base: [
        config.build + '/' + config.example,
        config.build + '/' + config.src
      ],
      port: 8000
    }
  },
  test: {
    options: {
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src
      ],
      port: 8001
    }
  },
  dist: {
    options: {
      base: [
        config.dist
      ],
      port: 8002
    }
  }
};

module.exports = connect;