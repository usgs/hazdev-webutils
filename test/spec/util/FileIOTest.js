/* global chai, describe, it */
'use strict';

var FileIO = require('util/FileIO');


var expect = chai.expect;


describe('FileIO', function () {
  describe('initialization', function () {
    it('can be required without blowing up', function () {
      /* jshint -W030 */
      expect(FileIO).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('can be instantiated without blowing up', function () {
      var io = FileIO();

      /* jshint -W030 */
      expect(io).to.not.be.undefined;
      /* jshint +W030 */
    });

    it('conforms to the expected API', function () {
      var io = FileIO();

      expect(io).to.respondTo('read');
      expect(io).to.respondTo('write');
      expect(io).to.respondTo('destroy');
    });
  });
});
