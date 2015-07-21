'use strict';

var ModalView = require('mvc/ModalView');


var LOREM =
    '<p>' +
        'START ipsum dolor sit amet, consectetur adipiscing elit. ' +
        'Phasellus ultrices mattis lorem, et ultricies leo mattis ' +
        'vel. Donec sodales adipiscing sem vel feugiat. Sed odio elit, ' +
        'volutpat in dignissim in, mollis nec neque. Sed leo tortor, temp ' +
        'aliquam diam quis, luctus varius mi. Aliquam volutpat id nunc at ' +
        'auctor. Sed ultricies est eu vulputate placerat. Curabitur vitae ' +
        'sem lacinia, dignissim odio quis, eleifend lorem. Integer a conse ' +
        'ctetur elit. Nullam eget lectus euismod, venenatis erat quis, ' +
        'egestas justo. Aenean laoreet metus eget arcu ornare, nec dict ' +
        'um mi aliquet. Nullam vel porta nibh. Quisque ac sodales augue. ' +
    '</p>';

    // '<p>' +
    //     'Quisque quis odio lobortis leo gravida auctor non non mauris. ' +
    //     'Cras dictum gravida tempor. Donec id leo massa. Maecenas eu '+
    //     'ultricies dui. Maecenas massa ante, fringilla vel enim vel, ' +
    //     'mattis scelerisque velit. In lorem erat, ornare sed dolor ' +
    //     'adipiscing, interdum egestas odio. Donec vulputate urna erat. ' +
    //     'Cras elementum nisi nec augue vehicula auctor. Pellentesque et' +
    //     'augue elementum, egestas odio sed, viverra libero. Donec ultrices ' +
    //     'risus eros, et dapibus nisl viverra eget. Suspendisse blandit ' +
    //     'scelerisque libero at commodo. Proin pretium ullamcorper turpis, ' +
    //     'in molestie orci tincidunt non. Integer ultrices, massa vel ' +
    //     'dictum dignissim, mi ligula laoreet nunc, at congue orci orci ' +
    //     'vel eros.' +
    //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
    //     'Phasellus ultrices mattis lorem, et ultricies leo mattis ' +
    //     'vel. Donec sodales adipiscing sem vel feugiat. Sed odio elit, ' +
    //     'volutpat in dignissim in, mollis nec neque. Sed leo tortor, temp ' +
    //     'aliquam diam quis, luctus varius mi. Aliquam volutpat id nunc at ' +
    //     'auctor. Sed ultricies est eu vulputate placerat. Curabitur vitae ' +
    //     'sem lacinia, dignissim odio quis, eleifend lorem. Integer a conse ' +
    //     'ctetur elit. Nullam eget lectus euismod, venenatis erat quis, ' +
    //     'egestas justo. Aenean laoreet metus eget arcu ornare, nec dict ' +
    //     'um mi aliquet. Nullam vel porta nibh. Quisque ac sodales augue. ' +

    //     'Quisque quis odio lobortis leo gravida auctor non non mauris. ' +
    //     'Cras dictum gravida tempor. Donec id leo massa. Maecenas eu '+
    //     'ultricies dui. Maecenas massa ante, fringilla vel enim vel, ' +
    //     'mattis scelerisque velit. In lorem erat, ornare sed dolor ' +
    //     'adipiscing, interdum egestas odio. Donec vulputate urna erat. ' +
    //     'Cras elementum nisi nec augue vehicula auctor. Pellentesque et' +
    //     'augue elementum, egestas odio sed, viverra libero. Donec ultrices ' +
    //     'risus eros, et dapibus nisl viverra eget. Suspendisse blandit ' +
    //     'scelerisque libero at commodo. Proin pretium ullamcorper turpis, ' +
    //     'in molestie orci tincidunt non. Integer ultrices, massa vel ' +
    //     'dictum dignissim, mi ligula laoreet nunc, at congue orci orci ' +

    //     'Quisque quis odio lobortis leo gravida auctor non non mauris. ' +
    //     'Cras dictum gravida tempor. Donec id leo massa. Maecenas eu '+
    //     'ultricies dui. Maecenas massa ante, fringilla vel enim vel, ' +
    //     'mattis scelerisque velit. In lorem erat, ornare sed dolor ' +
    //     'adipiscing, interdum egestas odio. Donec vulputate urna erat. ' +
    //     'Cras elementum nisi nec augue vehicula auctor. Pellentesque et' +
    //     'augue elementum, egestas odio sed, viverra libero. Donec ultrices ' +
    //     'risus eros, et dapibus nisl viverra eget. Suspendisse blandit ' +
    //     'scelerisque libero at commodo. Proin pretium ullamcorper turpis, ' +
    //     'in molestie orci tincidunt non. Integer ultrices, massa vel ' +
    //     'dictum dignissim, mi ligula laoreet nunc, at congue orci orci ' +

    //     'Quisque quis odio lobortis leo gravida auctor non non mauris. ' +
    //     'Cras dictum gravida tempor. Donec id leo massa. Maecenas eu '+
    //     'ultricies dui. Maecenas massa ante, fringilla vel enim vel, ' +
    //     'mattis scelerisque velit. In lorem erat, ornare sed dolor ' +
    //     'adipiscing, interdum egestas odio. Donec vulputate urna erat. ' +
    //     'Cras elementum nisi nec augue vehicula auctor. Pellentesque et' +
    //     'augue elementum, egestas odio sed, viverra libero. Donec ultrices ' +
    //     'risus eros, et dapibus nisl viverra eget. Suspendisse blandit ' +
    //     'scelerisque libero at commodo. Proin pretium ullamcorper turpis, ' +
    //     'in molestie orci tincidunt non. Integer ultrices, massa vel ' +
    //     'dictum dignissim, mi ligula laoreet nunc, at congue orci orci ' +

    //     'Quisque quis odio lobortis leo gravida auctor non non mauris. ' +
    //     'Cras dictum gravida tempor. Donec id leo massa. Maecenas eu '+
    //     'ultricies dui. Maecenas massa ante, fringilla vel enim vel, ' +
    //     'mattis scelerisque velit. In lorem erat, ornare sed dolor ' +
    //     'adipiscing, interdum egestas odio. Donec vulputate urna erat. ' +
    //     'Cras elementum nisi nec augue vehicula auctor. Pellentesque et' +
    //     'augue elementum, egestas odio sed, viverra libero. Donec ultrices ' +
    //     'risus eros, et dapibus nisl viverra eget. Suspendisse blandit ' +
    //     'scelerisque libero at commodo. Proin pretium ullamcorper turpis, ' +
    //     'in molestie orci tincidunt non. Integer ultrices, massa vel ' +
    //     'dictum dignissim, mi ligula laoreet nunc, at congue orci END ' +
    // '</p>';


