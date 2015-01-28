/* global alert */
'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    SelectView = require('mvc/SelectView');


var c = Collection(),
    box1 = document.querySelector('#selectBox1'),
    box2 = document.querySelector('#selectBox2'),
    modelId = 0;

SelectView({collection: c, el: box1});
SelectView({collection: c, el: box2});

var addModel = function () {
  var m = Model({id: modelId, value: '' + modelId,
      display: 'Custom Model ' + modelId});

  c.add(m);

  modelId += 1;
};

var removeModel = function () {
  var data = c.data();
  if (!data || data.length <= 0) {
    alert('No more items to remove!');
    return;
  }

  c.remove(data[0]);
};

var resetCollection = function () {
  c.reset();
};

// Bind event listeners to buttons
document.querySelector('#addItem').addEventListener(
    'click', addModel);
document.querySelector('#removeItem').addEventListener(
    'click', removeModel);
document.querySelector('#resetItems').addEventListener(
    'click', resetCollection);

// Preload some models
addModel();
addModel();
addModel();
addModel();