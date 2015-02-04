/* global chai, describe, it */
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