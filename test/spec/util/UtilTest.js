/* global chai, describe, it */
'use strict';

var Util = require('util/Util'),
    expect = chai.expect;


describe('Unit tests for the "Util" class', function () {
  var base = { // Some base properties
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  },
  extensions = {
    foo: 'FOO',
    alpha: 'first',
    omega: 'last'
  },
  expected = {
    foo: 'FOO',
    bar: 'bar',
    baz: 'baz',
    alpha: 'first',
    omega: 'last'
  };

  describe('equals()', function () {
    it('returns true for identity equals', function () {
      expect(Util.equals(base, base)).to.equal(true);
      expect(Util.equals(extensions, extensions)).to.equal(true);
      expect(Util.equals(expected, expected)).to.equal(true);
    });

    it('can handle empty objects', function () {
      expect(Util.equals({}, {})).to.equal(true);
    });

    it('returns true when objects are equal', function () {
      // Note :: Take care to ensure this reflects the "base" above.
      var base_copy = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz'
      };

      expect(Util.equals(base, base_copy)).to.equal(true);
      expect(Util.equals(base_copy, base)).to.equal(true);

      // TODO :: More complex tests
    });

    it('returns false for different objects', function () {
      expect(Util.equals(base, extensions)).to.equal(false);
      expect(Util.equals(base, expected)).to.equal(false);
      expect(Util.equals(extensions, expected)).to.equal(false);
    });

    it('honors the commutative property', function () {
      expect(Util.equals(base, extensions)).to.equal(
          Util.equals(extensions, base));
    });
  });

  describe('extend()', function () {

    it('extends a simple object correctly', function () {
      var result = Util.extend({}, base, extensions);
      expect(Util.equals(result, expected)).to.equal(true);
      expect(Util.equals(result, base)).to.equal(false);
      expect(Util.equals(result, extensions)).to.equal(false);
    });

    // TODO :: Test more complex object extension
  });

  describe('deepCompare()', function () {
    it('detects simple differences', function () {
      var result = Util.deepCompare({'a': 1, 'b': 2}, {'a': 2});
      expect(result.a).to.equal(2);
    });

    it('detects nested differences', function () {
      var result = Util.deepCompare(
          {
            'a': {
              'b': {
                'c': 5
              }
            }
          },
          {
            'a': {
              'b': 'abc'
            }
          });
      expect(result.a.b).to.equal('abc');
    });

    it('ignores nested similarities', function () {
      var result = Util.deepCompare(
        {
          'a': {
            'b': 1
          }
        },
        {
          'a': {
            'b': 1
          }
        }
      );
      expect(Util.isObjectEmpty(result)).to.equal(true);
    });
  });

  describe('deepExtend()', function () {
    it('extends simple differences', function () {
      var result = Util.deepExtend({'a': 1, 'b': 2}, {'a': 2});
      expect(result.a).to.equal(2);
      expect(result.b).to.equal(2);
    });

    it('extends nested differences', function () {
      var result = Util.deepExtend(
          {
            'a': {
              'b': {
                'c': 5
              },
              'd': 3
            }
          },
          {
            'a': {
              'b': 'abc'
            }
          });
      expect(result.a.b).to.equal('abc');
      expect(result.a.d).to.equal(3);
    });
  });

  describe('compose()', function () {
    var a = function (val) { return val + 1; },
        b = function (val) { return val + 2; },
        c = function (val) { return val - 3; };

    it('returns expected results', function () {
      var fn = Util.compose(a, b, c);
      expect(fn(0)).to.equal(0);
    });

    // TODO :: Test more interesting functions
  });

  describe('contains()', function () {
    var testArray = [
      'hello', 'world', null, 42, 9.2, base, 'goodbye'
    ];

    it('knows when an element is contained', function () {
      expect(Util.contains(testArray, 'hello')).to.equal(true);
      expect(Util.contains(testArray, 'world')).to.equal(true);
      expect(Util.contains(testArray, null)).to.equal(true);
      expect(Util.contains(testArray, 42)).to.equal(true);
      expect(Util.contains(testArray, 9.2)).to.equal(true);
      expect(Util.contains(testArray, base)).to.equal(true);
      expect(Util.contains(testArray, 'goodbye')).to.equal(true);
    });

    it('knows when an element is NOT contained', function () {
      expect(Util.contains(testArray, 'HELLO')).to.equal(false);
      expect(Util.contains(testArray, 'World!')).to.equal(false);
      expect(Util.contains(testArray, false)).to.equal(false);
      expect(Util.contains(testArray, 41)).to.equal(false);
      expect(Util.contains(testArray, 9.3)).to.equal(false);
      expect(Util.contains(testArray, {})).to.equal(false);
      expect(Util.contains(testArray, 'good_bye')).to.equal(false);
    });
  });

  // TODO :: Test suites for DOM manipulation methods
  //         -- addClass
  //         -- removeClass
  //         -- hasClass
  //         -- addEvent
  //         -- removeEvent
  //         -- getEvent
  //         -- getParentNode
  //         -- empty
  //         -- detach
  //         -- getWindowSize
  //         -- modernizer-ish feature detections
});
