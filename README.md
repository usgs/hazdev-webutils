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

`"hazdev-webutils": "~0.0.0"`

Next, modify `src/htdocs/js/index.js` to include the following "paths"
configurations:

`
paths: {
	'mvc': '/hazdev-webutils/src/mvc',
	'util': '/hazdev-webutils/src/util'
}
`

At this point you should be ready to develop your new web application using
this package library. To get started, type `grunt` on the command line and
watch the magic happen.

Gotchas
-------

 - If your web application defines an "mvc" or "util" Javascript package, your
application will have trouble finding all the files. This is a known issue and
will be fixed in a subsequent update to this bower package.
