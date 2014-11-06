/* global define */
define([
], function (
) {
  'use strict';

  // do these checks once, instead of once per call
  var supportsClassList = false,
      supportsAddEventListener = false,
      supportsDateInput = false,
      isMobile = false;


  // static object with utility methods
  var Util = {
    isMobile: function () {
        return isMobile;
    },

    supportsDateInput: function () {
        return supportsDateInput;
    },

    /**
     * Merge properties from a series of objects.
     *
     * @param dst {Object}
     *      target where merged properties are copied to.
     * @param <variable> {Object}
     *      source objects for properties. When a source is non null, it's
     *      properties are copied to the dst object. Properties are copied in
     *      the order of arguments: a property on a later argument overrides a
     *      property on an earlier argument.
     */
    extend: function (dst) {
      var i, len, src, prop;

      // iterate over sources where properties are read
      for (i = 1, len = arguments.length; i < len; i++) {
        src = arguments[i];
        if (src) {
          for (prop in src) {
            dst[prop] = src[prop];
          }
        }
      }

      // return updated object
      return dst;
    },

    /**
     * Checks if objects are equal.
     *
     * @param a {Object}
     *      Object a.
     * @param b {Object}
     *      Object b.
     */
    equals: function (objA, objB) {
      var keya, keyb;

      if (objA === objB) {
        // if === then ===, no question about that...
        return true;
      } else if (objA === null || objB === null) {
        // funny, typeof null === 'object', so ... hmph!
        return false;
      } else if (typeof objA === 'object' && typeof objB === 'object') {
        // recursively check objects
        for (keya in objA) {
          if (objA.hasOwnProperty(keya)) {
            if (!objB.hasOwnProperty(keya)) {
              return false; // objB is missing a key from objA
            }
          }
        }

        for (keyb in objB) {
          if (objB.hasOwnProperty(keyb)) {
            if (!objA.hasOwnProperty(keyb)) {
              return false; // objA is missing a key from objB
            } else if (!Util.equals(objA[keyb], objB[keyb])) {
              return false; // objA[key] !== objB[key]
            }
          }
        }

        return true; // Recursively equal, so equal
      } else {
        return objA === objB; // Use baked in === for primitives
      }
    },

    /**
     * Add a class to an element.
     *
     * @param el {DOMElement}
     *      the element to modify.
     * @param className {String}
     *      the class to add.
     */
    addClass: function (el, className) {
      var i, len, classes;

      if (!el) {
        return;
      } else if (supportsClassList) {
        // html 5
        el.classList.add(className);
      } else {
        // other
        classes = el.className.split(/\s+/);
        for (i = 0, len = classes.length; i < len; i++) {
          if (classes[i] === className) {
            return false;
          }
        }
        classes.push(className);
        el.className = classes.join(' ');
      }
    },

    /**
     * Remove a class from an element.
     *
     * @param el the element to modify.
     * @param className the class to remove.
     */
    removeClass: function (el, className) {
      var i, len, classes;

      if (!el) {
        return;
      } else if (supportsClassList) {
        // html 5
        el.classList.remove(className);
      } else {
        // other
        classes = el.className.split(/\s+/);
        for (i = 0, len = classes.length; i < len; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            el.className = classes.join(' ');
            return true;
          }
        }
        return false;
      }

    },

    /**
     * Test whether an element has a class.
     *
     * @param el {DOMElement}
     *      the element to test.
     * @param className {String}
     *      the class to find.
     */
    hasClass: function(el, className) {
      var i, len, classes;

      if (!el) {
        return;
      } else if (supportsClassList) {
        // html 5
        return el.classList.contains(className);
      } else {
        // other
        classes = el.className.split(/\s+/);
        for (i = 0, len = classes.length; i < len; i++) {
          if (classes[i] === className) {
            return true;
          }
        }
      }

    },

    /**
     * Add an event listener to an element.
     *
     * @param el {DOMElement}
     *      the element.
     * @param eventName {String}
     *      the event name (e.g. 'click').
     * @param callback {Function}
     *      the callback function.
     */
    addEvent: function (el, eventName, callback) {

      if (!el) {
        return;
      } else if (supportsAddEventListener) {
        el.addEventListener(eventName, callback, false);
      } else {
        el.attachEvent('on' + eventName, callback);
      }

    },

    /**
     * Remove an event listener from an element.
     * @param el {DOMElement}
     *      the element.
     * @param eventName {String}
     *      the event name (e.g. 'click').
     * @param callback {Function}
     *      the callback function.
     */
    removeEvent: function (el, eventName, callback) {

      if (!el) {
        return;
      } else if (supportsAddEventListener) {
        el.removeEventListener(eventName, callback, false);
      } else {
        el.detachEvent('on' + eventName, callback);
      }

    },

    /**
     * Get an event object for an event handler.
     *
     * @param e the event that was received by the event handler.
     * @return {Object}
     *      with two properties:
     *      target
     *           the element where the event occurred.
     *      originalEvent
     *           the event object, either parameter e or window.event (in IE).
     */
    getEvent: function (e) {
      var targ;

      if (!e) {
        // ie puts event in global
        e = window.event;
      }

      // find target
      if (e.target) {
        targ = e.target;
      } else if (e.srcElement) {
        targ = e.srcElement;
      }

      // handle safari bug
      if (targ.nodeType === 3) {
        targ = targ.parentNode;
      }

      // return target and event
      return {
        target: targ,
        originalEvent: e
      };
    },

    /**
     * Get a parent node based on it's node name.
     *
     * @param el {DOMElement}
     *      element to search from.
     * @param nodeName {String}
     *      node name to search for.
     * @param maxParent {DOMElement}
     *      element to stop searching.
     * @return {DOMElement}
     *      matching element, or null if not found.
     */
    getParentNode: function (el, nodeName, maxParent) {
      var curParent = el;

      while (curParent && curParent !== maxParent &&
          curParent.nodeName.toUpperCase() !== nodeName.toUpperCase()) {
        curParent = curParent.parentNode;
      }
      if (curParent && 'nodeName' in curParent &&
          curParent.nodeName.toUpperCase() === nodeName.toUpperCase()) {
        // found the desired node
        return curParent;
      }

      // didn't find the desired node
      return null;
    },

    // remove an elements child nodes
    empty: function (el) {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    },

    // detach an element from its parent
    detach: function (el) {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    },

    getWindowSize: function () {
      var dimensions = {width:null,height:null};

      if ('innerWidth' in window && 'innerHeight' in window) {
        dimensions = {
          width: window.innerWidth,
          height: window.innerHeight
        };
      } else {
        // probably IE<=8
        var elem = 'documentElement' in document ?
            document.documentElement : document.body;

        dimensions = {
          width: elem.offsetWidth,
          height: elem.offsetHeight
        };
      }

      return dimensions;
    },

    /**
     * Checks the elements of a looking for b. b is assumed to be found if for
     * some object in a (a[i]), a[i] === b. Note strict equality.
     *
     * @param a {Array}
     *      An array to search
     * @param b {Mixed}
     *      A value to search for
     *
     * @return
     *      true if array a contains b
     */
    contains: function (a, b) {
      var i, len;

      for (i = 0, len = a.length; i < len; i++) {
        if (b === a[i]) {
          return true;
        }
      }

      return false;
    },

    /**
     * @return
     *      true if object is an array
     */
    isArray: function (a) {

      if (typeof Array.isArray === 'function') {
        return Array.isArray(a);
      } else if (a.constructor === Array) {
        return true;
      }

      return false;
    }

  };

  // Do these checks once and cache the results
  (function() {
    var testEl = document.createElement('div');
    var testInput = document.createElement('input');
    var str = navigator.userAgent||navigator.vendor||window.opera;

    isMobile = str.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i);
    supportsClassList = ('classList' in testEl);
    supportsAddEventListener = ('addEventListener' in testEl);
    testInput.setAttribute('type', 'date');
    supportsDateInput = (testInput.type !== 'text');

    // clean up testing element
    testEl = null;
  })();

  return Util;
});
