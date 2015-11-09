'use strict';

var Matrix = require('./Matrix'),
    Vector = require('./Vector'),
    Util = require('util/Util');


var _DEFAULTS = {
  lookAt: [0, 0, 0],
  origin: [100, 100, 100],
  up: [0, 0, 1]
};


/**
 * Camera defines a coordinate translation from World coordinates (X, Y, Z)
 * to Camera coordinates (x, y, z).
 *
 * After projection:
 *     +z is to lookAt from camera
 *     +x is right from camera
 *     +y is up from camera
 *
 * @param options {Object}
 * @param options.origin {Array<Number>}
 *        default [100, 100, 100].
 *        position of camera in world coordinates.
 * @param options.lookAt {Array<Number>}
 *        default [0, 0, 0].
 *        position for camera to look at in world coordinates.
 * @param options.up {Array<Number>}
 *        default [0, 0, 1].
 *        vector pointing up in world coordinates.
 */
var Camera = function (options) {
  var _this,
      _initialize,
      // variables
      _lookAt,
      _origin,
      _up,
      _worldToCamera;


  _this = {};

  _initialize = function (options) {
    var rotate,
        translate,
        x,
        y,
        z;

    options = Util.extend({}, _DEFAULTS, options);

    _lookAt = Vector(options.lookAt);
    _origin = Vector(options.origin);
    _up = Vector(options.up);

    // camera axes using world coordinates
    // +z is from origin through look at
    z = _lookAt.subtract(_origin).unit();
    // +x is right
    x = z.cross(_up).unit();
    // +y is up
    y = x.cross(z).unit();

    rotate = Matrix([
      x.x(), x.y(), x.z(), 0,
      y.x(), y.y(), y.z(), 0,
      z.x(), z.y(), z.z(), 0,
      0, 0, 0, 1
    ], 4, 4);

    translate = Matrix([
      1, 0, 0, -_origin.x(),
      0, 1, 0, -_origin.y(),
      0, 0, 1, -_origin.z(),
      0, 0, 0, 1
    ], 4, 4);

    _worldToCamera = rotate.multiply(translate).data();
  };

  /**
   * Project a point from world coordinates to camera coordinates.
   *
   * @param world {Array<Number>}
   *        x, y, z world coordinates.
   * @return {Array<Number>}
   *        x, y, z, camera coordinates.
   */
  _this.project = function (world) {
    var projected,
        x,
        xp,
        y,
        yp,
        z,
        zp;

    x = world[0];
    y = world[1];
    z = world[2];
    projected = Matrix.multiply(_worldToCamera, 4, 4, [x, y, z, 1], 4, 1);

    xp = projected[0];
    yp = projected[1];
    zp = projected[2];
    return [xp, yp, zp];
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Camera;
