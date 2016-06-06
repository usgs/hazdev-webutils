/* global chai, describe, it */
'use strict';


var View = require('mvc/View');


var expect = chai.expect;


describe('mvc/View', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof View).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(View).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      var view;

      view = View();

      expect(view.destroy).to.not.throw(Error);
      expect(view.destroy).to.not.throw(Error); // double-destroy should be ok

      view.destroy();
    });
  });
});
