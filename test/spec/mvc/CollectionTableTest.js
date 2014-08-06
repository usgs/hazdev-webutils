/* global define, describe, it, before, after */
define([
	'chai',
	'sinon',
	'mvc/Collection',
	'mvc/CollectionTable'
], function (
	chai,
	sinon,
	Collection,
	CollectionTable
) {
	'use strict';
	var expect = chai.expect;


	describe('Unit tests for the "CollectionTable" class', function () {

		describe('Binds to Collection events', function () {
			var collection,
			    collectionTable,
			    renderSpy,
			    selectSpy;

			before(function () {
				collection = new Collection();
				renderSpy = sinon.spy(CollectionTable.prototype, 'render');
				selectSpy = sinon.spy(CollectionTable.prototype, '_onSelect');
				collectionTable = new CollectionTable({
					collection: collection,
					columns: [],
					renderNow: false
				});
			});

			after(function () {
				renderSpy.restore();
				selectSpy.restore();
			});

			it('binds to reset', function () {
				renderSpy.reset();
				// reset collection data
				collection.reset([{id: 1}, {id: 2}, {id: 3}]);
				expect(renderSpy.callCount).to.equal(1);
			});

			it('binds to add', function () {
				renderSpy.reset();
				collection.add({id: 4});
				expect(renderSpy.callCount).to.equal(1);
			});

			it('binds to remove', function () {
				collection.reset([{id: 1}, {id: 2}, {id: 3}]);
				renderSpy.reset();
				// remove first item
				collection.remove(collection.data()[0]);
				expect(renderSpy.callCount).to.equal(1);
			});

			it('binds to select', function () {
				collection.reset([{id: 2, name: 'test2'}, {id: 3, name: 'test3'}]);
				selectSpy.reset();
				collection.select(collection.data()[0]);
				expect(selectSpy.callCount).to.equal(1);
			});

			it('binds to deselect', function () {
				collection.reset([{id: 2, name: 'test2'}, {id: 3, name: 'test3'}]);
				collection.select(collection.data()[0]);
				selectSpy.reset();
				collection.deselect();
				expect(selectSpy.callCount).to.equal(1);
			});

		});

		describe('Handles empty collections', function () {

			it('Uses emptyMarkup when collection is empty', function () {
				var empty = 'test empty markup',
				    collectionTable;

				collectionTable = new CollectionTable({
					collection: new Collection(),
					emptyMarkup: empty
				});
				expect(collectionTable._el.innerHTML).to.equal(empty);
			});

		});

		describe('Shows selected collection item', function () {
			var el = document.createElement('div'),
			    collection,
			    collectionTable;

			collection = new Collection([
				{id: 1},
				{id: 2},
				{id: 3}
			]);

			collectionTable = new CollectionTable({
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

	});

});
