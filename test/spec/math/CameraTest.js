/* global chai, describe, it */
'use strict';

var Camera = require('math/Camera'),
    expect = chai.expect;


describe('Unit tests for the "Camera" class', function () {

  describe('Constructor', function () {
    it('is defined', function () {
      expect(Camera).to.not.equal(null);
    });
  });

  describe('project()', function () {
    it('z axis is from origin through lookAt', function () {
      var camera;

      camera = Camera({
        lookAt: [0, 0, 0],
        origin: [10, 0, 0],
        up: [0, 0, 1]
      });

      // project look at, should be on camera z axis.
      expect(camera.project([0, 0, 0])).to.deep.equal([0, 0, 10]);
      // camera x axis is world y axis
      expect(camera.project([0, 1, 0])).to.deep.equal([1, 0, 10]);
      // camera y axis is world z axis
      expect(camera.project([0, 0, 1])).to.deep.equal([0, 1, 10]);
    });
  });

});
