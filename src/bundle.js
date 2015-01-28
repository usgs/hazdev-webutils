'use strict';

var bundle = {
  mvc: {
    Collection: require('./mvc/Collection'),
    CollectionSelectBox: require('./mvc/CollectionSelectBox'),
    CollectionTable: require('./mvc/CollectionTable'),
    DataTable: require('./mvc/DataTable'),
    DownloadView: require('./mvc/DownloadView'),
    ModalView: require('./mvc/ModalView'),
    Model: require('./mvc/Model'),
    SelectView: require('./mvc/SelectView'),
    SortView: require('./mvc/SortView'),
    View: require('./mvc/View')
  },

  util: {
    Events: require('./util/Events'),
    Util: require('./util/Util'),
    Xhr: require('./util/Xhr')
  }
};

module.exports = bundle;