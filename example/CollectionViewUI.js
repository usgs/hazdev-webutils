'use strict';

var Collection = require('mvc/Collection'),
    CollectionView = require('mvc/CollectionView'),
    Model = require('mvc/Model'),
    View = require('mvc/View'),

    Util = require('util/Util');


var ID_SEQUENCE,
    MODELS;

ID_SEQUENCE = 0;

MODELS = [
  Model({
    id: ID_SEQUENCE++,
    key1: 'value 1',
    key2: 'value 2'
  }),
  Model({
    id: ID_SEQUENCE++,
    key1: 'value 1',
    key2: 'value 2'
  }),
  Model({
    id: ID_SEQUENCE++,
    key1: 'value 1',
    key2: 'value 2'
  })
];


var ExampleView = function (params) {
  var _this,
      _initialize;

  _this = View(params);

  _initialize = function (/*params*/) {
    _this.render();
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _initialize = null;
    _this = null;
  });

  _this.render = function () {
    var data = _this.model.get(),
        keys = Object.keys(data),
        markup = [];

    keys.forEach(function (key) {
      markup.push(key + ' = ' + data[key] + '<br/>');
    });

    _this.el.innerHTML = markup.join('');
  };


  _initialize(params);
  params = null;
  return _this;
};


var btnAdd,
    btnRemove,
    btnReset,
    collection,
    container,
    format,
    view;


format = function (size) {
  var i,
      suffixes;

  suffixes = ['', 'K', 'M', 'G'];

  for (i = 0; size > 1024 && i < suffixes.length; i++) {
    size = size / 1024;
  }

  return Math.round(size, 3) + suffixes[i];
};


btnAdd = document.querySelector('.collection-add');
btnRemove = document.querySelector('.collection-remove');
btnReset = document.querySelector('.collection-reset');

collection = Collection(MODELS.slice(0));
container = document.querySelector('.collection-view');

view = CollectionView({
  el: container,
  collection: collection,
  factory: ExampleView
});


container.addEventListener('click', function (evt) {
  var element = evt.target,
      matches;

  if (element.nodeName === 'LI') {
    matches = element.innerHTML.match(/id = ([^<]*)<br/);

    if (matches) {
      collection.selectById(matches[1]);
    } else {
      console.log('Did not match the id pattern. Check default render method.');
    }
  }
});

btnAdd.addEventListener('click', function () {
  var model = Model({
    id: ID_SEQUENCE++,
    heap: format(window.performance.valueOf().memory.usedJSHeapSize),
    stamp: (new Date()).toUTCString()
  });

  collection.add(model);
  view.getView(model).render();
});

btnRemove.addEventListener('click', function () {
  var models = collection.data();

  if (models.length) {
    collection.remove(models[0]);
  }
});

btnReset.addEventListener('click', function () {
  collection.reset(MODELS.slice(0));
});
