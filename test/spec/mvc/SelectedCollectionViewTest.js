/* global chai, sinon, describe, it, before, after */
'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    SelectedCollectionView = require('mvc/SelectedCollectionView'),
    expect = chai.expect;

describe('Unit tests for the "SelectedCollectionView" class', function () {

  var bindSpyCollection,
      bindSpyModel,
      collection,
      model,
      view;

  before(function () {
    model = Model({'id': '1'});
    collection = Collection();
    collection.add(model);

    bindSpyCollection = sinon.spy(collection, 'on');
    bindSpyModel = sinon.spy(model, 'on');

    view = SelectedCollectionView({
      collection: collection
    });
  });

  after(function () {
    view.destroy();
  });

  describe('Binds to Collection events', function () {

    it('binds to select', function () {
      /* jshint -W030 */
      expect(bindSpyCollection.calledWith('select')).to.be.true;
      /* jshint +W030 */
    });

    it('binds to deselect', function () {
      /* jshint -W030 */
      expect(bindSpyCollection.calledWith('deselect')).to.be.true;
      /* jshint +W030 */
    });

  });

  describe('Binds to selected Model events', function () {

    it('binds to change', function () {
      /* jshint -W030 */
      collection.select(model);
      expect(bindSpyModel.calledWith('change')).to.be.true;
      /* jshint +W030 */
    });

  });

});
