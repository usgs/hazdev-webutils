// PhantomJS is missing native bind support,
//     https://github.com/ariya/phantomjs/issues/10522
// Polyfill from:
//     https://developer.mozilla.org
//         /en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		'use strict';
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5 internal IsCallable
			throw new TypeError('object to be bound is not callable');
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
		    fToBind = this,
		    FNOP = function () {},
		    fBound;

		fBound = function () {
			return fToBind.apply(
					(this instanceof FNOP && oThis ? this : oThis),
					aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		FNOP.prototype = this.prototype;
		fBound.prototype = new FNOP();

		return fBound;
	};
}


require.config({
	baseUrl: '..',
	paths: {
		mocha: 'mocha/mocha',
		chai: 'chai/chai',
		sinon: 'sinon/pkg/sinon'
	},
	shim: {
		mocha: {
			exports: 'mocha'
		},
		chai: {
			deps: ['mocha'],
			exports: 'chai'
		},
		sinon: {
			exports: 'sinon'
		}
	}
});

require([
	'mocha',
], function (mocha) {
	'use strict';

	mocha.setup('bdd');

	// Add each test class here as they are implemented
	require([
		'spec/mvc/CollectionTest',
		'spec/mvc/ModelTest',
		'spec/mvc/SelectViewTest',
		'spec/mvc/CollectionTableTest',
		'spec/mvc/CollectionSelectBoxTest',

		'spec/util/EventsTest',
		'spec/util/UtilTest',
		'spec/util/XhrTest'
	], function () {
		if (window.mochaPhantomJS) {
			window.mochaPhantomJS.run();
		} else {
			mocha.run();
		}
	});
});
