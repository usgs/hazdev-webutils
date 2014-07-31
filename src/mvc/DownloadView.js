/* global define */
define([
	'util/Util',
	'mvc/View',
	'mvc/ModalView'
], function (
	Util,
	View,
	ModalView
) {
	'use strict';


	var DEFAULTS = {
		help: '',
		format: function (collection) {
			return JSON.stringify(collection);
		},
		title: 'Download'
	};


	var DownloadView = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
		View.call(this, options);
	};

	DownloadView.prototype = Object.create(View.prototype);


	DownloadView.prototype._initialize = function () {
		var el = this._el,
		    options = this._options;

		this.show = this.show.bind(this);
		el.className = 'download-view';
		el.innerHTML = '<div class="help">' + options.help + '</div>' +
				'<textarea class="download"></textarea>';
		this._textarea = el.querySelector('.download');
	};

	DownloadView.prototype.show = function () {
		if (!this._modal) {
			this._modal = new ModalView(this._el, {
				title: this._options.title
			});
		}

		this.render();
		this._modal.show();
		this._textarea.select();
	};


	DownloadView.prototype.render = function () {
		var options = this._options;

		this._textarea.value = options.format(options.collection);
	};


	return DownloadView;

});