/* global chai, sinon, describe, it */
'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    SelectView = require('mvc/SelectView'),
    expect = chai.expect;


describe('SelectView test suite.', function () {
  describe('Constructor', function () {
    it('Can be defined.', function () {
      /* jshint -W030 */
      expect(SelectView).not.to.be.undefined;
      /* jshint +W030 */
    });
  });

  describe('render', function () {
    it('is called when collection events trigger', function () {
      var c = null,
          v = null,
          m = null,
          spy;

      c = Collection();
      v = SelectView({collection: c});
      m = Model({display: 'Item 1', value: '1', id: 1});

      spy = sinon.spy(v, 'render');

      c.add(m);
      expect(spy.callCount).to.equal(1);

      c.remove(m);
      expect(spy.callCount).to.equal(2);

      c.reset();
      expect(spy.callCount).to.equal(3);

      v.render.restore();
    });

    it('keeps the selected item selected', function () {
      var c = Collection(),
          v = SelectView({collection: c}),
          sb = v.el,
          m1 = Model({id: 1, value: '1', display: 'Item 1'}),
          m2 = Model({id: 2, value: '2', display: 'Item 2'}),
          m3 = Model({id: 3, value: '3', display: 'Item 3'}),
          m4 = Model({id: 4, value: '4', display: 'Item 4'});

      c.add(m1);
      c.add(m2);
      c.select(m2);

      expect(sb.selectedIndex).to.equal(1);

      c.add(m3);
      c.add(m4);

      expect(sb.selectedIndex).to.equal(1);
    });
  });
});