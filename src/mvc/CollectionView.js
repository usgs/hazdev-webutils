'use strict';

var Collection = require('./Collection'),
    View = require('./View'),

    Util = require('../util/Util');

var CollectionView = function (options) {
  var _this,
      _initialize,

      _collection,
      _destroyCollection,
      _factory,
      _list,
      _views,

      _createViews,
      _onCollectionAdd,
      _onCollectionDeselect,
      _onCollectionRemove,
      _onCollectionReset,
      _onCollectionSelect;


  _this = View(options);

  _initialize = function (options) {
    _collection = options.collection;
    _factory = options.factory || View;

    if (!_collection) {
      _collection = Collection([]);
      _destroyCollection = true;
    }

    if (_this.el.nodeName === 'UL' || _this.el.nodeName === 'OL') {
      _list = _this.el;
    } else {
      _list = _this.el.appendChild(document.createElement('ul'));
    }

    _views = Collection([]);

    _collection.on('render', _this.render);
    _collection.on('change:add', _onCollectionAdd);
    _collection.on('change:remove', _onCollectionRemove);
    _collection.on('change:reset', _onCollectionReset);
    _collection.on('change:select', _onCollectionSelect);

    _onCollectionReset();
  };


  _createViews = function (models, parent) {
    var views;

    parent = parent || document.createDocumentFragment();

    views = models.map(function (model) {
      var view = _factory({
        collection: _collection,
        el: parent.appendChild(document.createElement('li')),
        model: model
      });

      if (typeof view.id === 'undefined' || view.id === null) {
        view.id = model.id;
      }
      view.el.setAttribute('data-id', view.id);

      return view;
    });

    return views;
  };

  _onCollectionAdd = function (change) {
    var fragment,
        views;

    fragment = document.createDocumentFragment();
    views = _createViews(change.added, fragment);

    // Add the newly created views to our view collection
    _views.add.apply(_views, views);

    // Append our new views to the end
    _list.appendChild(fragment);
  };

  _onCollectionRemove = function (change) {
    change.removed.forEach(function (model) {
      var view = _views.get(model.id);

      if (view) {
        _views.remove(view);

        if (view.el.parentNode === _list) {
          _list.removeChild(view.el);
        }
      }
    });
  };

  _onCollectionReset = function () {
    var views;

    // Destroy each previous view
    _views.data().forEach(function (view) {
      view.destroy();
    });

    // Create the views for the current data set
    views = _createViews(_collection.data(), document.createDocumentFragment());



    // Reset our collection with the new views
    _views.reset(views);

    // Now render them all
    _this.render();
  };

  _onCollectionSelect = function () {
    var el,
        i,
        id,
        index,
        len,
        selected,
        view,
        views;

    selected = _collection.getSelected();
    index = Collection.index(selected);

    views = _list.querySelectorAll('.selected');
    len = views.length;
    for (i = 0; i < len; i++) {
      el = views[i];
      if (el.parentNode !== _list) {
        // not direct descendent
        continue;
      }
      id = el.getAttribute('data-id');
      if (id in index) {
        // already selected, don't select below
        delete index[id];
        continue;
      } else {
        // deselect
        el.classList.remove('selected');
      }
    }

    // select remaining elements
    for (id in index) {
      view = _views.get(id);
      if (view) {
        view.el.classList.add('selected');
      }
    }
  };


  _this.destroy = Util.compose(_this.destroy, function () {
    _collection.off('render', _this.render);
    _collection.off('change:add', _onCollectionAdd);
    _collection.off('change:remove', _onCollectionRemove);
    _collection.off('change:reset', _onCollectionReset);
    _collection.off('change:select', _onCollectionSelect);

    if (_destroyCollection) {
      _collection.destroy();
    }

    _views.data().forEach(function (view) {
      view.destroy();
    });
    _views.destroy();


    _collection = null;
    _destroyCollection = null;
    _factory = null;
    _views = null;

    _createViews = null;
    _onCollectionAdd = null;
    _onCollectionDeselect = null;
    _onCollectionRemove = null;
    _onCollectionReset = null;
    _onCollectionSelect = null;

    _initialize = null;
    _this = null;
  });

  _this.getView = function (model) {
    return _views.get(model.id);
  };

  _this.render = function () {
    var fragment = document.createDocumentFragment();

    _views.data().forEach(function (view) {
      fragment.appendChild(view.el);
    });

    Util.empty(_list);
    _list.appendChild(fragment);

    // update selection
    _onCollectionSelect();
  };


  _initialize(options||{});
  options = null;
  return _this;
};

module.exports = CollectionView;
