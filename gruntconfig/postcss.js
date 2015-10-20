'use strict';

var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    precss = require('precss');

var config = require('./config');

var postcss = {

  build: {
    options: {
      processors: [
        precss(),
        autoprefixer({'browsers': 'last 2 versions'}) // vendor prefix as needed
      ]
    },
    src: config.src + '/hazdev-webutils.scss',
    dest: config.build + '/' + config.src + '/hazdev-webutils.css'
  },

  dist: {
    options: {
      processors: [
        cssnano({zindex: false}) // minify
      ]
    },
    src: config.build + '/' + config.src + '/hazdev-webutils.css',
    dest: config.dist + '/hazdev-webutils.css'
  }
};

module.exports = postcss;
