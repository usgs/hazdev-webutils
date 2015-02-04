/* global chai, sinon, describe, it, before, after */
'use strict';

var Xhr = require('util/Xhr'),
    expect = chai.expect;


describe('Xhr test suite.', function () {
  describe('Constructor', function () {
    it('Can be defined.', function () {
      /* jshint -W030 */
      expect(Xhr).not.to.be.undefined;
      /* jshint +W030 */
    });
  });

  describe('ajax()', function () {

    it('is a function', function () {
      expect(Xhr).to.respondTo('ajax');
    });

    it('succeeds for a simple xml file', function (done) {
      var success = sinon.spy(function () {
        expect(success.callCount).to.equal(1);
        done();
      });
      var error = sinon.spy(function () {
        expect(error.callCount).to.equal(0);
        done();
      });

      Xhr.ajax({
        url: 'ajax.xml',
        success: success,
        error: error
      });
    });

    it('fails for a non-existent file', function (done) {
      var success = sinon.spy(function () {
        expect(success.callCount).to.equal(0);
        done();
      });
      var error = sinon.spy(function () {
        expect(error.callCount).to.equal(1);
        done();
      });

      Xhr.ajax({
        url: 'does-not-exist.html',
        restrictOrigin: true,
        success: success,
        error: error
      });
    });

  });

  describe('ajax() - restrict origin', function () {
    var fakeXhr,
        testXhr;

    before(function () {
      fakeXhr = sinon.useFakeXMLHttpRequest();
      fakeXhr.onCreate = function (xhr) {
        testXhr = xhr;
      };
    });

    after(function () {
      fakeXhr.restore();
    });

    it('restricts origin when specified', function () {
      var success = sinon.spy(),
          error = sinon.spy();

      Xhr.ajax({
        url: 'http://myfakesite.com/test/path.xml',
        restrictOrigin: true,
        success: success,
        error: error
      });

      testXhr.respond(200, {}, 'OK');

      expect(testXhr.url).to.equal('/test/path.xml');
      expect(success.called).to.equal(true);
      expect(error.called).to.equal(false);
    });

    it('keeps the origin when restrict is false', function () {
      var success = sinon.spy(),
          error = sinon.spy();

      Xhr.ajax({
        url: 'http://otherfakesite.com/test/path.xml',
        restrictOrigin: false,
        success: success,
        error: error
      });

      testXhr.respond(200, {}, 'OK');

      expect(testXhr.url).to.equal('http://otherfakesite.com/test/path.xml');
      expect(success.called).to.equal(true);
      expect(error.called).to.equal(false);
    });

  });

  describe('jsonp()', function () {
    it('has such a method', function () {
      expect(Xhr).to.respondTo('jsonp');
    });

    it('succeeds for simple jsonp data', function (done) {
      var success = sinon.spy(function () {
        expect(success.callCount).to.equal(1);
        done();
      });
      var error = sinon.spy(function () {
        expect(error.callCount).to.equal(0);
        done();
      });

      Xhr.jsonp({
        url: 'jsonp.js',
        success: success,
        error: error,
        callbackName: 'callback',
        callbackParameter: 'callback'
      });
    });

    it('false for non-existent jsonp data', function (done) {
      var success = sinon.spy(function () {
        expect(success.callCount).to.equal(0);
        done();
      });
      var error = sinon.spy(function () {
        expect(error.callCount).to.equal(1);
        done();
      });

      Xhr.jsonp({
        url: 'does-not-exist.js',
        success: success,
        error: error,
        callbackName: 'callback',
        callbackParameter: 'callback'
      });
    });
  });

  describe('getCallbackName()', function () {
    it('returns unique callback names', function () {
      var i,
          callbackNames = {},
          name;

      for (i = 0; i < 1000; i++) {
        name = Xhr.getCallbackName();
        expect(callbackNames).to.not.have.ownProperty(name);
        callbackNames[name] = true;
      }
    });
  });
});