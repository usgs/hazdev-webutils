/* global afterEach, beforeEach, chai, describe, it */
'use strict';

var Collection = require('mvc/Collection'),
    CollectionView = require('mvc/CollectionView'),
    Model = require('mvc/Model');

var expect = chai.expect;


describe('CollectionView', function () {
  describe('constructor', function () {
    it('can be created and destroyed', function () {
      var createAndDestroy = function () {
        var view = CollectionView();
        view.destroy();
      };

      expect(createAndDestroy).not.to.throw(Error);
    });
  });

  describe('collection events', function () {
    var collection,
        model,
        view;

    beforeEach(function () {
      model = Model({id: 0});
      collection = Collection([model]);
      view = CollectionView({
        el: document.createElement('ul'),
        collection: collection
      });
    });

    afterEach(function () {
      view.destroy();
    });

    it('starts with a view for each model', function () {
      expect(view.el.childNodes.length).to.equal(1);
    });

    it('adds a view on collection add', function () {
      collection.add(Model({id: 1}));
      expect(view.el.childNodes.length).to.equal(2);
    });

    it('removes a view on collection remove', function () {
      collection.remove(model);
      expect(view.el.childNodes.length).to.equal(0);
    });

    it('resets with/without models', function () {
      collection.reset([]);
      expect(view.el.childNodes.length).to.equal(0);

      collection.reset([model]);
      expect(view.el.childNodes.length).to.equal(1);
    });

    it('selects/deselects the view for collection events', function () {
      expect(view.el.querySelectorAll('.selected').length).to.equal(0);
      collection.select(model);
      expect(view.el.querySelectorAll('.selected').length).to.equal(1);
      collection.select(null);
      expect(view.el.querySelectorAll('.selected').length).to.equal(0);
    });
  });
});
