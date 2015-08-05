/* global chai, describe, it */
'use strict';

var FileInputView = require('mvc/FileInputView');


var expect = chai.expect;


describe('FileInputView', function () {
  describe('initialization', function () {
    it('can be required without blowing up', function () {
      /* jshint -W030 */
      expect(FileInputView).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('can be instantiated without blowing up', function () {
      var view = FileInputView();

      /* jshint -W030 */
      expect(view).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('conforms to the expected API', function () {
      var view = FileInputView();

      expect(view).to.respondTo('hide');
      expect(view).to.respondTo('show');
      expect(view).to.respondTo('destroy');
    });
  });
});
