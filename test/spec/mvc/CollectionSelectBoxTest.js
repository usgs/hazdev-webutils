/* global describe, it, before */
'use strict';

var Collection = require('mvc/Collection'),
		CollectionSelectBox = require('mvc/CollectionSelectBox'),
		expect = require('chai').expect,
		sinon = require('sinon');


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

		it('binds to reset', function () {
			/* jshint -W030 */
			expect(bindSpy.calledWith('reset', selectBox.render)).to.be.true;
			/* jshint +W030 */
		});

		it('binds to add', function () {
			/* jshint -W030 */
			expect(bindSpy.calledWith('add', selectBox.render)).to.be.true;
			/* jshint +W030 */
		});

		it('binds to remove', function () {
			/* jshint -W030 */
			expect(bindSpy.calledWith('remove', selectBox.render)).to.be.true;
			/* jshint +W030 */
		});

		it('binds to select', function () {
			/* jshint -W030 */
			expect(bindSpy.calledWith('select')).to.be.true;
			/* jshint +W030 */
		});

		it('binds to deselect', function () {
			/* jshint -W030 */
			expect(bindSpy.calledWith('deselect')).to.be.true;
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
			collection.deselect();
			selectBox.el.value = '2';
			selectBox.el.dispatchEvent(getChangeEvent());
			expect(collection.getSelected().id).to.equal(3);
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
			expect(el.value).to.equal('1');
		});
	});

});