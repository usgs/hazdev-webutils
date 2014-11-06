/* global describe, it, before, after */
'use strict';

var Collection = require('mvc/Collection'),
    CollectionTable = require('mvc/CollectionTable'),
    expect = require('chai').expect,
    sinon = require('sinon');


describe('Unit tests for the "CollectionTable" class', function () {

  describe('Binds to Collection events', function () {
    var collection,
        collectionTable,
        bindSpy;
        //renderSpy;
        // selectSpy;

    before(function () {
      collection = Collection();

      bindSpy = sinon.spy(collection, 'on');

      collectionTable = CollectionTable({
        collection: collection,
        columns: [],
        renderNow: false
      });
    });

    after(function () {
      // renderSpy.restore();
      // selectSpy.restore();
    });

    it('binds to reset', function () {
      /* jshint -W030 */
      expect(bindSpy.calledWith('reset', collectionTable.render)).to.be.true;
      /* jshint +W030 */
    });

    it('binds to add', function () {
      /* jshint -W030 */
      expect(bindSpy.calledWith('add', collectionTable.render)).to.be.true;
      /* jshint +W030 */
    });

    it('binds to remove', function () {
      /* jshint -W030 */
      expect(bindSpy.calledWith('remove', collectionTable.render)).to.be.true;
      /* jshint +W030 */
    });

    it('binds to select', function () {
      /* jshint -W030 */
      expect(bindSpy.calledWith('select')).to.be.true;
      /* jshint +W030 */
    });

    it('binds to deselect', function () {
      /* jshint -W030 */
      expect(bindSpy.calledWith('select')).to.be.true;
      /* jshint +W030 */
    });

  });

  describe('Handles empty collections', function () {

    it('Uses emptyMarkup when collection is empty', function () {
      var empty = 'test empty markup',
          collectionTable;

      collectionTable = CollectionTable({
        collection: Collection(),
        emptyMarkup: empty
      });
      expect(collectionTable.el.innerHTML).to.equal(empty);
    });

  });

  describe('Shows selected collection item', function () {
    var el = document.createElement('div'),
        collection,
        collectionTable;

    collection = Collection([
      {id: 1},
      {id: 2},
      {id: 3}
    ]);

    collectionTable = CollectionTable({
      el: el,
      collection: collection
    });

    it('adds selected class on select', function () {
      var selected;
      collection.select(collection.get(1));
      collection.select(collection.get(2));
      selected = el.querySelector('.selected');
      expect(selected.getAttribute('data-id')).to.equal('2');
    });

    it('removes selected class on deselect', function () {
      var selected;
      collection.select(collection.get(2));
      collection.deselect();
      selected = el.querySelector('.selected');
      expect(selected).to.equal(null);
    });

  });

  describe('Support row headers', function () {
    var el = document.createElement('div'),
        collection,
        collectionTable;

    collection = Collection([
      {id: 1},
      {id: 2},
      {id: 3}
    ]);

    collectionTable = CollectionTable({
      el: el,
      collection: collection,
      columns: [
        {
          className: 'id',
          title: 'ID',
          header: true,
          format: function (item) {
            return item.id;
          }
        },
        {
          className: 'name',
          title: 'Name',
          format: function (item) {
            return item.id;
          }
        }
      ]
    });

    it('uses th scope=row when header is true', function () {
      var idCell = el.querySelector('tbody > tr > .id');
      expect(idCell.nodeName).to.equal('TH');
      expect(idCell.getAttribute('scope')).to.equal('row');
    });

    it('uses td when header is not true', function () {
      var nameCell = el.querySelector('tbody > tr > .name');
      expect(nameCell.nodeName).to.equal('TD');
      expect(nameCell.getAttribute('scope')).to.equal(null);
    });
  });
});