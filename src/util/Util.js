'use strict';

// do these checks once, instead of once per call
var isMobile = false,
    supportsDateInput = false;


// static object with utility methods
var Util = function () {
};


Util.isMobile = function () {
  return isMobile;
};

Util.supportsDateInput = function () {
  return supportsDateInput;
};

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
Util.extend = function (dst) {
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
};

/**
 * Compare differences between two objects.
 *
 * Specifically, search for values in o1 that differ from the same value in o2.
 *
 * @param o1 {Object}
 *      reference object.
 * @param o2 {Object}
 *      comparison object.
 * @return {Object}
 *      object containing all differences in o2 compared to o1,
 *      or "false" if objects are identical.
 */
Util.deepCompare = function (o1, o2) {
  var changes,
      nestedChanges,
      prop,
      v1, v2;

  changes = {};
  // iterate over sources where properties are read
  if (o2) {
    for (prop in o2) {
      v1 = o1[prop];
      v2 = o2[prop];
      if (v1 === v2) {
        // already up to date
        continue;
      } else {
        if (v1 !== null && typeof v1 === 'object' &&
            v2 !== null && typeof v2 === 'object') {
          // if dst and src are objects, recurse
          nestedChanges = Util.deepCompare(v1, v2);
          if (!Util.isObjectEmpty(nestedChanges)) {
            changes[prop] = nestedChanges;
          }
        } else {
          changes[prop] = v2;
        }
      }
    }
  }

  // return differences
  return changes;
};

/**
 * Check if an object is empty.
 *
 * @param o {Object}
 *        object to check.
 * @return {Boolean}
 *         true if object has no properties, false otherwise.
 */
Util.isObjectEmpty = function (o) {
  var empty,
      key;

  empty = true;
  for (key in o) {
    empty = false;
    break;
  }

  return empty;
};

/**
 * Merge properties from a series of objects.
 *
 * Unlike extend(), if dst and src contain objects their keys are merged.
 *
 * @param dst {Object}
 *      target where merged properties are copied to.
 * @param <variable> {Object}
 *      source objects for properties. When a source is non null, it's
 *      properties are copied to the dst object. Properties are copied in
 *      the order of arguments: a property on a later argument overrides a
 *      property on an earlier argument.
 */
Util.deepExtend = function (dst) {
  var i, len, src, prop,
      srcval, dstval;

  // iterate over sources where properties are read
  for (i = 1, len = arguments.length; i < len; i++) {
    src = arguments[i];
    if (src) {
      for (prop in src) {
        dstval = dst[prop];
        srcval = src[prop];
        if (dstval === srcval) {
          // already up to date
          continue;
        } else if (dstval !== null && typeof dstval === 'object' &&
            srcval !== null && typeof srcval === 'object') {
          // if dst and src are objects, recurse
          dst[prop] = Util.deepExtend({}, dstval, srcval);
        } else {
          dst[prop] = src[prop];
        }
      }
    }
  }

  // return updated object
  return dst;
};

/**
 * Checks if objects are equal.
 *
 * @param a {Object}
 *      Object a.
 * @param b {Object}
 *      Object b.
 */
Util.equals = function (objA, objB) {
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
};

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
Util.getEvent = function (e) {
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
};

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
Util.getParentNode = function (el, nodeName, maxParent) {
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
};

// remove an elements child nodes
Util.empty = function (el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

// detach an element from its parent
Util.detach = function (el) {
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

Util.getWindowSize = function () {
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
};

/**
 * Creates a function that is a composition of other functions.
 *
 * For example:
 *      a(b(c(x))) === compose(c, b, a)(x);
 *
 * Each function should accept as an argument, the result of the previous
 * function call in the chain. It is allowable for all functions to have no
 * return value as well.
 *
 * @param ... {Function} A variable set of functions to call, in order.
 *
 * @return {Function} The composition of the functions provided as arguments.
 */
Util.compose = function () {
  var fns = arguments;

  return function (result) {
    var i,
        fn,
        len;

    for (i = 0, len = fns.length; i < len; i++) {
      fn = fns[i];

      if (fn && fn.call) {
        result = fn.call(this, result);
      }
    }

    return result;
  };
};

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
Util.contains = function (a, b) {
  var i, len;

  for (i = 0, len = a.length; i < len; i++) {
    if (b === a[i]) {
      return true;
    }
  }

  return false;
};

/**
 * @return
 *      true if object is an array
 */
Util.isArray = function (a) {

  if (typeof Array.isArray === 'function') {
    return Array.isArray(a);
  } else {
    return Object.prototype.toString.call(a) === '[object Array]';
  }

};


/**
 * Load a script asynchronously.
 *
 * @param url {String}
 *        script to load.
 * @param options {Object}
 *        additional options.
 * @param options.success {Function} optional.
 *        called after script loads successfully.
 * @param options.error {Function} optional.
 *        called after script fails to load.
 * @param options.done {Function} optional
 *        called after loadScript is complete,
 *        after calling success or error.
 */
Util.loadScript = function (url, options) {
  // load secondary script
  var cleanup,
      done,
      onError,
      onLoad,
      script;

  options = Util.extend({}, {
    success: null,
    error: null,
    done: null
  }, options);

  cleanup = function () {
    script.removeEventListener('load', onLoad);
    script.removeEventListener('error', onError);
    script.parentNode.removeChild(script);
    cleanup = null;
    onLoad = null;
    onError = null;
    script = null;
  };

  done = function () {
    if (options.done !== null) {
      options.done();
    }
    options = null;
  };

  onError = function () {
    cleanup();
    if (options.error !== null) {
      options.error.apply(null, arguments);
    }
    done();
  };

  onLoad = function () {
    cleanup();
    if (options.success !== null) {
      options.success.apply(null, arguments);
    }
    done();
  };

  script = document.createElement('script');
  script.addEventListener('load', onLoad);
  script.addEventListener('error', onError);
  script.src = url;
  script.async = true;
  document.querySelector('script').parentNode.appendChild(script);
};


// Do these checks once and cache the results
(function() {
  var testEl = document.createElement('div');
  var testInput = document.createElement('input');
  var str = navigator.userAgent||navigator.vendor||window.opera;

  isMobile = str.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i);
  testInput.setAttribute('type', 'date');
  supportsDateInput = (testInput.type !== 'text');

  // clean up testing element
  testEl = null;
})();

module.exports = Util;
