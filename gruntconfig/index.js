'use strict';

var config = {
  browserify: require('./browserify'),
  connect: require('./connect'),
  jshint: require('./jshint'),
  mocha_phantomjs: require('./mocha_phantomjs'),
  watch: require('./watch'),

  tasks: [
    'grunt-browserify',
    'grunt-contrib-connect',
    'grunt-contrib-jshint',
    'grunt-mocha-phantomjs',
    'grunt-contrib-watch'
  ]
};

module.exports = config;