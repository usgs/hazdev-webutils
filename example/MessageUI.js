'use strict';

var Message = require('util/Message');


var buttonCreate,
    inputAutoclose,
    inputInsertBefore,
    inputMessage,
    inputType,
    outputContainer,

    _onCreateClick;


buttonCreate = document.querySelector('.alert-create');
inputAutoclose = document.querySelector('#alert-autoclose');
inputInsertBefore = document.querySelector('#alert-insert-before');
inputMessage = document.querySelector('#alert-message');
inputType = document.querySelector('#alert-type');
outputContainer = document.querySelector('.alert-outputs');

_onCreateClick = function () {
  var autoclose,
      classes;

  autoclose = 0;
  classes = [];

  if (inputType.value) {
    classes.push(inputType.value);
  }

  if (inputAutoclose.checked) {
    autoclose = 3000;
  }

  Message({
    container: outputContainer,
    content: inputMessage.value,

    autoclose: autoclose,
    classes: classes,
    insertBefore: inputInsertBefore.checked
  });
};

buttonCreate.addEventListener('click', _onCreateClick);
_onCreateClick();
