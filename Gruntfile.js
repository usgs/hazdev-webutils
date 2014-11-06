'use strict';

module.exports = function (grunt) {

  // Load grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // App configuration, used throughout
  var appConfig = {
    src: 'src',
    test: 'test',
    build: '.build'
  };

  grunt.initConfig({
    app: appConfig,

    browserify: {
      options: {
        browserifyOptions: {
          debug: true,
          paths: [
            process.cwd() + '/<%= app.src %>'
          ]
        }
      },
      testIndex: {
        files: {
          '<%= app.build %>/<%= app.test %>/index.js': [
            '<%= app.test %>/main.js'
          ]
        }
      },
      testDowloadView: {
        files: {
          '<%= app.build %>/<%= app.test %>/DownloadViewUITest.js': [
            '<%= app.test %>/DownloadViewUITest.js'
          ]
        }
      },
      testModalView: {
        files: {
          '<%= app.build %>/<%= app.test %>/ModalViewUITest.js': [
            '<%= app.test %>/ModalViewUITest.js'
          ]
        }
      },
      testSelectView: {
        files: {
          '<%= app.build %>/<%= app.test %>/SelectViewUITest.js': [
            '<%= app.test %>/SelectViewUITest.js'
          ]
        }
      }
    },

    connect: {
      options: {
        hostname: '*'
      },
      dev: {
        options: {
          base: [
            '<%= app.build %>/<%= app.test %>',
            '<%= app.build %>/<%= app.src %>',
            '<%= app.test %>',
            '<%= app.src %>',
            'node_modules'
          ],
          port: 8000
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: ['Gruntfile.js'],
      scripts: ['<%= app.src %>/**/*.js'],
      tests: ['<%= app.test %>/**/*.js']
    },

    mocha_phantomjs: {
      all: {
        options: {
          urls: [
            'http://localhost:<%= connect.dev.options.port %>/index.html'
          ]
        }
      }
    },

    watch: {
      scripts: {
        files: ['<%= app.src %>/**/*.js'],
        tasks: ['jshint:scripts', 'browserify', 'mocha_phantomjs']
      },
      tests: {
        files: ['<%= app.test %>/*.html', '<%= app.test %>/**/*.js'],
        tasks: [ 'jshint:tests', 'browserify', 'mocha_phantomjs']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile']
      }
    }
  });

  grunt.event.on('watch', function (action, filepath) {
    // Only lint the file that actually changed
    grunt.config(['jshint', 'scripts'], filepath);
  });

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
