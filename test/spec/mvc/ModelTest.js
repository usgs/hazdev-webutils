/* global afterEach, beforeEach, chai, describe, it */
'use strict';

var Model = require('mvc/Model'),
    expect = chai.expect;


/**
 * Constructor for utility callback class.
 *
 * Callback function is defined on prototype, so is === across instances.
 */
var TestClass = function () {
  this.callbackCount = 0;
  this.callbackData = null;
};

/**
 * A callback function that tracks last callback.
 * @param data {Object} the callback data.
 */
TestClass.prototype.callback = function (data) {
  this.callbackCount++;
  this.callbackData = data;
};

describe('Unit tests for the "Model" class', function () {

  describe('get()', function () {
    it('returns null when key is not set', function () {
      var m = Model();

      expect(m.get('notset')).to.equal(null);
    });

    it('returns value after call to set', function () {
      var data = {'mykey': 'myvalue'},
          m = Model(data);

      expect(m.get('mykey')).to.equal(data.mykey);
    });
  });

  describe('set()', function () {
    it('triggers key specific change event when value changes', function () {
      var m = Model(),
          listener = new TestClass();

      m.on('change:mykey', listener.callback, listener);
      m.set({'mykey': 'myvalue'});
      expect(listener.callbackCount).to.equal(1);
      expect(listener.callbackData).to.equal('myvalue');
    });

    it('triggers generic change event when value changes', function () {
      var m = Model(),
          listener = new TestClass();

      m.on('change', listener.callback, listener);
      m.set({'mykey': 'myvalue'});
      expect(listener.callbackCount).to.equal(1);
      expect(listener.callbackData.mykey).to.equal('myvalue');
    });

    it('updates model object id properly when id is updated', function () {
      var m = Model({'id': 'testid'});

      // constructor set's id property
      expect(m.id).to.equal('testid');
      m.set({'id': 'testid_other'});
      expect(m.id).to.equal('testid_other');
    });
  });

  describe('update()', function () {
    var m,
        l1,
        l2,
        l3;

    beforeEach(function () {
      m = Model({a: {b: {c: 1}}});
      l1 = new TestClass();
      l2 = new TestClass();
      l3 = new TestClass();
      m.on('change:a.b', l1.callback, l1);
      m.on('change:a.b.c', l2.callback, l2);
      m.on('change', l3.callback, l3);
    });

    afterEach(function () {
      m.off();
      m.destroy();
      m = null;
      l1 = null;
      l2 = null;
      l3 = null;
    });

    it('adds new keys', function () {
      m.update({a: {b: {d: 2}}});
      // 1) triggers change:a.b
      expect(l1.callbackCount).to.equal(1);
      expect(l1.callbackData.d).to.equal(2);
      // 2) sets a.b.d
      expect(m.get().a.b.d).to.equal(2);
      // 3) doesn't change a.b.c
      expect(m.get().a.b.c).to.equal(1);
      expect(l2.callbackCount).to.equal(0);
      // 4) triggers change
      expect(l3.callbackCount).to.equal(1);
      expect(l3.callbackData.a.b.d).to.equal(2);
    });

    it('updates existing keys', function () {
      // updating a.b.c:
      m.update({a: {b: {c: 3}}});
      // 1) triggers change:a.b
      expect(l1.callbackCount).to.equal(1);
      expect(l1.callbackData.c).to.equal(3);
      // 2) triggers change:a.b.c
      expect(l2.callbackCount).to.equal(1);
      expect(l2.callbackData).to.equal(3);
      // 3) updates a.b.c
      expect(m.get().a.b.c).to.equal(3);
      // 4) triggers change
      expect(l3.callbackCount).to.equal(1);
      expect(l3.callbackData.a.b.c).to.equal(3);
    });

    it('ignores unchanged values', function () {
      m.update({a: {b: {c: 1}}});
      expect(l1.callbackCount).to.equal(0);
      expect(l2.callbackCount).to.equal(0);
      expect(l3.callbackCount).to.equal(0);
    });

  });

  describe('toJSON()', function () {
    it('serializes model data', function () {
      var data,
          model;

      data = {
        'key1': 'value1',
        'key2': 2.1234
      };
      model = Model(data);

      expect(JSON.parse(JSON.stringify(model))).to.deep.equal(data);
    });
  });
});
