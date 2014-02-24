HazDev - Web Utilities
======================

[![Build Status](https://api.travis-ci.org/usgs/hazdev-webutils.png?branch=master)](https://travis-ci.org/usgs/hazdev-webutils)

Utilities commonly used in web applications developed by the Earthquake Hazards
Program "HazDev" team.

Getting Started
---------------

This getting started guide assumes your development is taking place in a web
application scaffold created by the yeoman [hazdev-webapp
generator](https://github.com/emartinez-usgs/generator-hazdev-webapp). See the
documentation on that page for creating a new empty web application scaffolding.

Once you have a web application scaffolding, edit the bower.json file to
include the following line to the "dependencies" section:

`"hazdev-webutils": "~0.0.4"`

Next, modify `src/htdocs/js/index.js` to include the following "paths"
configurations:

``` javascript
paths: {
	'mvc': '/hazdev-webutils/src/mvc',
	'util': '/hazdev-webutils/src/util'
}
```

At this point you should be ready to develop your new web application using
this package library. To get started, type `grunt` on the command line and
watch the magic happen.

Gotchas
-------

 - If your web application defines an "mvc" or "util" Javascript package, your
application will have trouble finding all the files. This is a known issue and
will be fixed in a subsequent update to this bower package.

Changelog
---------

### 0.0.5 - 2014-02-24
 - Added toJSON method to Collection and Model for serialization to JSON.
 - Updated Xhr.jsonp to support multiple requests made in same millisecond.

### 0.0.4 - 2013-11-21
 - Added an Xhr utility class for making AJAX and JSONP requests.

### 0.0.3 - 2013-11-14
 - Fixed bug introduced in 0.0.2 where static calls to Events.off would bind
   a new listener rather than removing the existing listener.

### 0.0.2 - 2013-11-13
 - Added static wrappers with private instance to the Events class. This
   supports using Events in a static context using the new prototypal
   implementation.

### 0.0.1 - 2013-10-24
 - Fixed code for View to properly implement the Events interface.

### 0.0.0 - 2013-09-11
 - Initial package implementation. Includes support for:

```
    mvc/
      Collection.js
      ModalView.js
      Model.js
      ToggleView.js
      View.js
    util/
      Events.js
      Util.js
```

