/* global chai, describe, it */
'use strict';

var Vector = require('util/math/Vector'),
    expect = chai.expect;


describe('Unit tests for the "Vector" class', function () {

  describe('Constructor', function () {
    it('is defined', function () {
      expect(Vector).to.not.equal(null);
    });
  });

  describe('add()', function () {
    it('adds correctly', function () {
      var v1,
          v2;
      v1 = Vector([1, 2, 3]);
      v2 = Vector([0.1, 0.2, 0.3]);
      expect(v1.add(v2).data()).to.deep.equal([1.1, 2.2, 3.3]);
    });
  });

  describe('angle()', function () {
    it('computes angle between vectors', function () {
      var v1,
          v2;
      v1 = Vector([3, 0]);
      v2 = Vector([5, 5]);
      expect(v1.angle(v2)).to.be.closeTo(Math.PI / 4, 1e-10);
    });
  });

  describe('azimuth()', function () {
    it('x axis is 90 degrees', function () {
      var v1;
      v1 = Vector([1, 0]);
      expect(v1.azimuth()).to.equal(Math.PI / 2);
    });

    it('y axis is 0 degrees', function () {
      var v1;
      v1 = Vector([0, 1]);
      expect(v1.azimuth()).to.equal(0);
    });

    it('z axis is 0 degrees', function () {
      var v1;
      v1 = Vector([0, 0, 1]);
      expect(v1.azimuth()).to.equal(0);
    });

    it('handles quadrant 3', function () {
      var v1;
      v1 = Vector([-1, 1]);
      expect(v1.azimuth()).to.equal(-Math.PI / 4);
    });
  });


  describe('cross()', function () {
    it('works with axis unit vectors', function () {
      var v1,
          v2;
      v1 = Vector([1, 0, 0]);
      v2 = Vector([0, 1, 0]);
      expect(v1.cross(v2).data()).to.deep.equal([0, 0, 1]);
    });

    it('works with non-unit vectors', function () {
      var v1,
          v2;
      v1 = Vector([1, 2, 3]);
      v2 = Vector([4, 5, 6]);
      expect(v1.cross(v2).data()).to.deep.equal([-3, 6, -3]);
    });
  });

  describe('dot()', function () {
    it('computes dot product of 3d vector', function () {
      var v1,
          v2;
      v1 = Vector([1, 2, 3]);
      v2 = Vector([4, -5, 6]);
      expect(v1.dot(v2)).to.equal(12);
    });

    it('computes dot product of 2d vector', function () {
      var v1,
          v2;
      v1 = Vector([-4, -9]);
      v2 = Vector([-1, 2]);
      expect(v1.dot(v2)).to.equal(-14);
    });
  });

  describe('equals()', function () {
    it('returns true when equal', function () {
      var v1,
          v2;
      v1 = Vector([1, 2, 3]);
      v2 = Vector([1, 2, 3]);
      expect(v1.equals(v2)).to.equal(true);
    });

    it('returns false when lengths are unequal', function () {
      var v1,
          v2;
      v1 = Vector([1, 2]);
      v2 = Vector([1, 2, 3]);
      expect(v1.equals(v2)).to.equal(false);
    });

    it('returns false when values are unequal', function () {
      var v1,
          v2;
      v1 = Vector([1, 2.1, 3]);
      v2 = Vector([1, 2, 3]);
      expect(v1.equals(v2)).to.equal(false);
    });
  });

  describe('magnitude()', function () {
    it('calculates magnitude of 2d vector', function () {
      var v1;
      v1 = Vector([3, 4]);
      expect(v1.magnitude()).to.equal(5);
    });

    it('calculates magnitude of 3d vector', function () {
      var v1;
      v1 = Vector([1, 2, 3]);
      expect(v1.magnitude()).to.equal(Math.sqrt(14));
    });
  });

  describe('multiply()', function () {
    it('multiplies correctly', function () {
      var v1;
      v1 = Vector([3, 4, 5]);
      expect(v1.multiply(0.5).data()).to.deep.equal([1.5, 2, 2.5]);
    });
  });

  describe('negative()', function () {
    it('negates correctly', function () {
      var v1;
      v1 = Vector([3, 4, 5]);
      expect(v1.negative().data()).to.deep.equal([-3, -4, -5]);
    });
  });

  describe('plunge()', function () {
    it('positive z => positive plunge', function () {
      var v1;
      v1 = Vector([1, 0, 1]);
      expect(v1.plunge()).to.be.closeTo(Math.PI / 4, 1e-10);
    });

    it('negative z => negative plunge', function () {
      var v1;
      v1 = Vector([0, 1, -1]);
      expect(v1.plunge()).to.be.closeTo(-Math.PI / 4, 1e-10);
    });
  });

  describe('unit()', function () {
    it('unitizes correctly', function () {
      var mag,
          unit,
          v1;
      v1 = Vector([1, 2, 3]);
      mag = v1.magnitude();
      unit = v1.unit();

      expect(unit.magnitude()).to.equal(1);
      expect(unit.x()).to.equal(1 / mag);
      expect(unit.y()).to.equal(2 / mag);
      expect(unit.z()).to.equal(3 / mag);
    });
  });

  describe('rotate()', function () {
    it('rotates in 2d', function () {
      var rotated,
          v1;
      v1 = Vector([1, 0, 0]);
      // rotate 90 degrees about z axis
      rotated = v1.rotate([0, 0, 1], Math.PI / 2);
      expect(rotated.x()).to.be.closeTo(0, 1e-10);
      expect(rotated.y()).to.equal(1);
      expect(rotated.z()).to.equal(0);
    });

    it('rotates in 3d', function () {
      var rotated,
          v1;
      v1 = Vector([1, 0, 0]);
      // rotate 45 degrees about [0, -1, 1] axis
      rotated = v1.rotate([0, -1, 1], Math.PI / 4);
      expect(rotated.x()).to.be.closeTo(Math.sqrt(2) / 2, 1e-10);
      expect(rotated.y()).to.be.closeTo(Math.sqrt(2) / 2, 1e-10);
      expect(rotated.z()).to.be.closeTo(Math.sqrt(2) / 2, 1e-10);
    });

    it('rotates in 3d with non-zero origin', function () {
      var rotated,
          v1;
      v1 = Vector([1, 0, 0]);
      // rotate 45 degrees about [0, -1, 1] axis
      rotated = v1.rotate([0, -1, 1], Math.PI / 4, [0, 1, 0]);
      expect(rotated.x()).to.be.closeTo(Math.sqrt(2), 1e-10);
      expect(rotated.y()).to.be.closeTo(1, 1e-10);
      expect(rotated.z()).to.be.closeTo(1, 1e-10);
    });
  });

  describe('subtract()', function () {
    it('subtracts correctly', function () {
      var v1,
          v2;
      v1 = Vector([1, 2, 3]);
      v2 = Vector([12, 14, 16]);
      expect(v2.subtract(v1).data()).to.deep.equal([11, 12, 13]);
    });
  });

  describe('x()', function () {
    it('accesses the x component', function () {
      expect(Vector([1, 2, 3]).x()).to.equal(1);
    });
  });

  describe('y()', function () {
    it('accesses the y component', function () {
      expect(Vector([1, 2, 3]).y()).to.equal(2);
    });
  });

  describe('z()', function () {
    it('accesses the z component', function () {
      expect(Vector([1, 2, 3]).z()).to.equal(3);
    });
  });

});