var headerAndFooter = document.querySelector('.header-and-footer'),
    noHeader = document.querySelector('.no-header'),
    noFooter = document.querySelector('.no-footer'),
    noHeaderOrFooter = document.querySelector('.no-header-or-footer'),
    headerWithSuccess = document.querySelector('.header-with-success'),
    headerWithWarning = document.querySelector('.header-with-warning'),
    headerWithError = document.querySelector('.header-with-error'),
    headerAndFooterModal,
    noHeaderModal,
    noFooterModal,
    noHeaderOrFooterModal,
    headerWithSuccessModal,
    headerWithWarningModal,
    headerWithErrorModal;

headerAndFooterModal = ModalView(LOREM, {
  'title': 'Header',
  'buttons': ['Footer']
});

noHeaderModal = ModalView(LOREM, {
  'title': '',
  'buttons': ['Footer']
});

noFooterModal = ModalView(LOREM, {
  'title': 'Header',
  'buttons': []
});

noHeaderOrFooterModal = ModalView(LOREM, {
  'title': '',
  'buttons': []
});

headerWithSuccessModal = ModalView(LOREM, {
  'title': 'Success',
  'buttons': [],
  'classes': ['modal-success']
});

headerWithWarningModal = ModalView(LOREM, {
  'title': 'Warning',
  'buttons': [],
  'classes': ['modal-warning']
});

headerWithErrorModal = ModalView(LOREM, {
  'title': 'Error',
  'buttons': [],
  'classes': ['modal-error']
});

headerAndFooter.addEventListener('click', headerAndFooterModal.show.bind(headerAndFooterModal));
noHeader.addEventListener('click', noHeaderModal.show.bind(noHeaderModal));
noFooter.addEventListener('click', noFooterModal.show.bind(noFooterModal));
noHeaderOrFooter.addEventListener('click', noHeaderOrFooterModal.show.bind(noHeaderOrFooterModal));
headerWithSuccess.addEventListener('click', headerWithSuccessModal.show.bind(headerWithSuccessModal));
headerWithWarning.addEventListener('click', headerWithWarningModal.show.bind(headerWithWarningModal));
headerWithError.addEventListener('click', headerWithErrorModal.show.bind(headerWithErrorModal));