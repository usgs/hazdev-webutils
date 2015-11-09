/* global chai, describe, it */
'use strict';

var Matrix = require('util/math/Matrix'),
    expect = chai.expect;


describe('Unit tests for the "Matrix" class', function () {

  describe('Constructor', function () {
    it('is defined', function () {
      expect(Matrix).to.not.equal(null);
    });
  });

  var matrix = Matrix([
    1, 2, 3,
    4, 5, 6,
    7, 8, 9
  ], 3, 3);

  describe('col()', function () {
    it('extracts columns correctly', function () {
      expect(matrix.col(0)).to.deep.equal([1, 4, 7]);
    });
  });

  describe('diagonal', function () {
    it('extracts diagonal correctly', function () {
      expect(matrix.diagonal()).to.deep.equal([1, 5, 9]);
    });
  });

  describe('get', function () {
    it('gets elements from first row', function () {
      expect(matrix.get(0, 2)).to.equal(3);
    });

    it('gets elements from other rows', function () {
      expect(matrix.get(2, 1)).to.equal(8);
    });
  });

  describe('jacobi', function () {
    it('computes eigenvectors', function () {
      var ev,
          m;

      m = Matrix([
        3, 1, 2,
        1, 2, 1,
        2, 1, 4
      ], 3, 3);
      ev = m.jacobi();

      expect(ev[0].magnitude()).to.be.closeTo(1.3080, 1e-4);
      expect(ev[0].unit().x()).to.be.closeTo(0.7370, 1e-4);
      expect(ev[0].unit().y()).to.be.closeTo(-0.5910, 1e-4);
      expect(ev[0].unit().z()).to.be.closeTo(-0.3280, 1e-4);

      expect(ev[1].magnitude()).to.be.closeTo(1.6431, 1e-4);
      expect(ev[1].unit().x()).to.be.closeTo(0.3280, 1e-4);
      expect(ev[1].unit().y()).to.be.closeTo(0.7370, 1e-4);
      expect(ev[1].unit().z()).to.be.closeTo(-0.5910, 1e-4);

      expect(ev[2].magnitude()).to.be.closeTo(6.0489, 1e-4);
      expect(ev[2].unit().x()).to.be.closeTo(0.5910, 1e-4);
      expect(ev[2].unit().y()).to.be.closeTo(0.3280, 1e-4);
      expect(ev[2].unit().z()).to.be.closeTo(0.7370, 1e-4);
    });
  });

  describe('multiply', function () {
    it('multiplies correctly', function () {
      var m2 = Matrix([1, 1, 1], 3, 1);
      m2 = matrix.multiply(m2);
      expect(m2.data()).to.deep.equal([6, 15, 24]);
    });
  });

  describe('row', function () {
    it('extracts rows correctly', function () {
      expect(matrix.row(1)).to.deep.equal([4, 5, 6]);
    });
  });

  describe('set', function () {
    it('updates elements', function () {
      var m2 = Matrix([1, 2, 3, 4, 5, 6], 2, 3);
      expect(m2.get(1, 1)).to.equal(5);
      m2.set(1, 1, 5.5);
      expect(m2.get(1, 1)).to.equal(5.5);
    });
  });

  describe('transpose', function () {
    it('transposes matrix', function () {
      expect(matrix.transpose().data()).to.deep.equal([
        1, 4, 7,
        2, 5, 8,
        3, 6, 9
      ]);
    });
  });

});
