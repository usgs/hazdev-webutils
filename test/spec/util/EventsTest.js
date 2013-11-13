/* global define, describe, it */

define([
	'chai',
	'sinon',

	'util/Events'
], function (
	chai,
	sinon,

	Events
) {
	'use strict';
	var expect = chai.expect;

	describe('Unit tests for the "Events" class', function () {

		describe('on()', function () {
			it('adds callback once for each call', function () {
				var evts = new Events(),
				    listener = sinon.spy();

				evts.on('myevent', listener);
				evts.on('myevent', listener);
				evts.trigger('myevent');
				expect(listener.callCount).to.equal(2);
			});
		});

		describe('off()', function () {
			it('removes all listeners when no callback is used', function () {
				var evts = new Events(),
				    listener1 = sinon.spy(),
				    listener2 = sinon.spy();

				evts.on('myevent', listener1);
				evts.on('myevent', listener2);

				// both should be called
				evts.trigger('myevent');
				expect(listener1.callCount).to.equal(1);
				expect(listener2.callCount).to.equal(1);

				// turn off without using callback
				evts.off('myevent');

				// neither should be called
				evts.trigger('myevent');
				expect(listener1.callCount).to.equal(1);
				expect(listener2.callCount).to.equal(1);
			});

			it('removes listeners of same type when no context is used', function () {
				var evts = new Events(),
				    listener = sinon.spy(),
				    context1 = {name: 'Object1', callback: listener},
				    context2 = {name: 'Object2', callback: listener};

				evts.on('myevent', context1.callback, context1);
				evts.on('myevent', context2.callback, context2);

				// both should be called
				evts.trigger('myevent');
				expect(listener.callCount).to.equal(2);

				// turn off without using context
				evts.off('myevent', listener);

				// neither should be called
				evts.trigger('myevent');
				expect(listener.callCount).to.equal(2);
			});

			it('removes callback based on context', function () {
				var evts = new Events(),
				    listener = sinon.spy(),
				    context1 = {name: 'Object1', callback: listener},
				    context2 = {name: 'Object2', callback: listener};

				evts.on('myevent', context1.callback, context1);
				evts.on('myevent', context2.callback, context2);

				// both should be called
				evts.trigger('myevent');
				expect(listener.callCount).to.equal(2);

				// turn off without using context
				evts.off('myevent', listener, context1);

				// neither should be called
				evts.trigger('myevent');
				expect(listener.callCount).to.equal(3);
			});
		});

		describe('static instance', function () {
			
			it('works for the static instance', function () {
				var listener = sinon.spy();

				Events.on('myevent', listener);
				Events.trigger('myevent');

				expect(listener.callCount).to.equal(1);

				Events.off('myevent', listener);

				expect(listener.callCount).to.equal(1);
			});
		});

	});

});
