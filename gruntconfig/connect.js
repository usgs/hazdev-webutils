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
      open: 'http://localhost:8000/index.html',
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
      keepalive: true,
      open: 'http://localhost:8002/',
      port: 8002
    }
  }
};

module.exports = connect;