/* global chai, sinon, describe, it, before */
'use strict';

var Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    expect = chai.expect;


var getChangeEvent = function () {
  var event = document.createEvent('Event');
  event.initEvent('change', true, true);
  return event;
};

describe('Unit tests for the "CollectionSelectBox" class', function () {

  describe('Binds to Collection events', function () {
    var collection,
        selectBox,
        bindSpy;

    before(function () {
      collection = Collection();

      bindSpy = sinon.spy(collection, 'on');

      selectBox = CollectionSelectBox({
        collection: collection
      });
    });

    it('binds to change', function () {
      /* jshint -W030 */
      expect(bindSpy.calledWith('change', selectBox.render)).to.be.true;
      /* jshint +W030 */
    });


    it('binds to change:select', function () {
      /* jshint -W030 */
      expect(bindSpy.calledWith('change:select')).to.be.true;
      /* jshint +W030 */
    });

  });

  describe('Selects collection items', function () {
    var el = document.createElement('select'),
        collection,
        selectBox;

    collection = Collection([
      {id: 1},
      {id: 2},
      {id: 3}
    ]);

    selectBox = CollectionSelectBox({
      el: el,
      collection: collection
    });

    it('selects collection item', function () {
      collection.select(null);
      selectBox.el.value = '2';
      selectBox.el.dispatchEvent(getChangeEvent());
      expect(collection.getSelected()[0].id).to.equal(2);
    });
  });

  describe('Shows selected collection item', function () {
    var el = document.createElement('select'),
        collection,
        selectBox;

    collection = Collection([
      {id: 1},
      {id: 2},
      {id: 3}
    ]);

    selectBox = CollectionSelectBox({
      el: el,
      collection: collection
    });

    it('adds selected class on select', function () {
      collection.select(collection.get(1));
      collection.select(collection.get(2));
      // value is zero based index into collection
      expect(el.value).to.equal('2');
    });

    it('has "Please select" value when includeBlankOption is true', function () {
      selectBox = CollectionSelectBox({
        el: el,
        collection: collection,
        includeBlankOption: true
      });

      collection.select(null);

      expect(el.value).to.equal('-1');
    });
  });
});
