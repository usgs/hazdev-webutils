'use strict';

module.exports = function (grunt) {

  var gruntConfig = require('./gruntconfig');

  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);

  // creates distributable version of library
  grunt.registerTask('build', function () {
    grunt.task.run([
      'dev',
      'cssmin',
      'uglify'
    ]);
  });

  // default task useful during development
  grunt.registerTask('default', [
    'dev',
    'connect:dev',
    'test',
    'watch'
  ]);

  // builds development version of library
  grunt.registerTask('dev', [
    'browserify',
    'compass',
    'copy'
  ]);

  // starts distribution server and preview
  grunt.registerTask('dist', [
    'build',
    'connect:dist'
  ]);

  // runs tests against development version of library
  grunt.registerTask('test', function () {
    grunt.task.requires('dev');

    grunt.task.run([
      'connect:test',
      'mocha_phantomjs'
    ]);
  });
};