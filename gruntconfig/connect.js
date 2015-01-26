'use strict';

var config = require('./config');

var connect = {
  options: {
    hostname: '*'
  },
  dev: {
    options: {
      base: [
        config.build + '/' + config.test,
        config.build + '/' + config.src,
        config.test,
        config.src,
        'node_modules'
      ],
      port: 8000
    }
  }
};

module.exports = connect;