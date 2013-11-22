/* global define, describe, it */
define([
	'chai',
	'sinon',

	'mvc/SelectView',
	'mvc/Collection',
	'mvc/Model'
], function (
	chai,
	sinon,

	SelectView,
	Collection,
	Model
) {
	'use strict';
	var expect = chai.expect;
	
	describe('SelectView test suite.', function () {
		describe('Constructor', function () {
			it('Can be defined.', function () {
				/* jshint -W030 */
				expect(SelectView).not.to.be.undefined;
				/* jshint +W030 */
			});

			it('Can be instantiated', function () {
				var c = new SelectView();
				expect(c).to.be.an.instanceof(SelectView);
			});
		});

		describe('render', function () {
			it('is called when collection events trigger', function () {
				var c = null,
				    v = null,
				    m = null,
				    spy = sinon.spy(SelectView.prototype, 'render');

				c = new Collection();
				v = new SelectView({collection: c});
				m = new Model({display: 'Item 1', value: '1', id: 1});
				expect(spy.callCount).to.equal(1); // Rendered once during construction

				c.add(m);
				expect(spy.callCount).to.equal(2);

				c.remove(m);
				expect(spy.callCount).to.equal(3);

				c.reset();
				expect(spy.callCount).to.equal(4);

				SelectView.prototype.render.restore();
			});

			it('keeps the selected item selected', function () {
				var c = new Collection(),
				    v = new SelectView({collection: c}),
				    m1 = new Model({id: 1, value: '1', display: 'Item 1'}),
				    m2 = new Model({id: 2, value: '2', display: 'Item 2'}),
				    m3 = new Model({id: 3, value: '3', display: 'Item 3'}),
				    m4 = new Model({id: 4, value: '4', display: 'Item 4'});

				c.add(m1);
				c.add(m2);
				c.select(m2);

				expect(v._selectBox.selectedIndex).to.equal(1);

				c.add(m3);
				c.add(m4);

				expect(v._selectBox.selectedIndex).to.equal(1);
			});
		});
	});
});
