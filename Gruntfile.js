'use strict';

module.exports = function (grunt) {

  // Load grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var gruntConfig = require('./gruntconfig');
  grunt.initConfig(gruntConfig);

  grunt.registerTask('test', [
    'browserify',
    'connect:dev',
    'mocha_phantomjs'
  ]);

  grunt.registerTask('default', [
    'test',
    'watch'
  ]);
};
