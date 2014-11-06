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
          paths: [
            process.cwd() + '/<%= app.src %>'
          ]
        }
      },
      tests: {
        files: {
          '<%= app.build %>/<%= app.test %>/index.js': [
            '<%= app.test %>/main.js'
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
          base: '<%= app.test %>',
          port: 8000,
          middleware: function (connect, options) {
            return [
              connect.static(appConfig.build + '/' + appConfig.test),
              connect.static(options.base[0]),
              connect.static('node_modules')
            ];
          }
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
        tasks: ['jshint:scripts', 'browserify:tests', 'mocha_phantomjs']
      },
      tests: {
        files: ['<%= app.test %>/*.html', '<%= app.test %>/**/*.js'],
        tasks: [ 'jshint:tests', 'browserify:tests', 'mocha_phantomjs']
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
    'browserify:tests',
    'connect:dev',
    'mocha_phantomjs'
  ]);

  grunt.registerTask('default', [
    'test',
    'watch'
  ]);
};
