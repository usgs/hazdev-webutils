'use strict';

var config = require('./config');

var copy = {
  test: {
    expand: true,
    cwd: config.test,
    src: ['**/*.html', '**/*.xml', 'jsonp.js'],
    dest: config.build + '/' + config.test
  },

  mocha: {
    expand: true,
    cwd: 'node_modules',
    src: ['mocha/mocha.js', 'mocha/mocha.css'],
    dest: config.build + '/' + config.test
  }
};

module.exports = copy;