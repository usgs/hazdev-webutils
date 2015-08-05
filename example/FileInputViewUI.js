'use strict';

var FileInputView = require('mvc/FileInputView');


var btnShowView,
    onCancel,
    onResults,
    onShowViewClick,
    output,
    view;


onShowViewClick = function () {
  view.show(true);
};

onResults = function (files) {
  var data;

  data = [];

  if (files.length === 0) {
    output.innerHTML = 'No Files to Display';
  } else {
    files.forEach(function (file) {
      data.push(JSON.stringify(file.get(), null, ' '));
    });

    output.innerHTML = data;
  }
};

onCancel = function () {
  output.innerHTML = 'Action Canceled';
};

view = FileInputView({
  uploadCallback: onResults,
  cancelCallback: onCancel
});

btnShowView = document.querySelector('.file-view-show');
output = document.querySelector('.results');


btnShowView.addEventListener('click', onShowViewClick);
onShowViewClick();
