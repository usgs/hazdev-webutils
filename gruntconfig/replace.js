'use strict';

var config = require('./config');

var replace = {
  dist: {
    options: {
      patterns: [
        {
          match: /(<link[^>]+>)+/g,
          replacement: '<link rel="stylesheet" href="hazdev-webutils.css"/>'
        }
      ]
    },
    files: [{
      expand: true,
      flatten: false,
      cwd: config.dist,
      src: ['*.html'],
      dest: config.dist
    }]
  }
};

module.exports = replace;
