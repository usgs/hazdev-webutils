'use strict';

var config = require('./config');

var htmlmin = {
  dist: {
    options: {
      collapseWhitespace: true,
      minifyCSS: true,
      removeComments: true
    },    
    files: [{
      expand: true,
      cwd: config.build + '/' + config.example,
      src: '**/*.html',
      dest: config.dist
    }]
  }
};

module.exports = htmlmin;
