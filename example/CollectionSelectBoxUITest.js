/* global alert */
'use strict';

var Collection = require('mvc/Collection'),
    CollectionSelectBox = require('mvc/CollectionSelectBox'),
    Model = require('mvc/Model');


var box1,
    box2,
    c,
    modelId;

c = Collection();
box1 = document.querySelector('#selectBox1');
box2 = document.querySelector('#selectBox2');
modelId = 0;


CollectionSelectBox({
  collection: c,
  el: box1
});
CollectionSelectBox({
  collection: c,
  el: box2
});

var addModel = function () {
  var m;

  m = Model({
        display: 'Custom Model ' + modelId,
        id: modelId,
        value: '' + modelId
      });

  c.add(m);

  modelId += 1;
};

var removeModel = function () {
  var data;

  data = c.data();

  if (!data || data.length <= 0) {
    alert('No more items to remove!');
    return;
  }

  c.remove(data[0]);
};

var resetCollection = function () {
  c.reset();
};

document.querySelector('#addItem').addEventListener(
    'click', addModel);
document.querySelector('#removeItem').addEventListener(
    'click', removeModel);
document.querySelector('#resetItems').addEventListener(
    'click', resetCollection);

addModel();
addModel();
addModel();
addModel();



var box3,
    c2,
    m2,
    output,
    select;

box3 = document.querySelector('#selectBox3');
output = document.querySelector('#output');
c2 = Collection();

m2 = Model({
  error: null,
  id: 'ID-101',
  stuff: 'yeah, more stuff',
  value: 'show me'
});

c2.add({
  error: 'Yes, 20',
  id: 'Error',
  value: 'one-oh-three'
});
c2.add({
  error: null,
  id: 'No-error',
  value: 'No error'
});

select = CollectionSelectBox({
  collection: c2,
  el: box3,
  includeBlankOption: true,
  model: m2
});

var updateModel = function () {
  var error,
      id,
      selected,
      value;

  selected = c2.getSelected();

  try {
    error = selected.error;
    id = selected.id;
    value = selected.value;
  } catch (e) {
    error = 'null';
    id = 'null';
    value = 'null';
  }

  m2.set({
    error: error,
    id: id,
    value: value
  });
};

var updateOutput = function () {
  var error,
      text;

  try {
    error = select.model.get('error');
  } catch (e) {
    error = 'null';
  }

  text = [
    '{' +
      'error: ' + error + ', ' +
      'id: ' + select.model.id + ', ' +
      'value: ' + select.model.get('value') +
    '}'
  ].join();

  output.innerHTML = text;
};

// Make sure to bind to both select and deselect for full functionality.
c2.on('deselect', updateModel);
c2.on('select', updateModel);
box3.addEventListener('click', updateOutput);
