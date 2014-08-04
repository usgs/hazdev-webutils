/* global define, describe, it, before, after */
define([
	'chai',
	'sinon',
	'mvc/Collection',
	'mvc/CollectionSelectBox'
], function (
	chai,
	sinon,
	Collection,
	CollectionSelectBox
) {
	'use strict';
	var expect = chai.expect;


	describe('Unit tests for the "CollectionSelectBox" class', function () {

		describe('Binds to Collection events', function () {
			var collection,
			    selectBox,
			    renderSpy,
			    selectSpy;

			before(function () {
				collection = new Collection();
				renderSpy = sinon.spy(CollectionSelectBox.prototype, 'render');
				selectSpy = sinon.spy(CollectionSelectBox.prototype, '_onSelect');
				selectBox = new CollectionSelectBox({
					collection: collection
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

		describe('Selects collection items', function () {
			var el = document.createElement('select'),
			    collection,
			    selectBox;

			collection = new Collection([
				{id: 1},
				{id: 2},
				{id: 3}
			]);

			selectBox = new CollectionSelectBox({
				el: el,
				collection: collection
			});

			it('selects collection item', function () {
				collection.deselect();
				selectBox._selectBox.value = '2';
				selectBox._onChange();
				expect(collection.getSelected().id).to.equal(3);
			});

			it('deselects collection item', function () {
				collection.selectById(2);
				selectBox._selectBox.value = '';
				selectBox._onChange();
				expect(collection.getSelected()).to.equal(null);
			});
		});

		describe('Shows selected collection item', function () {
			var el = document.createElement('select'),
			    collection,
			    selectBox;

			collection = new Collection([
				{id: 1},
				{id: 2},
				{id: 3}
			]);

			selectBox = new CollectionSelectBox({
				el: el,
				collection: collection
			});

			it('adds selected class on select', function () {
				collection.select(collection.get(1));
				collection.select(collection.get(2));
				// value is zero based index into collection
				expect(el.value).to.equal('1');
			});

			it('removes selected class on deselect', function () {
				collection.select(collection.get(2));
				collection.deselect();
				expect(el.value).to.equal('');
			});

		});

	});

});
