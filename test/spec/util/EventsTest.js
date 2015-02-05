/* global chai, sinon, describe, it, afterEach */
'use strict';

var Events = require('util/Events'),
    expect = chai.expect;


describe('Unit tests for the "Events" class', function () {
  afterEach(function () {
    Events.off('myevent');
  });

  describe('on()', function () {
    it('adds callback once for each call', function () {
      var evts = Events(),
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
          listener2 = sinon.spy(),
          static1 = sinon.spy(),
          static2 = sinon.spy();

      evts.on('myevent', listener1);
      evts.on('myevent', listener2);
      // Test static as well
      Events.on('myevent', static1);
      Events.on('myevent', static2);

      // both should be called
      evts.trigger('myevent');
      Events.trigger('myevent');

      expect(listener1.callCount).to.equal(1);
      expect(listener2.callCount).to.equal(1);
      expect(static1.callCount).to.equal(1);
      expect(static2.callCount).to.equal(1);

      // turn off without using callback
      evts.off('myevent');
      Events.off('myevent');

      // neither should be called
      evts.trigger('myevent');
      Events.trigger('myevent');

      expect(listener1.callCount).to.equal(1);
      expect(listener2.callCount).to.equal(1);
      expect(static1.callCount).to.equal(1);
      expect(static2.callCount).to.equal(1);
    });

    it('removes listeners of same type when no context is used', function () {
      var evts = new Events(),
          listener = sinon.spy(),
          context1 = {name: 'Object1', callback: listener},
          context2 = {name: 'Object2', callback: listener},
          s_listener = sinon.spy(),
          s_context1 = {name: 'S_Object1', callback: s_listener},
          s_context2 = {name: 'S_Object2', callback: s_listener};

      evts.on('myevent', context1.callback, context1);
      evts.on('myevent', context2.callback, context2);
      evts.on('myevent', s_context1.callback, s_context1);
      evts.on('myevent', s_context2.callback, s_context2);

      // both should be called
      evts.trigger('myevent');
      Events.trigger('myevent');

      expect(s_listener.callCount).to.equal(2);

      // turn off without using context
      evts.off('myevent', listener);
      evts.off('myevent', s_listener);

      // neither should be called
      evts.trigger('myevent');
      Events.trigger('myevent');

      expect(listener.callCount).to.equal(2);
      expect(s_listener.callCount).to.equal(2);
    });

    it('removes callback based on context', function () {
      var evts = new Events(),
          listener = sinon.spy(),
          context1 = {name: 'Object1', callback: listener},
          context2 = {name: 'Object2', callback: listener},
          s_listener = sinon.spy(),
          s_context1 = {name: 'S_Object1', callback: s_listener},
          s_context2 = {name: 'S_Object2', callback: s_listener};

      evts.on('myevent', context1.callback, context1);
      evts.on('myevent', context2.callback, context2);
      Events.on('myevent', s_context1.callback, s_context1);
      Events.on('myevent', s_context2.callback, s_context2);

      // both should be called
      evts.trigger('myevent');
      Events.trigger('myevent');

      expect(listener.callCount).to.equal(2);
      expect(s_listener.callCount).to.equal(2);

      // turn off without using context
      evts.off('myevent', listener, context1);
      Events.off('myevent', s_listener, s_context1);

      // neither should be called
      evts.trigger('myevent');
      Events.trigger('myevent');

      expect(listener.callCount).to.equal(3);
      expect(s_listener.callCount).to.equal(3);
    });
  });

  describe('static instance', function () {

    it('works for the static instance', function () {
      var listener = sinon.spy();

      Events.on('myevent', listener);
      Events.trigger('myevent');

      expect(listener.callCount).to.equal(1);

      Events.off('myevent', listener);
      Events.trigger('myevent');

      expect(listener.callCount).to.equal(1);
    });
  });

});