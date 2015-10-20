'use strict';

var config = require('./config');

var corsMiddleware = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers',
      'accept,origin,authorization,content-type');
  return next();
};

var addMiddleware = function (connect, options, middlewares) {
  middlewares.unshift(
    require('grunt-connect-proxy/lib/utils').proxyRequest,
    corsMiddleware,
    require('gateway')(options.base[0], {
      '.php': 'php-cgi',
      'env': {
        'PHPRC': 'node_modules/hazdev-template/dist/conf/php.ini'
      }
    })
  );
  return middlewares;
};

var connect = {

  options: {
    hostname: '*'
  },

  proxies: [
    {
      context: '/theme/',
      host: 'localhost',
      port: 8004,
      rewrite: {
        '^/theme': ''
      }
    }
  ],

  test: {
    options: {
      base: [
        config.build + '/' + config.src,
        config.build + '/' + config.test,
        'node_modules'
      ],
      open: 'http://localhost:8001/test.html',
      port: 8001
    }
  },

  dist: {
    options: {
      base: [
        config.example,
        config.dist
      ],
      keepalive: true,
      open: 'http://localhost:8002/example.html',
      port: 8002
    }
  },

  example: {
    options: {
      base: [
        config.example,
        config.build + '/' + config.src
      ],
      port: 8003,
      livereload: true,
      open: 'http://localhost:8003/example.html',
      middleware: addMiddleware
    }
  },

  template: {
    options: {
      base: ['node_modules/hazdev-template/dist/htdocs'],
      port: 8004
    }
  }

};

module.exports = connect;