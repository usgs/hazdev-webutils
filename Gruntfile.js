'use strict';

module.exports = function (grunt) {

  var gruntConfig = require('./gruntconfig');

  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
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