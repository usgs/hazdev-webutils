'use strict';

module.exports = (function () {

  var config = {
    browserify: require('./browserify'),
    connect: require('./connect'),
    jshint: require('./jshint'),
    mocha_phantomjs: require('./mocha_phantomjs'),
    watch: require('./watch')
  };

  return config;
})();