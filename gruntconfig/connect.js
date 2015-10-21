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
      port: config.templatePort,
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
      open: 'http://localhost:' + config.testPort + '/test.html',
      port: config.testPort
    }
  },

  dist: {
    options: {
      base: [
        config.example,
        config.dist
      ],
      keepalive: true,
      open: 'http://localhost:' + config.distPort + '/example.php',
      port: config.distPort
    }
  },

  example: {
    options: {
      base: [
        config.example,
        config.build + '/' + config.src
      ],
      livereload: config.livereloadPort,
      open: 'http://localhost:' + config.examplePort + '/example.php',
      port: config.examplePort,
      middleware: addMiddleware
    }
  },

  template: {
    options: {
      base: ['node_modules/hazdev-template/dist/htdocs'],
      port: config.templatePort
    }
  }

};

module.exports = connect;