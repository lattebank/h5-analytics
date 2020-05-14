/* analytics.js-core 3.4.1-1 */
var analytics = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var componentEmitter = createCommonjsModule(function (module) {
	/**
	 * Expose `Emitter`.
	 */

	{
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	}
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};
	});

	var analytics_jsObjCase = createCommonjsModule(function (module) {


	/**
	 * Module exports, export
	 */

	module.exports = multiple(find);
	module.exports.find = module.exports;


	/**
	 * Export the replacement function, return the modified object
	 */

	module.exports.replace = function (obj, key, val, options) {
	  multiple(replace).call(this, obj, key, val, options);
	  return obj;
	};


	/**
	 * Export the delete function, return the modified object
	 */

	module.exports.del = function (obj, key, options) {
	  multiple(del).call(this, obj, key, null, options);
	  return obj;
	};


	/**
	 * Compose applying the function to a nested key
	 */

	function multiple (fn) {
	  return function (obj, path, val, options) {
	    var normalize = options && isFunction(options.normalizer) ? options.normalizer : defaultNormalize;
	    path = normalize(path);

	    var key;
	    var finished = false;

	    while (!finished) loop();

	    function loop() {
	      for (key in obj) {
	        var normalizedKey = normalize(key);
	        if (0 === path.indexOf(normalizedKey)) {
	          var temp = path.substr(normalizedKey.length);
	          if (temp.charAt(0) === '.' || temp.length === 0) {
	            path = temp.substr(1);
	            var child = obj[key];

	            // we're at the end and there is nothing.
	            if (null == child) {
	              finished = true;
	              return;
	            }

	            // we're at the end and there is something.
	            if (!path.length) {
	              finished = true;
	              return;
	            }

	            // step into child
	            obj = child;

	            // but we're done here
	            return;
	          }
	        }
	      }

	      key = undefined;
	      // if we found no matching properties
	      // on the current object, there's no match.
	      finished = true;
	    }

	    if (!key) return;
	    if (null == obj) return obj;

	    // the `obj` and `key` is one above the leaf object and key, so
	    // start object: { a: { 'b.c': 10 } }
	    // end object: { 'b.c': 10 }
	    // end key: 'b.c'
	    // this way, you can do `obj[key]` and get `10`.
	    return fn(obj, key, val);
	  };
	}


	/**
	 * Find an object by its key
	 *
	 * find({ first_name : 'Calvin' }, 'firstName')
	 */

	function find (obj, key) {
	  if (obj.hasOwnProperty(key)) return obj[key];
	}


	/**
	 * Delete a value for a given key
	 *
	 * del({ a : 'b', x : 'y' }, 'X' }) -> { a : 'b' }
	 */

	function del (obj, key) {
	  if (obj.hasOwnProperty(key)) delete obj[key];
	  return obj;
	}


	/**
	 * Replace an objects existing value with a new one
	 *
	 * replace({ a : 'b' }, 'a', 'c') -> { a : 'c' }
	 */

	function replace (obj, key, val) {
	  if (obj.hasOwnProperty(key)) obj[key] = val;
	  return obj;
	}

	/**
	 * Normalize a `dot.separated.path`.
	 *
	 * A.HELL(!*&#(!)O_WOR   LD.bar => ahelloworldbar
	 *
	 * @param {String} path
	 * @return {String}
	 */

	function defaultNormalize(path) {
	  return path.replace(/[^a-zA-Z0-9\.]+/g, '').toLowerCase();
	}

	/**
	 * Check if a value is a function.
	 *
	 * @param {*} val
	 * @return {boolean} Returns `true` if `val` is a function, otherwise `false`.
	 */

	function isFunction(val) {
	  return typeof val === 'function';
	}
	});
	var analytics_jsObjCase_1 = analytics_jsObjCase.find;
	var analytics_jsObjCase_2 = analytics_jsObjCase.replace;
	var analytics_jsObjCase_3 = analytics_jsObjCase.del;

	/**
	 * Add address getters to `proto`.
	 *
	 * @ignore
	 * @param {Function} proto
	 */
	var address = function (proto) {
	  proto.zip = trait('postalCode', 'zip');
	  proto.country = trait('country');
	  proto.street = trait('street');
	  proto.state = trait('state');
	  proto.city = trait('city');
	  proto.region = trait('region');

	  function trait(a, b) {
	    return function () {
	      var traits = this.traits();
	      var props = this.properties ? this.properties() : {};

	      return analytics_jsObjCase(traits, 'address.' + a)
	        || analytics_jsObjCase(traits, a)
	        || (b ? analytics_jsObjCase(traits, 'address.' + b) : null)
	        || (b ? analytics_jsObjCase(traits, b) : null)
	        || analytics_jsObjCase(props, 'address.' + a)
	        || analytics_jsObjCase(props, a)
	        || (b ? analytics_jsObjCase(props, 'address.' + b) : null)
	        || (b ? analytics_jsObjCase(props, b) : null);
	    };
	  }
	};

	var inherits_browser = createCommonjsModule(function (module) {
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}
	});

	/**
	 * toString ref.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */

	var componentType = function(val){
	  switch (toString.call(val)) {
	    case '[object Date]': return 'date';
	    case '[object RegExp]': return 'regexp';
	    case '[object Arguments]': return 'arguments';
	    case '[object Array]': return 'array';
	    case '[object Error]': return 'error';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val !== val) return 'nan';
	  if (val && val.nodeType === 1) return 'element';

	  if (isBuffer(val)) return 'buffer';

	  val = val.valueOf
	    ? val.valueOf()
	    : Object.prototype.valueOf.apply(val);

	  return typeof val;
	};

	// code borrowed from https://github.com/feross/is-buffer/blob/master/index.js
	function isBuffer(obj) {
	  return !!(obj != null &&
	    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
	      (obj.constructor &&
	      typeof obj.constructor.isBuffer === 'function' &&
	      obj.constructor.isBuffer(obj))
	    ))
	}

	/*
	 * Module dependencies.
	 */



	/**
	 * Deeply clone an object.
	 *
	 * @param {*} obj Any object.
	 */

	var clone = function clone(obj) {
	  var t = componentType(obj);

	  if (t === 'object') {
	    var copy = {};
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        copy[key] = clone(obj[key]);
	      }
	    }
	    return copy;
	  }

	  if (t === 'array') {
	    var copy = new Array(obj.length);
	    for (var i = 0, l = obj.length; i < l; i++) {
	      copy[i] = clone(obj[i]);
	    }
	    return copy;
	  }

	  if (t === 'regexp') {
	    // from millermedeiros/amd-utils - MIT
	    var flags = '';
	    flags += obj.multiline ? 'm' : '';
	    flags += obj.global ? 'g' : '';
	    flags += obj.ignoreCase ? 'i' : '';
	    return new RegExp(obj.source, flags);
	  }

	  if (t === 'date') {
	    return new Date(obj.getTime());
	  }

	  // string, number, boolean, etc.
	  return obj;
	};

	/*
	 * Exports.
	 */

	var clone_1 = clone;

	var inherit = inherits_browser;
	var clone$1 = clone_1;
	var type = componentType;

	var utils = {
		inherit: inherit,
		clone: clone$1,
		type: type
	};

	// A few integrations are disabled by default. They must be explicitly enabled
	// by setting options[Provider] = true.
	var disabled = {
	  Salesforce: true,
	};

	/**
	 * Check whether an integration should be enabled by default.
	 *
	 * @ignore
	 * @param {string} integration
	 * @return {boolean}
	 */
	var isEnabled = function (integration) {
	  return !disabled[integration];
	};

	var is_1 = createCommonjsModule(function (module) {
	/* globals window, HTMLElement */
	/**!
	 * is
	 * the definitive JavaScript type testing library
	 *
	 * @copyright 2013-2014 Enrico Marino / Jordan Harband
	 * @license MIT
	 */

	var objProto = Object.prototype;
	var owns = objProto.hasOwnProperty;
	var toStr = objProto.toString;
	var symbolValueOf;
	if (typeof Symbol === 'function') {
	  symbolValueOf = Symbol.prototype.valueOf;
	}
	var isActualNaN = function (value) {
	  return value !== value;
	};
	var NON_HOST_TYPES = {
	  'boolean': 1,
	  number: 1,
	  string: 1,
	  undefined: 1
	};

	var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
	var hexRegex = /^[A-Fa-f0-9]+$/;

	/**
	 * Expose `is`
	 */

	var is = module.exports = {};

	/**
	 * Test general.
	 */

	/**
	 * is.type
	 * Test if `value` is a type of `type`.
	 *
	 * @param {Mixed} value value to test
	 * @param {String} type type
	 * @return {Boolean} true if `value` is a type of `type`, false otherwise
	 * @api public
	 */

	is.a = is.type = function (value, type) {
	  return typeof value === type;
	};

	/**
	 * is.defined
	 * Test if `value` is defined.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if 'value' is defined, false otherwise
	 * @api public
	 */

	is.defined = function (value) {
	  return typeof value !== 'undefined';
	};

	/**
	 * is.empty
	 * Test if `value` is empty.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is empty, false otherwise
	 * @api public
	 */

	is.empty = function (value) {
	  var type = toStr.call(value);
	  var key;

	  if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
	    return value.length === 0;
	  }

	  if (type === '[object Object]') {
	    for (key in value) {
	      if (owns.call(value, key)) { return false; }
	    }
	    return true;
	  }

	  return !value;
	};

	/**
	 * is.equal
	 * Test if `value` is equal to `other`.
	 *
	 * @param {Mixed} value value to test
	 * @param {Mixed} other value to compare with
	 * @return {Boolean} true if `value` is equal to `other`, false otherwise
	 */

	is.equal = function equal(value, other) {
	  if (value === other) {
	    return true;
	  }

	  var type = toStr.call(value);
	  var key;

	  if (type !== toStr.call(other)) {
	    return false;
	  }

	  if (type === '[object Object]') {
	    for (key in value) {
	      if (!is.equal(value[key], other[key]) || !(key in other)) {
	        return false;
	      }
	    }
	    for (key in other) {
	      if (!is.equal(value[key], other[key]) || !(key in value)) {
	        return false;
	      }
	    }
	    return true;
	  }

	  if (type === '[object Array]') {
	    key = value.length;
	    if (key !== other.length) {
	      return false;
	    }
	    while (--key) {
	      if (!is.equal(value[key], other[key])) {
	        return false;
	      }
	    }
	    return true;
	  }

	  if (type === '[object Function]') {
	    return value.prototype === other.prototype;
	  }

	  if (type === '[object Date]') {
	    return value.getTime() === other.getTime();
	  }

	  return false;
	};

	/**
	 * is.hosted
	 * Test if `value` is hosted by `host`.
	 *
	 * @param {Mixed} value to test
	 * @param {Mixed} host host to test with
	 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
	 * @api public
	 */

	is.hosted = function (value, host) {
	  var type = typeof host[value];
	  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
	};

	/**
	 * is.instance
	 * Test if `value` is an instance of `constructor`.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an instance of `constructor`
	 * @api public
	 */

	is.instance = is['instanceof'] = function (value, constructor) {
	  return value instanceof constructor;
	};

	/**
	 * is.nil / is.null
	 * Test if `value` is null.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is null, false otherwise
	 * @api public
	 */

	is.nil = is['null'] = function (value) {
	  return value === null;
	};

	/**
	 * is.undef / is.undefined
	 * Test if `value` is undefined.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is undefined, false otherwise
	 * @api public
	 */

	is.undef = is.undefined = function (value) {
	  return typeof value === 'undefined';
	};

	/**
	 * Test arguments.
	 */

	/**
	 * is.args
	 * Test if `value` is an arguments object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an arguments object, false otherwise
	 * @api public
	 */

	is.args = is.arguments = function (value) {
	  var isStandardArguments = toStr.call(value) === '[object Arguments]';
	  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
	  return isStandardArguments || isOldArguments;
	};

	/**
	 * Test array.
	 */

	/**
	 * is.array
	 * Test if 'value' is an array.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an array, false otherwise
	 * @api public
	 */

	is.array = Array.isArray || function (value) {
	  return toStr.call(value) === '[object Array]';
	};

	/**
	 * is.arguments.empty
	 * Test if `value` is an empty arguments object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
	 * @api public
	 */
	is.args.empty = function (value) {
	  return is.args(value) && value.length === 0;
	};

	/**
	 * is.array.empty
	 * Test if `value` is an empty array.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an empty array, false otherwise
	 * @api public
	 */
	is.array.empty = function (value) {
	  return is.array(value) && value.length === 0;
	};

	/**
	 * is.arraylike
	 * Test if `value` is an arraylike object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an arguments object, false otherwise
	 * @api public
	 */

	is.arraylike = function (value) {
	  return !!value && !is.bool(value)
	    && owns.call(value, 'length')
	    && isFinite(value.length)
	    && is.number(value.length)
	    && value.length >= 0;
	};

	/**
	 * Test boolean.
	 */

	/**
	 * is.bool
	 * Test if `value` is a boolean.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a boolean, false otherwise
	 * @api public
	 */

	is.bool = is['boolean'] = function (value) {
	  return toStr.call(value) === '[object Boolean]';
	};

	/**
	 * is.false
	 * Test if `value` is false.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is false, false otherwise
	 * @api public
	 */

	is['false'] = function (value) {
	  return is.bool(value) && Boolean(Number(value)) === false;
	};

	/**
	 * is.true
	 * Test if `value` is true.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is true, false otherwise
	 * @api public
	 */

	is['true'] = function (value) {
	  return is.bool(value) && Boolean(Number(value)) === true;
	};

	/**
	 * Test date.
	 */

	/**
	 * is.date
	 * Test if `value` is a date.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a date, false otherwise
	 * @api public
	 */

	is.date = function (value) {
	  return toStr.call(value) === '[object Date]';
	};

	/**
	 * Test element.
	 */

	/**
	 * is.element
	 * Test if `value` is an html element.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an HTML Element, false otherwise
	 * @api public
	 */

	is.element = function (value) {
	  return value !== undefined
	    && typeof HTMLElement !== 'undefined'
	    && value instanceof HTMLElement
	    && value.nodeType === 1;
	};

	/**
	 * Test error.
	 */

	/**
	 * is.error
	 * Test if `value` is an error object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an error object, false otherwise
	 * @api public
	 */

	is.error = function (value) {
	  return toStr.call(value) === '[object Error]';
	};

	/**
	 * Test function.
	 */

	/**
	 * is.fn / is.function (deprecated)
	 * Test if `value` is a function.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a function, false otherwise
	 * @api public
	 */

	is.fn = is['function'] = function (value) {
	  var isAlert = typeof window !== 'undefined' && value === window.alert;
	  return isAlert || toStr.call(value) === '[object Function]';
	};

	/**
	 * Test number.
	 */

	/**
	 * is.number
	 * Test if `value` is a number.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a number, false otherwise
	 * @api public
	 */

	is.number = function (value) {
	  return toStr.call(value) === '[object Number]';
	};

	/**
	 * is.infinite
	 * Test if `value` is positive or negative infinity.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
	 * @api public
	 */
	is.infinite = function (value) {
	  return value === Infinity || value === -Infinity;
	};

	/**
	 * is.decimal
	 * Test if `value` is a decimal number.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a decimal number, false otherwise
	 * @api public
	 */

	is.decimal = function (value) {
	  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
	};

	/**
	 * is.divisibleBy
	 * Test if `value` is divisible by `n`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} n dividend
	 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
	 * @api public
	 */

	is.divisibleBy = function (value, n) {
	  var isDividendInfinite = is.infinite(value);
	  var isDivisorInfinite = is.infinite(n);
	  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
	  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
	};

	/**
	 * is.integer
	 * Test if `value` is an integer.
	 *
	 * @param value to test
	 * @return {Boolean} true if `value` is an integer, false otherwise
	 * @api public
	 */

	is.integer = is['int'] = function (value) {
	  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
	};

	/**
	 * is.maximum
	 * Test if `value` is greater than 'others' values.
	 *
	 * @param {Number} value value to test
	 * @param {Array} others values to compare with
	 * @return {Boolean} true if `value` is greater than `others` values
	 * @api public
	 */

	is.maximum = function (value, others) {
	  if (isActualNaN(value)) {
	    throw new TypeError('NaN is not a valid value');
	  } else if (!is.arraylike(others)) {
	    throw new TypeError('second argument must be array-like');
	  }
	  var len = others.length;

	  while (--len >= 0) {
	    if (value < others[len]) {
	      return false;
	    }
	  }

	  return true;
	};

	/**
	 * is.minimum
	 * Test if `value` is less than `others` values.
	 *
	 * @param {Number} value value to test
	 * @param {Array} others values to compare with
	 * @return {Boolean} true if `value` is less than `others` values
	 * @api public
	 */

	is.minimum = function (value, others) {
	  if (isActualNaN(value)) {
	    throw new TypeError('NaN is not a valid value');
	  } else if (!is.arraylike(others)) {
	    throw new TypeError('second argument must be array-like');
	  }
	  var len = others.length;

	  while (--len >= 0) {
	    if (value > others[len]) {
	      return false;
	    }
	  }

	  return true;
	};

	/**
	 * is.nan
	 * Test if `value` is not a number.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is not a number, false otherwise
	 * @api public
	 */

	is.nan = function (value) {
	  return !is.number(value) || value !== value;
	};

	/**
	 * is.even
	 * Test if `value` is an even number.
	 *
	 * @param {Number} value value to test
	 * @return {Boolean} true if `value` is an even number, false otherwise
	 * @api public
	 */

	is.even = function (value) {
	  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
	};

	/**
	 * is.odd
	 * Test if `value` is an odd number.
	 *
	 * @param {Number} value value to test
	 * @return {Boolean} true if `value` is an odd number, false otherwise
	 * @api public
	 */

	is.odd = function (value) {
	  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
	};

	/**
	 * is.ge
	 * Test if `value` is greater than or equal to `other`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} other value to compare with
	 * @return {Boolean}
	 * @api public
	 */

	is.ge = function (value, other) {
	  if (isActualNaN(value) || isActualNaN(other)) {
	    throw new TypeError('NaN is not a valid value');
	  }
	  return !is.infinite(value) && !is.infinite(other) && value >= other;
	};

	/**
	 * is.gt
	 * Test if `value` is greater than `other`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} other value to compare with
	 * @return {Boolean}
	 * @api public
	 */

	is.gt = function (value, other) {
	  if (isActualNaN(value) || isActualNaN(other)) {
	    throw new TypeError('NaN is not a valid value');
	  }
	  return !is.infinite(value) && !is.infinite(other) && value > other;
	};

	/**
	 * is.le
	 * Test if `value` is less than or equal to `other`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} other value to compare with
	 * @return {Boolean} if 'value' is less than or equal to 'other'
	 * @api public
	 */

	is.le = function (value, other) {
	  if (isActualNaN(value) || isActualNaN(other)) {
	    throw new TypeError('NaN is not a valid value');
	  }
	  return !is.infinite(value) && !is.infinite(other) && value <= other;
	};

	/**
	 * is.lt
	 * Test if `value` is less than `other`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} other value to compare with
	 * @return {Boolean} if `value` is less than `other`
	 * @api public
	 */

	is.lt = function (value, other) {
	  if (isActualNaN(value) || isActualNaN(other)) {
	    throw new TypeError('NaN is not a valid value');
	  }
	  return !is.infinite(value) && !is.infinite(other) && value < other;
	};

	/**
	 * is.within
	 * Test if `value` is within `start` and `finish`.
	 *
	 * @param {Number} value value to test
	 * @param {Number} start lower bound
	 * @param {Number} finish upper bound
	 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
	 * @api public
	 */
	is.within = function (value, start, finish) {
	  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
	    throw new TypeError('NaN is not a valid value');
	  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
	    throw new TypeError('all arguments must be numbers');
	  }
	  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
	  return isAnyInfinite || (value >= start && value <= finish);
	};

	/**
	 * Test object.
	 */

	/**
	 * is.object
	 * Test if `value` is an object.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is an object, false otherwise
	 * @api public
	 */

	is.object = function (value) {
	  return toStr.call(value) === '[object Object]';
	};

	/**
	 * is.hash
	 * Test if `value` is a hash - a plain object literal.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a hash, false otherwise
	 * @api public
	 */

	is.hash = function (value) {
	  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
	};

	/**
	 * Test regexp.
	 */

	/**
	 * is.regexp
	 * Test if `value` is a regular expression.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a regexp, false otherwise
	 * @api public
	 */

	is.regexp = function (value) {
	  return toStr.call(value) === '[object RegExp]';
	};

	/**
	 * Test string.
	 */

	/**
	 * is.string
	 * Test if `value` is a string.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if 'value' is a string, false otherwise
	 * @api public
	 */

	is.string = function (value) {
	  return toStr.call(value) === '[object String]';
	};

	/**
	 * Test base64 string.
	 */

	/**
	 * is.base64
	 * Test if `value` is a valid base64 encoded string.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
	 * @api public
	 */

	is.base64 = function (value) {
	  return is.string(value) && (!value.length || base64Regex.test(value));
	};

	/**
	 * Test base64 string.
	 */

	/**
	 * is.hex
	 * Test if `value` is a valid hex encoded string.
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
	 * @api public
	 */

	is.hex = function (value) {
	  return is.string(value) && (!value.length || hexRegex.test(value));
	};

	/**
	 * is.symbol
	 * Test if `value` is an ES6 Symbol
	 *
	 * @param {Mixed} value value to test
	 * @return {Boolean} true if `value` is a Symbol, false otherise
	 * @api public
	 */

	is.symbol = function (value) {
	  return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
	};
	});

	/**
	 * Matcher, slightly modified from:
	 *
	 * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
	 */

	var matcher = /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;

	/**
	 * Convert an ISO date string to a date. Fallback to native `Date.parse`.
	 *
	 * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
	 *
	 * @param {String} iso
	 * @return {Date}
	 */

	var parse = function(iso) {
	  var numericKeys = [1, 5, 6, 7, 11, 12];
	  var arr = matcher.exec(iso);
	  var offset = 0;

	  // fallback to native parsing
	  if (!arr) {
	    return new Date(iso);
	  }

	  /* eslint-disable no-cond-assign */
	  // remove undefined values
	  for (var i = 0, val; val = numericKeys[i]; i++) {
	    arr[val] = parseInt(arr[val], 10) || 0;
	  }
	  /* eslint-enable no-cond-assign */

	  // allow undefined days and months
	  arr[2] = parseInt(arr[2], 10) || 1;
	  arr[3] = parseInt(arr[3], 10) || 1;

	  // month is 0-11
	  arr[2]--;

	  // allow abitrary sub-second precision
	  arr[8] = arr[8] ? (arr[8] + '00').substring(0, 3) : 0;

	  // apply timezone if one exists
	  if (arr[4] === ' ') {
	    offset = new Date().getTimezoneOffset();
	  } else if (arr[9] !== 'Z' && arr[10]) {
	    offset = arr[11] * 60 + arr[12];
	    if (arr[10] === '+') {
	      offset = 0 - offset;
	    }
	  }

	  var millis = Date.UTC(arr[1], arr[2], arr[3], arr[5], arr[6] + offset, arr[7], arr[8]);
	  return new Date(millis);
	};


	/**
	 * Checks whether a `string` is an ISO date string. `strict` mode requires that
	 * the date string at least have a year, month and date.
	 *
	 * @param {String} string
	 * @param {Boolean} strict
	 * @return {Boolean}
	 */

	var is = function(string, strict) {
	  if (strict && (/^\d{4}-\d{2}-\d{2}/).test(string) === false) {
	    return false;
	  }
	  return matcher.test(string);
	};

	var lib = {
		parse: parse,
		is: is
	};

	/**
	 * Matcher.
	 */

	var matcher$1 = /\d{13}/;


	/**
	 * Check whether a string is a millisecond date string.
	 *
	 * @param {string} string
	 * @return {boolean}
	 */
	var is$1 = function(string) {
	  return matcher$1.test(string);
	};


	/**
	 * Convert a millisecond string to a date.
	 *
	 * @param {string} millis
	 * @return {Date}
	 */
	var parse$1 = function(millis) {
	  millis = parseInt(millis, 10);
	  return new Date(millis);
	};

	var milliseconds = {
		is: is$1,
		parse: parse$1
	};

	/**
	 * Matcher.
	 */

	var matcher$2 = /\d{10}/;


	/**
	 * Check whether a string is a second date string.
	 *
	 * @param {string} string
	 * @return {Boolean}
	 */
	var is$2 = function(string) {
	  return matcher$2.test(string);
	};


	/**
	 * Convert a second string to a date.
	 *
	 * @param {string} seconds
	 * @return {Date}
	 */
	var parse$2 = function(seconds) {
	  var millis = parseInt(seconds, 10) * 1000;
	  return new Date(millis);
	};

	var seconds = {
		is: is$2,
		parse: parse$2
	};

	/**
	 * Returns a new Javascript Date object, allowing a variety of extra input types
	 * over the native Date constructor.
	 *
	 * @param {Date|string|number} val
	 */
	var lib$1 = function newDate(val) {
	  if (is_1.date(val)) return val;
	  if (is_1.number(val)) return new Date(toMs(val));

	  // date strings
	  if (lib.is(val)) {
	    return lib.parse(val);
	  }
	  if (milliseconds.is(val)) {
	    return milliseconds.parse(val);
	  }
	  if (seconds.is(val)) {
	    return seconds.parse(val);
	  }

	  // fallback to Date.parse
	  return new Date(val);
	};


	/**
	 * If the number passed val is seconds from the epoch, turn it into milliseconds.
	 * Milliseconds would be greater than 31557600000 (December 31, 1970).
	 *
	 * @param {number} num
	 */
	function toMs(num) {
	  if (num < 31557600000) return num * 1000;
	  return num;
	}

	/**
	 * Matcher, slightly modified from:
	 *
	 * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
	 */

	var matcher$3 = /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;

	/**
	 * Convert an ISO date string to a date. Fallback to native `Date.parse`.
	 *
	 * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
	 *
	 * @param {String} iso
	 * @return {Date}
	 */

	var parse$3 = function(iso) {
	  var numericKeys = [1, 5, 6, 7, 11, 12];
	  var arr = matcher$3.exec(iso);
	  var offset = 0;

	  // fallback to native parsing
	  if (!arr) {
	    return new Date(iso);
	  }

	  /* eslint-disable no-cond-assign */
	  // remove undefined values
	  for (var i = 0, val; val = numericKeys[i]; i++) {
	    arr[val] = parseInt(arr[val], 10) || 0;
	  }
	  /* eslint-enable no-cond-assign */

	  // allow undefined days and months
	  arr[2] = parseInt(arr[2], 10) || 1;
	  arr[3] = parseInt(arr[3], 10) || 1;

	  // month is 0-11
	  arr[2]--;

	  // allow abitrary sub-second precision
	  arr[8] = arr[8] ? (arr[8] + '00').substring(0, 3) : 0;

	  // apply timezone if one exists
	  if (arr[4] === ' ') {
	    offset = new Date().getTimezoneOffset();
	  } else if (arr[9] !== 'Z' && arr[10]) {
	    offset = arr[11] * 60 + arr[12];
	    if (arr[10] === '+') {
	      offset = 0 - offset;
	    }
	  }

	  var millis = Date.UTC(arr[1], arr[2], arr[3], arr[5], arr[6] + offset, arr[7], arr[8]);
	  return new Date(millis);
	};


	/**
	 * Checks whether a `string` is an ISO date string. `strict` mode requires that
	 * the date string at least have a year, month and date.
	 *
	 * @param {String} string
	 * @param {Boolean} strict
	 * @return {Boolean}
	 */

	var is$3 = function(string, strict) {
	  if (typeof string !== 'string') {
	    return false;
	  }
	  if (strict && (/^\d{4}-\d{2}-\d{2}/).test(string) === false) {
	    return false;
	  }
	  return matcher$3.test(string);
	};

	var lib$2 = {
		parse: parse$3,
		is: is$3
	};

	/**
	 * Expose `traverse`.
	 */
	var lib$3 = traverse;

	/**
	 * Recursively traverse an object or array, and convert
	 * all ISO date strings parse into Date objects.
	 *
	 * @param {Object} input - object, array, or string to convert
	 * @param {Boolean} strict - only convert strings with year, month, and date
	 * @return {Object}
	 */
	function traverse(input, strict) {
	  if (strict === undefined) strict = true;
	  if (componentType(input) === 'object') {
	    return traverseObject(input, strict);
	  } else if (componentType(input) === 'array') {
	    return traverseArray(input, strict);
	  } else if (lib$2.is(input, strict)) {
	    return lib$2.parse(input);
	  }
	  return input;
	}

	/**
	 * Object traverser helper function.
	 *
	 * @param {Object} obj - object to traverse
	 * @param {Boolean} strict - only convert strings with year, month, and date
	 * @return {Object}
	 */
	function traverseObject(obj, strict) {
	  Object.keys(obj).forEach(function(key) {
	    obj[key] = traverse(obj[key], strict);
	  });
	  return obj;
	}

	/**
	 * Array traverser helper function
	 *
	 * @param {Array} arr - array to traverse
	 * @param {Boolean} strict - only convert strings with year, month, and date
	 * @return {Array}
	 */
	function traverseArray(arr, strict) {
	  arr.forEach(function(value, index) {
	    arr[index] = traverse(value, strict);
	  });
	  return arr;
	}

	var clone$2 = utils.clone;




	var type$1 = utils.type;

	/**
	 * A *Facade* is an object meant for creating convience wrappers around
	 * objects. When developing integrations, you probably want to look at its
	 * subclasses, such as {@link Track} or {@link Identify}, rather than this
	 * general-purpose class.
	 *
	 * This constructor will initialize a new `Facade` with an `obj` of arguments.
	 *
	 * If the inputted `obj` doesn't have a `timestamp` property, one will be added
	 * with the value `new Date()`. Otherwise, the `timestamp` property will be
	 * converted to a Date using the `new-date` package.
	 *
	 * By default, the inputted object will be defensively copied, and all ISO
	 * strings present in the string will be converted into Dates.
	 *
	 * @param {Object} obj - The object to wrap.
	 * @param {Object} opts - Options about what kind of Facade to create.
	 * @param {boolean} [opts.clone=true] - Whether to make defensive clones. If enabled,
	 * the inputted object will be cloned, and any objects derived from this facade
	 * will be cloned before being returned.
	 * @param {boolean} [opts.traverse=true] - Whether to perform ISODate-Traverse
	 * on the inputted object.
	 *
	 * @see {@link https://github.com/segmentio/new-date|new-date}
	 * @see {@link https://github.com/segmentio/isodate-traverse|isodate-traverse}
	 */
	function Facade(obj, opts) {
	  opts = opts || {};
	  if (!('clone' in opts)) opts.clone = true;
	  if (opts.clone) obj = clone$2(obj);
	  if (!('traverse' in opts)) opts.traverse = true;
	  if (!('timestamp' in obj)) obj.timestamp = new Date();
	  else obj.timestamp = lib$1(obj.timestamp);
	  if (opts.traverse) lib$3(obj);
	  this.opts = opts;
	  this.obj = obj;
	}

	/**
	 * Get a potentially-nested field in this facade. `field` should be a
	 * period-separated sequence of properties.
	 *
	 * If the first field passed in points to a function (e.g. the `field` passed
	 * in is `a.b.c` and this facade's `obj.a` is a function), then that function
	 * will be called, and then the deeper fields will be fetched (using obj-case)
	 * from what that function returns. If the first field isn't a function, then
	 * this function works just like obj-case.
	 *
	 * Because this function uses obj-case, the camel- or snake-case of the input
	 * is irrelevant.
	 *
	 * @example
	 * YourClass.prototype.height = function() {
	 *   return this.proxy('getDimensions.height') ||
	 *     this.proxy('props.size.side_length');
	 * }
	 * @param {string} field - A sequence of properties, joined by periods (`.`).
	 * @return {*} - A property of the inputted object.
	 * @see {@link https://github.com/segmentio/obj-case|obj-case}
	 */
	Facade.prototype.proxy = function (field) {
	  var fields = field.split('.');
	  field = fields.shift();

	  // Call a function at the beginning to take advantage of facaded fields
	  var obj = this[field] || this.field(field);
	  if (!obj) return obj;
	  if (typeof obj === 'function') obj = obj.call(this) || {};
	  if (fields.length === 0) return this.opts.clone ? transform(obj) : obj;

	  obj = analytics_jsObjCase(obj, fields.join('.'));
	  return this.opts.clone ? transform(obj) : obj;
	};

	/**
	 * Directly access a specific `field` from the underlying object. Only
	 * "top-level" fields will work with this function. "Nested" fields *will not
	 * work* with this function.
	 *
	 * @param {string} field
	 * @return {*}
	 */
	Facade.prototype.field = function (field) {
	  var obj = this.obj[field];
	  return this.opts.clone ? transform(obj) : obj;
	};

	/**
	 * Utility method to always proxy a particular `field`. In other words, it
	 * returns a function that will always return `this.proxy(field)`.
	 *
	 * @example
	 * MyClass.prototype.height = Facade.proxy('options.dimensions.height');
	 *
	 * @param {string} field
	 * @return {Function}
	 */
	Facade.proxy = function (field) {
	  return function () {
	    return this.proxy(field);
	  };
	};

	/**
	 * Utility method to always access a `field`. In other words, it returns a
	 * function that will always return `this.field(field)`.
	 *
	 * @param {string} field
	 * @return {Function}
	 */
	Facade.field = function (field) {
	  return function () {
	    return this.field(field);
	  };
	};

	/**
	 * Create a helper function for fetching a "plural" thing.
	 *
	 * The generated method will take the inputted `path` and append an "s" to it
	 * and calls `this.proxy` with this "pluralized" path. If that produces an
	 * array, that will be returned. Otherwise, a one-element array containing
	 * `this.proxy(path)` will be returned.
	 *
	 * @example
	 * MyClass.prototype.birds = Facade.multi('animals.bird');
	 *
	 * @param {string} path
	 * @return {Function}
	 */
	Facade.multi = function (path) {
	  return function () {
	    var multi = this.proxy(path + 's');
	    if (type$1(multi) === 'array') return multi;
	    var one = this.proxy(path);
	    if (one) one = [this.opts.clone ? clone$2(one) : one];
	    return one || [];
	  };
	};

	/**
	 * Create a helper function for getting a "singular" thing.
	 *
	 * The generated method will take the inputted path and call
	 * `this.proxy(path)`. If a truthy thing is produced, it will be returned.
	 * Otherwise, `this.proxy(path + 's')` will be called, and if that produces an
	 * array the first element of that array will be returned. Otherwise,
	 * `undefined` is returned.
	 *
	 * @example
	 * MyClass.prototype.bird = Facade.one('animals.bird');
	 *
	 * @param {string} path
	 * @return {Function}
	 */
	Facade.one = function (path) {
	  return function () {
	    var one = this.proxy(path);
	    if (one) return one;
	    var multi = this.proxy(path + 's');
	    if (type$1(multi) === 'array') return multi[0];
	  };
	};

	/**
	 * Gets the underlying object this facade wraps around.
	 *
	 * If this facade has a property `type`, it will be invoked as a function and
	 * will be assigned as the property `type` of the outputted object.
	 *
	 * @return {Object}
	 */
	Facade.prototype.json = function () {
	  var ret = this.opts.clone ? clone$2(this.obj) : this.obj;
	  if (this.type) ret.type = this.type();
	  return ret;
	};

	/**
	 * Get the options of a call. If an integration is passed, only the options for
	 * that integration are included. If the integration is not enabled, then
	 * `undefined` is returned.
	 *
	 * Options are taken from the `options` property of the underlying object,
	 * falling back to the object's `context` or simply `{}`.
	 *
	 * @param {string} integration - The name of the integration to get settings
	 * for. Casing does not matter.
	 * @return {Object|undefined}
	 */
	Facade.prototype.options = function (integration) {
	  var obj = this.obj.options || this.obj.context || {};
	  var options = this.opts.clone ? clone$2(obj) : obj;
	  if (!integration) return options;
	  if (!this.enabled(integration)) return;
	  var integrations = this.integrations();
	  var value = integrations[integration] || analytics_jsObjCase(integrations, integration);
	  if (typeof value !== 'object') value = analytics_jsObjCase(this.options(), integration);
	  return typeof value === 'object' ? value : {};
	};

	/**
	 * An alias for {@link Facade#options}.
	 */
	Facade.prototype.context = Facade.prototype.options;

	/**
	 * Check whether an integration is enabled.
	 *
	 * Basically, this method checks whether this integration is explicitly
	 * enabled. If it isn'texplicitly mentioned, it checks whether it has been
	 * enabled at the global level. Some integrations (e.g. Salesforce), cannot
	 * enabled by these global event settings.
	 *
	 * More concretely, the deciding factors here are:
	 *
	 * 1. If `this.integrations()` has the integration set to `true`, return `true`.
	 * 2. If `this.integrations().providers` has the integration set to `true`, return `true`.
	 * 3. If integrations are set to default-disabled via global parameters (i.e.
	 * `options.providers.all`, `options.all`, or `integrations.all`), then return
	 * false.
	 * 4. If the integration is one of the special default-deny integrations
	 * (currently, only Salesforce), then return false.
	 * 5. Else, return true.
	 *
	 * @param {string} integration
	 * @return {boolean}
	 */
	Facade.prototype.enabled = function (integration) {
	  var allEnabled = this.proxy('options.providers.all');
	  if (typeof allEnabled !== 'boolean') allEnabled = this.proxy('options.all');
	  if (typeof allEnabled !== 'boolean') allEnabled = this.proxy('integrations.all');
	  if (typeof allEnabled !== 'boolean') allEnabled = true;

	  var enabled = allEnabled && isEnabled(integration);
	  var options = this.integrations();

	  // If the integration is explicitly enabled or disabled, use that
	  // First, check options.providers for backwards compatibility
	  if (options.providers && options.providers.hasOwnProperty(integration)) { // eslint-disable-line no-prototype-builtins
	    enabled = options.providers[integration];
	  }

	  // Next, check for the integration's existence in 'options' to enable it.
	  // If the settings are a boolean, use that, otherwise it should be enabled.
	  if (options.hasOwnProperty(integration)) { // eslint-disable-line no-prototype-builtins
	    var settings = options[integration];
	    if (typeof settings === 'boolean') {
	      enabled = settings;
	    } else {
	      enabled = true;
	    }
	  }

	  return !!enabled;
	};

	/**
	 * Get all `integration` options.
	 *
	 * @ignore
	 * @param {string} integration
	 * @return {Object}
	 */
	Facade.prototype.integrations = function () {
	  return this.obj.integrations || this.proxy('options.providers') || this.options();
	};

	/**
	 * Check whether the user is active.
	 *
	 * @return {boolean}
	 */
	Facade.prototype.active = function () {
	  var active = this.proxy('options.active');
	  if (active === null || active === undefined) active = true;
	  return active;
	};

	/**
	 * Get `sessionId / anonymousId`.
	 *
	 * @return {*}
	 */
	Facade.prototype.anonymousId = function () {
	  return this.field('anonymousId') || this.field('sessionId');
	};

	/**
	 * An alias for {@link Facade#anonymousId}.
	 *
	 * @function
	 * @return {string}
	 */
	Facade.prototype.sessionId = Facade.prototype.anonymousId;

	/**
	 * Get `groupId` from `context.groupId`.
	 *
	 * @function
	 * @return {string}
	 */
	Facade.prototype.groupId = Facade.proxy('options.groupId');

	/**
	 * Get the call's "traits". All event types can pass in traits, though {@link
	 * Identify} and {@link Group} override this implementation.
	 *
	 * Traits are gotten from `options.traits`, augmented with a property `id` with
	 * the event's `userId`.
	 *
	 * The parameter `aliases` is meant to transform keys in `options.traits` into
	 * new keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx`
	 * in the traits, and move it to `yyy`. If `xxx` is a method of this facade,
	 * it'll be called as a function instead of treated as a key into the traits.
	 *
	 * @example
	 * var obj = { options: { traits: { foo: "bar" } }, anonymousId: "xxx" }
	 * var facade = new Facade(obj)
	 *
	 * facade.traits() // { "foo": "bar" }
	 * facade.traits({ "foo": "asdf" }) // { "asdf": "bar" }
	 * facade.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
	 *
	 * @param {Object} aliases - A mapping from keys to the new keys they should be
	 * transformed to.
	 * @return {Object}
	 */
	Facade.prototype.traits = function (aliases) {
	  var ret = this.proxy('options.traits') || {};
	  var id = this.userId();
	  aliases = aliases || {};

	  if (id) ret.id = id;

	  for (var alias in aliases) { // eslint-disable-line no-restricted-syntax, guard-for-in
	    var value = this[alias] == null ? this.proxy('options.traits.' + alias) : this[alias]();
	    if (value == null) continue;
	    ret[aliases[alias]] = value;
	    delete ret[alias];
	  }

	  return ret;
	};

	/**
	 * The library and version of the client used to produce the message.
	 *
	 * If the library name cannot be determined, it is set to `"unknown"`. If the
	 * version cannot be determined, it is set to `null`.
	 *
	 * @return {{name: string, version: string}}
	 */
	Facade.prototype.library = function () {
	  var library = this.proxy('options.library');
	  if (!library) return { name: 'unknown', version: null };
	  if (typeof library === 'string') return { name: library, version: null };
	  return library;
	};

	/**
	 * Return the device information, falling back to an empty object.
	 *
	 * Interesting values of `type` are `"ios"` and `"android"`, but other values
	 * are possible if the client is doing something unusual with `context.device`.
	 *
	 * @return {{type: string}}
	 */
	Facade.prototype.device = function () {
	  var device = this.proxy('context.device');
	  if (type$1(device) !== 'object') device = {};
	  var library = this.library().name;
	  if (device.type) return device;

	  if (library.indexOf('ios') > -1) device.type = 'ios';
	  if (library.indexOf('android') > -1) device.type = 'android';
	  return device;
	};

	/**
	 * Get the User-Agent from `context.userAgent`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return string
	 */
	Facade.prototype.userAgent = Facade.proxy('context.userAgent');

	/**
	 * Get the timezone from `context.timezone`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return string
	 */
	Facade.prototype.timezone = Facade.proxy('context.timezone');

	/**
	 * Get the timestamp from `context.timestamp`.
	 *
	 * @function
	 * @return string
	 */
	Facade.prototype.timestamp = Facade.field('timestamp');

	/**
	 * Get the channel from `channel`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return string
	 */
	Facade.prototype.channel = Facade.field('channel');

	/**
	 * Get the IP address from `context.ip`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return string
	 */
	Facade.prototype.ip = Facade.proxy('context.ip');

	/**
	 * Get the user ID from `userId`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return string
	 */
	Facade.prototype.userId = Facade.field('userId');

	/**
	 * Get the region from `traits`, `traits.address`, `properties`, or
	 * `properties.address`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @name region
	 * @function
	 * @memberof Facade.prototype
	 * @return {string}
	 */

	address(Facade.prototype);

	/**
	 * Return the cloned and traversed object
	 *
	 * @ignore
	 * @param {*} obj
	 * @return {*}
	 */
	function transform(obj) {
	  return clone$2(obj);
	}

	var facade = Facade;

	var inherit$1 = utils.inherit;


	/**
	 * Initialize a new `Alias` facade with a `dictionary` of arguments.
	 *
	 * @param {Object} dictionary - The object to wrap.
	 * @param {string} [dictionary.from] - The previous ID of the user.
	 * @param {string} [dictionary.to] - The new ID of the user.
	 * @param {Object} opts - Options about what kind of Facade to create.
	 *
	 * @augments Facade
	 */
	function Alias(dictionary, opts) {
	  facade.call(this, dictionary, opts);
	}

	inherit$1(Alias, facade);

	/**
	 * Return the type of facade this is. This will always return `"alias"`.
	 *
	 * @return {string}
	 */
	Alias.prototype.action = function () {
	  return 'alias';
	};

	/**
	 * An alias for {@link Alias#action}.
	 *
	 * @function
	 * @return {string}
	 */
	Alias.prototype.type = Alias.prototype.action;

	/**
	 * Get the user's previous ID from `previousId` or `from`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Alias.prototype.previousId = function () {
	  return this.field('previousId') || this.field('from');
	};

	/**
	 * An alias for {@link Alias#previousId}.
	 *
	 * @function
	 * @return {string}
	 */
	Alias.prototype.from = Alias.prototype.previousId;

	/**
	 * Get the user's new ID from `userId` or `to`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Alias.prototype.userId = function () {
	  return this.field('userId') || this.field('to');
	};

	/**
	 * An alias for {@link Alias#userId}.
	 *
	 * @function
	 * @return {string}
	 */
	Alias.prototype.to = Alias.prototype.userId;

	var alias = Alias;

	var isEmail = function isEmail (string) {
	    return (/.+\@.+\..+/).test(string);
	};

	var inherit$2 = utils.inherit;




	/**
	 * Initialize a new `Group` facade with a `dictionary` of arguments.
	 *
	 * @param {Object} dictionary - The object to wrap.
	 * @param {string} [dictionary.userId] - The user to add to the group.
	 * @param {string} [dictionary.groupId] - The ID of the group.
	 * @param {Object} [dictionary.traits] - The traits of the group.
	 * @param {Object} opts - Options about what kind of Facade to create.
	 *
	 * @augments Facade
	 */
	function Group(dictionary, opts) {
	  facade.call(this, dictionary, opts);
	}

	inherit$2(Group, facade);

	/**
	 * Return the type of facade this is. This will always return `"group"`.
	 *
	 * @return {string}
	 */
	Group.prototype.action = function () {
	  return 'group';
	};

	/**
	 * An alias for {@link Group#action}.
	 *
	 * @function
	 * @return {string}
	 */
	Group.prototype.type = Group.prototype.action;

	/**
	 * Get the group ID from `groupId`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Group.prototype.groupId = facade.field('groupId');

	/**
	 * Get the time of creation of the group from `traits.createdAt`,
	 * `traits.created`, `properties.createdAt`, or `properties.created`.
	 *
	 * @return {Date}
	 */
	Group.prototype.created = function () {
	  var created = this.proxy('traits.createdAt')
	    || this.proxy('traits.created')
	    || this.proxy('properties.createdAt')
	    || this.proxy('properties.created');

	  if (created) return lib$1(created);
	};

	/**
	 * Get the group's email from `traits.email`, falling back to `groupId` only if
	 * it looks like a valid email.
	 *
	 * @return {string}
	 */
	Group.prototype.email = function () {
	  var email = this.proxy('traits.email');
	  if (email) return email;
	  var groupId = this.groupId();
	  if (isEmail(groupId)) return groupId;
	};

	/**
	 * Get the group's traits. This is identical to how {@link Facade#traits}
	 * works, except it looks at `traits.*` instead of `options.traits.*`.
	 *
	 * Traits are gotten from `traits`, augmented with a property `id` with
	 * the event's `groupId`.
	 *
	 * The parameter `aliases` is meant to transform keys in `traits` into new
	 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
	 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
	 * be called as a function instead of treated as a key into the traits.
	 *
	 * @example
	 * var obj = { traits: { foo: "bar" }, anonymousId: "xxx" }
	 * var group = new Group(obj)
	 *
	 * group.traits() // { "foo": "bar" }
	 * group.traits({ "foo": "asdf" }) // { "asdf": "bar" }
	 * group.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
	 *
	 * @param {Object} aliases - A mapping from keys to the new keys they should be
	 * transformed to.
	 * @return {Object}
	 */
	Group.prototype.traits = function (aliases) {
	  var ret = this.properties();
	  var id = this.groupId();
	  aliases = aliases || {};

	  if (id) ret.id = id;

	  for (var alias in aliases) { // eslint-disable-line no-restricted-syntax, guard-for-in
	    var value = this[alias] == null ? this.proxy('traits.' + alias) : this[alias]();
	    if (value == null) continue;
	    ret[aliases[alias]] = value;
	    delete ret[alias];
	  }

	  return ret;
	};

	/**
	 * Get the group's name from `traits.name`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {string}
	 */
	Group.prototype.name = facade.proxy('traits.name');

	/**
	 * Get the group's properties from `traits` or `properties`, falling back to
	 * simply an empty object.
	 *
	 * @return {Object}
	 */
	Group.prototype.properties = function () {
	  // TODO remove this function
	  return this.field('traits') || this.field('properties') || {};
	};

	var group = Group;

	var trim_1 = createCommonjsModule(function (module, exports) {
	exports = module.exports = trim;

	function trim(str){
	  return str.replace(/^\s*|\s*$/g, '');
	}

	exports.left = function(str){
	  return str.replace(/^\s*/, '');
	};

	exports.right = function(str){
	  return str.replace(/\s*$/, '');
	};
	});
	var trim_2 = trim_1.left;
	var trim_3 = trim_1.right;

	var inherit$3 = utils.inherit;




	/**
	 * Initialize a new `Identify` facade with a `dictionary` of arguments.
	 *
	 * @param {Object} dictionary - The object to wrap.
	 * @param {string} [dictionary.userId] - The ID of the user.
	 * @param {string} [dictionary.anonymousId] - The anonymous ID of the user.
	 * @param {string} [dictionary.traits] - The user's traits.
	 * @param {Object} opts - Options about what kind of Facade to create.
	 *
	 * @augments Facade
	 */
	function Identify(dictionary, opts) {
	  facade.call(this, dictionary, opts);
	}

	inherit$3(Identify, facade);

	/**
	 * Return the type of facade this is. This will always return `"identify"`.
	 *
	 * @return {string}
	 */
	Identify.prototype.action = function () {
	  return 'identify';
	};

	/**
	 * An alias for {@link Identify#action}.
	 *
	 * @function
	 * @return {string}
	 */
	Identify.prototype.type = Identify.prototype.action;

	/**
	 * Get the user's traits. This is identical to how {@link Facade#traits} works,
	 * except it looks at `traits.*` instead of `options.traits.*`.
	 *
	 * Traits are gotten from `traits`, augmented with a property `id` with
	 * the event's `userId`.
	 *
	 * The parameter `aliases` is meant to transform keys in `traits` into new
	 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
	 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
	 * be called as a function instead of treated as a key into the traits.
	 *
	 * @example
	 * var obj = { traits: { foo: "bar" }, anonymousId: "xxx" }
	 * var identify = new Identify(obj)
	 *
	 * identify.traits() // { "foo": "bar" }
	 * identify.traits({ "foo": "asdf" }) // { "asdf": "bar" }
	 * identify.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
	 *
	 * @param {Object} aliases - A mapping from keys to the new keys they should be
	 * transformed to.
	 * @return {Object}
	 */
	Identify.prototype.traits = function (aliases) {
	  var ret = this.field('traits') || {};
	  var id = this.userId();
	  aliases = aliases || {};

	  if (id) ret.id = id;

	  for (var alias in aliases) { // eslint-disable-line no-restricted-syntax, guard-for-in
	    var value = this[alias] == null ? this.proxy('traits.' + alias) : this[alias]();
	    if (value == null) continue;
	    ret[aliases[alias]] = value;
	    if (alias !== aliases[alias]) delete ret[alias];
	  }

	  return ret;
	};

	/**
	 * Get the user's email from `traits.email`, falling back to `userId` only if
	 * it looks like a valid email.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Identify.prototype.email = function () {
	  var email = this.proxy('traits.email');
	  if (email) return email;

	  var userId = this.userId();
	  if (isEmail(userId)) return userId;
	};

	/**
	 * Get the time of creation of the user from `traits.created` or
	 * `traits.createdAt`.
	 *
	 * @return {Date}
	 */
	Identify.prototype.created = function () {
	  var created = this.proxy('traits.created') || this.proxy('traits.createdAt');
	  if (created) return lib$1(created);
	};

	/**
	 * Get the user's name `traits.name`, falling back to combining {@link
	 * Identify#firstName} and {@link Identify#lastName} if possible.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Identify.prototype.name = function () {
	  var name = this.proxy('traits.name');
	  if (typeof name === 'string') {
	    return trim_1(name);
	  }
	};

	/**
	 * Get the user's "unique id" from `userId`, `traits.username`, or
	 * `traits.email`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Identify.prototype.uid = function () {
	  return this.userId() || this.username() || this.email();
	};

	/**
	 * Get the user's description from `traits.description` or `traits.background`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Identify.prototype.description = function () {
	  return this.proxy('traits.description') || this.proxy('traits.background');
	};

	/**
	 * Get the URL of the user's avatar from `traits.avatar`, `traits.photoUrl`, or
	 * `traits.avatarUrl`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Identify.prototype.avatar = function () {
	  var traits = this.traits();
	  return analytics_jsObjCase(traits, 'avatar') || analytics_jsObjCase(traits, 'photoUrl') || analytics_jsObjCase(traits, 'avatarUrl');
	};

	/**
	 * Get the user's username from `traits.username`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {string}
	 */
	Identify.prototype.username = facade.proxy('traits.username');

	var identify = Identify;

	var inherit$4 = utils.inherit;




	/**
	 * Initialize a new `Track` facade with a `dictionary` of arguments.
	 *
	 * @param {Object} dictionary - The object to wrap.
	 * @param {string} [dictionary.event] - The name of the event being tracked.
	 * @param {string} [dictionary.userId] - The ID of the user being tracked.
	 * @param {string} [dictionary.anonymousId] - The anonymous ID of the user.
	 * @param {string} [dictionary.properties] - Properties of the track event.
	 * @param {Object} opts - Options about what kind of Facade to create.
	 *
	 * @augments Facade
	 */
	function Track(dictionary, opts) {
	  facade.call(this, dictionary, opts);
	}

	inherit$4(Track, facade);

	/**
	 * Return the type of facade this is. This will always return `"track"`.
	 *
	 * @return {string}
	 */
	Track.prototype.action = function () {
	  return 'track';
	};

	/**
	 * An alias for {@link Track#action}.
	 *
	 * @function
	 * @return {string}
	 */
	Track.prototype.type = Track.prototype.action;

	/**
	 * Get the event name from `event`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {string}
	 */
	Track.prototype.event = facade.field('event');

	/**
	 * Get the event value, usually the monetary value, from `properties.value`.
	 *
	 * This *should* be a number, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {number}
	 */
	Track.prototype.value = facade.proxy('properties.value');

	/**
	 * Get the event cateogry from `properties.category`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {string}
	 */
	Track.prototype.category = facade.proxy('properties.category');

	/**
	 * Get the event ID from `properties.id`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {string}
	 */
	Track.prototype.id = facade.proxy('properties.id');

	/**
	 * Get the name of this event from `properties.name`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {string}
	 */
	Track.prototype.name = facade.proxy('properties.name');

	/**
	 * Get a description for this event from `properties.description`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {string}
	 */
	Track.prototype.description = facade.proxy('properties.description');

	/**
	 * Get a plan, as in the plan the user is on, for this event from
	 * `properties.plan`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {string}
	 */
	Track.prototype.plan = facade.proxy('properties.plan');

	/**
	 * Get the referrer for this event from `context.referrer.url`,
	 * `context.page.referrer`, or `properties.referrer`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Track.prototype.referrer = function () {
	  // TODO re-examine whether this function is necessary
	  return this.proxy('context.referrer.url')
	    || this.proxy('context.page.referrer')
	    || this.proxy('properties.referrer');
	};

	/**
	 * Get the query for this event from `options.query`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @function
	 * @return {string|object}
	 */
	Track.prototype.query = facade.proxy('options.query');

	/**
	 * Get the page's properties. This is identical to how {@link Facade#traits}
	 * works, except it looks at `properties.*` instead of `options.traits.*`.
	 *
	 * Properties are gotten from `properties`.
	 *
	 * The parameter `aliases` is meant to transform keys in `properties` into new
	 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
	 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
	 * be called as a function instead of treated as a key into the traits.
	 *
	 * @example
	 * var obj = { properties: { foo: "bar" }, anonymousId: "xxx" }
	 * var track = new Track(obj)
	 *
	 * track.traits() // { "foo": "bar" }
	 * track.traits({ "foo": "asdf" }) // { "asdf": "bar" }
	 * track.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
	 *
	 * @param {Object} aliases - A mapping from keys to the new keys they should be
	 * transformed to.
	 * @return {Object}
	 */
	Track.prototype.properties = function (aliases) {
	  var ret = this.field('properties') || {};
	  aliases = aliases || {};

	  for (var alias in aliases) { // eslint-disable-line no-restricted-syntax, guard-for-in
	    var value = this[alias] == null ? this.proxy('properties.' + alias) : this[alias]();
	    if (value == null) continue;
	    ret[aliases[alias]] = value;
	    delete ret[alias];
	  }

	  return ret;
	};

	/**
	 * Get the username of the user for this event from `traits.username`,
	 * `properties.username`, `userId`, or `anonymousId`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string|undefined}
	 */
	Track.prototype.username = function () {
	  return this.proxy('traits.username')
	    || this.proxy('properties.username')
	    || this.userId()
	    || this.sessionId();
	};

	/**
	 * Get the email of the user for this event from `trais.email`,
	 * `properties.email`, or `options.traits.email`, falling back to `userId` if
	 * it looks like a valid email.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string|undefined}
	 */
	Track.prototype.email = function () {
	  var email = this.proxy('traits.email')
	    || this.proxy('properties.email')
	    || this.proxy('options.traits.email');
	  if (email) return email;

	  var userId = this.userId();
	  if (isEmail(userId)) return userId;
	};

	/**
	 * Get the revenue for this event. // FIXME: GA
	 *
	 * If this is an "Order Completed" event, this will be the `properties.total`
	 * falling back to the `properties.revenue`. For all other events, this is
	 * simply taken from `properties.revenue`.
	 *
	 * If there are dollar signs in these properties, they will be removed. The
	 * result will be parsed into a number.
	 *
	 * @return {number}
	 */
	Track.prototype.revenue = function () {
	  var revenue = this.proxy('properties.revenue');
	  var event = this.event();
	  var orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

	  // it's always revenue, unless it's called during an order completion.
	  if (!revenue && event && event.match(orderCompletedRegExp)) {
	    revenue = this.proxy('properties.total');
	  }

	  return currency(revenue);
	};

	/**
	 * Convert this event into an {@link Identify} facade.
	 *
	 * This works by taking this event's underlying object and creating an Identify
	 * from it. This event's traits, taken from `options.traits`, will be used as
	 * the Identify's traits.
	 *
	 * @return {Identify}
	 */
	Track.prototype.identify = function () {
	  // TODO: remove me.
	  var json = this.json();
	  json.traits = this.traits();
	  return new identify(json, this.opts);
	};

	/**
	 * Get float from currency value.
	 *
	 * @ignore
	 * @param {*} val
	 * @return {number}
	 */
	function currency(val) {
	  if (!val) return;
	  if (typeof val === 'number') {
	    return val;
	  }
	  if (typeof val !== 'string') {
	    return;
	  }

	  val = val.replace(/\$/g, '');
	  val = parseFloat(val);

	  if (!isNaN(val)) {
	    return val;
	  }
	}

	var track = Track;

	var inherit$5 = utils.inherit;




	/**
	 * Initialize a new `Page` facade with a `dictionary` of arguments.
	 *
	 * @param {Object} dictionary - The object to wrap.
	 * @param {string} [dictionary.category] - The page category.
	 * @param {string} [dictionary.name] - The page name.
	 * @param {string} [dictionary.properties] - The page properties.
	 * @param {Object} opts - Options about what kind of Facade to create.
	 *
	 * @augments Facade
	 */
	function Page(dictionary, opts) {
	  facade.call(this, dictionary, opts);
	}

	inherit$5(Page, facade);

	/**
	 * Return the type of facade this is. This will always return `"page"`.
	 *
	 * @return {string}
	 */
	Page.prototype.action = function () {
	  return 'page';
	};

	/**
	 * An alias for {@link Page#action}.
	 *
	 * @function
	 * @return {string}
	 */
	Page.prototype.type = Page.prototype.action;

	/**
	 * Get the page category from `category`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Page.prototype.category = facade.field('category');

	/**
	 * Get the page name from `name`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Page.prototype.name = facade.field('name');

	/**
	 * Get the page title from `properties.title`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Page.prototype.title = facade.proxy('properties.title');

	/**
	 * Get the page path from `properties.path`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Page.prototype.path = facade.proxy('properties.path');

	/**
	 * Get the page URL from `properties.url`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Page.prototype.url = facade.proxy('properties.url');

	/**
	 * Get the HTTP referrer from `context.referrer.url`, `context.page.referrer`,
	 * or `properties.referrer`.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Page.prototype.referrer = function () {
	  return this.proxy('context.referrer.url')
	    || this.proxy('context.page.referrer')
	    || this.proxy('properties.referrer');
	};

	/**
	 * Get the page's properties. This is identical to how {@link Facade#traits}
	 * works, except it looks at `properties.*` instead of `options.traits.*`.
	 *
	 * Properties are gotten from `properties`, augmented with the page's `name`
	 * and `category`.
	 *
	 * The parameter `aliases` is meant to transform keys in `properties` into new
	 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
	 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
	 * be called as a function instead of treated as a key into the traits.
	 *
	 * @example
	 * var obj = { properties: { foo: "bar" }, anonymousId: "xxx" }
	 * var page = new Page(obj)
	 *
	 * page.traits() // { "foo": "bar" }
	 * page.traits({ "foo": "asdf" }) // { "asdf": "bar" }
	 * page.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
	 *
	 * @param {Object} aliases - A mapping from keys to the new keys they should be
	 * transformed to.
	 * @return {Object}
	 */
	Page.prototype.properties = function (aliases) {
	  var props = this.field('properties') || {};
	  var category = this.category();
	  var name = this.name();
	  aliases = aliases || {};

	  if (category) props.category = category;
	  if (name) props.name = name;

	  for (var alias in aliases) { // eslint-disable-line no-restricted-syntax, guard-for-in
	    var value = this[alias] == null
	      ? this.proxy('properties.' + alias)
	      : this[alias]();
	    if (value == null) continue;
	    props[aliases[alias]] = value;
	    if (alias !== aliases[alias]) delete props[alias];
	  }

	  return props;
	};

	/**
	 * Get the user's email from `context.traits.email` or `properties.email`,
	 * falling back to `userId` if it's a valid email.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Page.prototype.email = function () {
	  var email = this.proxy('context.traits.email') || this.proxy('properties.email');
	  if (email) return email;

	  var userId = this.userId();
	  if (isEmail(userId)) return userId;
	};

	/**
	 * Get the page fullName. This is `$category $name` if both are present, and
	 * just `name` otherwiser.
	 *
	 * This *should* be a string, but may not be if the client isn't adhering to
	 * the spec.
	 *
	 * @return {string}
	 */
	Page.prototype.fullName = function () {
	  var category = this.category();
	  var name = this.name();
	  return name && category
	    ? category + ' ' + name
	    : name;
	};

	/**
	 * Get an event name from this page call. If `name` is present, this will be
	 * `Viewed $name Page`; otherwise, it will be `Loaded a Page`.
	 *
	 * @param {string} name - The name of this page.
	 * @return {string}
	 */
	Page.prototype.event = function (name) {
	  return name
	    ? 'Viewed ' + name + ' Page'
	    : 'Loaded a Page';
	};

	/**
	 * Convert this Page to a {@link Track} facade. The inputted `name` will be
	 * converted to the Track's event name via {@link Page#event}.
	 *
	 * @param {string} name
	 * @return {Track}
	 */
	Page.prototype.track = function (name) {
	  var json = this.json();
	  json.event = this.event(name);
	  json.timestamp = this.timestamp();
	  json.properties = this.properties();
	  return new track(json, this.opts);
	};

	var page = Page;

	var inherit$6 = utils.inherit;



	/**
	 * Initialize a new `Screen` facade with a `dictionary` of arguments.
	 *
	 * Note that this class extends {@link Page}, so its methods are available to
	 * instances of this class as well.
	 *
	 * @param {Object} dictionary - The object to wrap.
	 * @param {string} [dictionary.category] - The page category.
	 * @param {string} [dictionary.name] - The page name.
	 * @param {string} [dictionary.properties] - The page properties.
	 * @param {Object} opts - Options about what kind of Facade to create.
	 *
	 * @augments Page
	 */
	function Screen(dictionary, opts) {
	  page.call(this, dictionary, opts);
	}

	inherit$6(Screen, page);

	/**
	 * Return the type of facade this is. This will always return `"screen"`.
	 *
	 * @return {string}
	 */
	Screen.prototype.action = function () {
	  return 'screen';
	};

	/**
	 * An alias for {@link Screen#action}.
	 *
	 * @function
	 * @return {string}
	 */
	Screen.prototype.type = Screen.prototype.action;

	/**
	 * Get an event name from this screen call. If `name` is present, this will be
	 * `Viewed $name Screen`; otherwise, it will be `Loaded a Screen`.
	 *
	 * @param {string} name - The name of this screen.
	 * @return {string}
	 */
	Screen.prototype.event = function (name) {
	  return name ? 'Viewed ' + name + ' Screen' : 'Loaded a Screen';
	};

	/**
	 * Convert this Screen to a {@link Track} facade. The inputted `name` will be
	 * converted to the Track's event name via {@link Screen#event}.
	 *
	 * @param {string} name
	 * @return {Track}
	 */
	Screen.prototype.track = function (name) {
	  var json = this.json();
	  json.event = this.event(name);
	  json.timestamp = this.timestamp();
	  json.properties = this.properties();
	  return new track(json, this.opts);
	};

	var screen = Screen;

	var inherit$7 = utils.inherit;


	/**
	 * Initialize a new `Delete` facade with a `dictionary` of arguments.
	 *
	 * @param {Object} dictionary - The object to wrap.
	 * @param {string} [dictionary.category] - The delete category.
	 * @param {string} [dictionary.name] - The delete name.
	 * @param {string} [dictionary.properties] - The delete properties.
	 * @param {Object} opts - Options about what kind of Facade to create.
	 *
	 * @augments Facade
	 */
	function Delete(dictionary, opts) {
	  facade.call(this, dictionary, opts);
	}

	inherit$7(Delete, facade);

	/**
	 * Return the type of facade this is. This will always return `"delete"`.
	 *
	 * @return {string}
	 */
	Delete.prototype.type = function () {
	  return 'delete';
	};

	var _delete = Delete;

	facade.Alias = alias;
	facade.Group = group;
	facade.Identify = identify;
	facade.Track = track;
	facade.Page = page;
	facade.Screen = screen;
	facade.Delete = _delete;

	var lib$4 = facade;

	var objToString = Object.prototype.toString;

	/**
	 * Determine if a value is a function.
	 *
	 * @param {*} val
	 * @return {boolean}
	 */
	// TODO: Move to lib
	var isFunction = function(val) {
	  return typeof val === 'function';
	};

	/**
	 * Determine if a value is a number.
	 *
	 * @param {*} val
	 * @return {boolean}
	 */
	// TODO: Move to lib
	var isNumber = function(val) {
	  var type = typeof val;
	  return type === 'number' || (type === 'object' && objToString.call(val) === '[object Number]');
	};

	 /**
	  * Creates an array of generic, numbered argument names.
	  *
	  * @name createParams
	  * @api private
	  * @param {number} n
	  * @return {Array}
	  * @example
	  * argNames(2);
	  * //=> ['arg1', 'arg2']
	  */
	var createParams = function createParams(n) {
	  var args = [];

	  for (var i = 1; i <= n; i += 1) {
	    args.push('arg' + i);
	  }

	  return args;
	};

	 /**
	  * Dynamically construct a wrapper function of `n` arity that.
	  *
	  * If at all possible, prefer a function from the arity wrapper cache above to
	  * avoid allocating a new function at runtime.
	  *
	  * @name createArityWrapper
	  * @api private
	  * @param {number} n
	  * @return {Function(Function)}
	  */
	var createArityWrapper = function createArityWrapper(n) {
	  var paramNames = createParams(n).join(', ');
	  var wrapperBody = ''.concat(
	    '  return function(', paramNames, ') {\n',
	    '    return func.apply(this, arguments);\n',
	    '  };'
	  );

	  /* eslint-disable no-new-func */
	  return new Function('func', wrapperBody);
	  /* eslint-enable no-new-func */
	};

	// Cache common arity wrappers to avoid constructing them at runtime
	var arityWrapperCache = [
	  /* eslint-disable no-unused-vars */
	  function(fn) {
	    return function() {
	      return fn.apply(this, arguments);
	    };
	  },

	  function(fn) {
	    return function(arg1) {
	      return fn.apply(this, arguments);
	    };
	  },

	  function(fn) {
	    return function(arg1, arg2) {
	      return fn.apply(this, arguments);
	    };
	  },

	  function(fn) {
	    return function(arg1, arg2, arg3) {
	      return fn.apply(this, arguments);
	    };
	  },

	  function(fn) {
	    return function(arg1, arg2, arg3, arg4) {
	      return fn.apply(this, arguments);
	    };
	  },

	  function(fn) {
	    return function(arg1, arg2, arg3, arg4, arg5) {
	      return fn.apply(this, arguments);
	    };
	  }
	  /* eslint-enable no-unused-vars */
	];

	/**
	 * Takes a function and an [arity](https://en.wikipedia.org/wiki/Arity) `n`, and returns a new
	 * function that expects `n` arguments.
	 *
	 * @name arity
	 * @api public
	 * @category Function
	 * @see {@link curry}
	 * @param {Number} n The desired arity of the returned function.
	 * @param {Function} fn The function to wrap.
	 * @return {Function} A function of n arity, wrapping `fn`.
	 * @example
	 * var add = function(a, b) {
	 *   return a + b;
	 * };
	 *
	 * // Check the number of arguments this function expects by accessing `.length`:
	 * add.length;
	 * //=> 2
	 *
	 * var unaryAdd = arity(1, add);
	 * unaryAdd.length;
	 * //=> 1
	 */
	var arity = function arity(n, func) {
	  if (!isFunction(func)) {
	    throw new TypeError('Expected a function but got ' + typeof func);
	  }

	  n = Math.max(isNumber(n) ? n : 0, 0);

	  if (!arityWrapperCache[n]) {
	    arityWrapperCache[n] = createArityWrapper(n);
	  }

	  return arityWrapperCache[n](func);
	};

	/*
	 * Exports.
	 */

	var arity_1 = arity;

	/*
	 * Module dependencies.
	 */



	var objToString$1 = Object.prototype.toString;

	/**
	 * Determine if a value is a function.
	 *
	 * @param {*} val
	 * @return {boolean}
	 */
	// TODO: Move to lib
	var isFunction$1 = function(val) {
	  return typeof val === 'function';
	};

	/**
	 * Determine if a value is a number.
	 *
	 * @param {*} val
	 * @return {boolean}
	 */
	// TODO: Move to lib
	var isNumber$1 = function(val) {
	  var type = typeof val;
	  return type === 'number' || (type === 'object' && objToString$1.call(val) === '[object Number]');
	};

	/**
	 * Wrap a function `fn` in a function that will invoke `fn` when invoked `n` or
	 * more times.
	 *
	 * @name after
	 * @api public
	 * @category Function
	 * @param {Number} n The number of
	 * @param {Function} fn The function to wrap.
	 * @return {Function} A function that will call `fn` after `n` or more
	 * invocations.
	 * @example
	 */
	var after = function after(n, fn) {
	  if (!isNumber$1(n)) {
	    throw new TypeError('Expected a number but received ' + typeof n);
	  }

	  if (!isFunction$1(fn)) {
	    throw new TypeError('Expected a function but received ' + typeof fn);
	  }

	  var callCount = 0;

	  return arity_1(fn.length, function() {
	    callCount += 1;

	    if (callCount < n) {
	      return;
	    }

	    return fn.apply(this, arguments);
	  });
	};

	/*
	 * Exports.
	 */

	var after_1 = after;

	/**
	 * Slice reference.
	 */

	var slice = [].slice;

	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */

	var componentBind = function(obj, fn){
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = slice.call(arguments, 2);
	  return function(){
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  }
	};

	function bindAll(obj) {
	  // eslint-disable-next-line guard-for-in
	  for (var key in obj) {
	    var val = obj[key];
	    if (typeof val === 'function') {
	      obj[key] = componentBind(obj, obj[key]);
	    }
	  }
	  return obj;
	}

	var lib$5 = bindAll;

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) { /**/ }

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	var extend = function extend() {
		var options, name, src, copy, copyIsArray, clone;
		var target = arguments[0];
		var i = 1;
		var length = arguments.length;
		var deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}
		if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	/**
	 * Module dependencies.
	 */

	// var debug = require('debug')('cookie');

	/**
	 * Set or get cookie `name` with `value` and `options` object.
	 *
	 * @param {String} name
	 * @param {String} value
	 * @param {Object} options
	 * @return {Mixed}
	 * @api public
	 */

	var analytics_jsComponentCookie = function(name, value, options){
	  switch (arguments.length) {
	    case 3:
	    case 2:
	      return set(name, value, options);
	    case 1:
	      return get(name);
	    default:
	      return all();
	  }
	};

	/**
	 * Set cookie `name` to `value`.
	 *
	 * @param {String} name
	 * @param {String} value
	 * @param {Object} options
	 * @api private
	 */

	function set(name, value, options) {
	  options = options || {};
	  var str = encode(name) + '=' + encode(value);

	  if (null == value) options.maxage = -1;

	  if (options.maxage) {
	    options.expires = new Date(+new Date + options.maxage);
	  }

	  if (options.path) str += '; path=' + options.path;
	  if (options.domain) str += '; domain=' + options.domain;
	  if (options.expires) str += '; expires=' + options.expires.toUTCString();
	  if (options.secure) str += '; secure';

	  document.cookie = str;
	}

	/**
	 * Return all cookies.
	 *
	 * @return {Object}
	 * @api private
	 */

	function all() {
	  var str;
	  try {
	    str = document.cookie;
	  } catch (err) {
	    if (typeof console !== 'undefined' && typeof console.error === 'function') {
	      console.error(err.stack || err);
	    }
	    return {};
	  }
	  return parse$4(str);
	}

	/**
	 * Get cookie `name`.
	 *
	 * @param {String} name
	 * @return {String}
	 * @api private
	 */

	function get(name) {
	  return all()[name];
	}

	/**
	 * Parse cookie `str`.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parse$4(str) {
	  var obj = {};
	  var pairs = str.split(/ *; */);
	  var pair;
	  if ('' == pairs[0]) return obj;
	  for (var i = 0; i < pairs.length; ++i) {
	    pair = pairs[i].split('=');
	    obj[decode(pair[0])] = decode(pair[1]);
	  }
	  return obj;
	}

	/**
	 * Encode.
	 */

	function encode(value){
	  try {
	    return encodeURIComponent(value);
	  } catch (e) {
	    console.error(e);
	  }
	}

	/**
	 * Decode.
	 */

	function decode(value) {
	  try {
	    return decodeURIComponent(value);
	  } catch (e) {
	    console.error(e);
	  }
	}

	var max = Math.max;

	/**
	 * Produce a new array composed of all but the first `n` elements of an input `collection`.
	 *
	 * @name drop
	 * @api public
	 * @param {number} count The number of elements to drop.
	 * @param {Array} collection The collection to iterate over.
	 * @return {Array} A new array containing all but the first element from `collection`.
	 * @example
	 * drop(0, [1, 2, 3]); // => [1, 2, 3]
	 * drop(1, [1, 2, 3]); // => [2, 3]
	 * drop(2, [1, 2, 3]); // => [3]
	 * drop(3, [1, 2, 3]); // => []
	 * drop(4, [1, 2, 3]); // => []
	 */
	var drop = function drop(count, collection) {
	  var length = collection ? collection.length : 0;

	  if (!length) {
	    return [];
	  }

	  // Preallocating an array *significantly* boosts performance when dealing with
	  // `arguments` objects on v8. For a summary, see:
	  // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
	  var toDrop = max(Number(count) || 0, 0);
	  var resultsLength = max(length - toDrop, 0);
	  var results = new Array(resultsLength);

	  for (var i = 0; i < resultsLength; i += 1) {
	    results[i] = collection[i + toDrop];
	  }

	  return results;
	};

	/*
	 * Exports.
	 */

	var drop_1 = drop;

	var max$1 = Math.max;

	/**
	 * Produce a new array by passing each value in the input `collection` through a transformative
	 * `iterator` function. The `iterator` function is passed three arguments:
	 * `(value, index, collection)`.
	 *
	 * @name rest
	 * @api public
	 * @param {Array} collection The collection to iterate over.
	 * @return {Array} A new array containing all but the first element from `collection`.
	 * @example
	 * rest([1, 2, 3]); // => [2, 3]
	 */
	var rest = function rest(collection) {
	  if (collection == null || !collection.length) {
	    return [];
	  }

	  // Preallocating an array *significantly* boosts performance when dealing with
	  // `arguments` objects on v8. For a summary, see:
	  // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
	  var results = new Array(max$1(collection.length - 2, 0));

	  for (var i = 1; i < collection.length; i += 1) {
	    results[i - 1] = collection[i];
	  }

	  return results;
	};

	/*
	 * Exports.
	 */

	var rest_1 = rest;

	/*
	 * Module dependencies.
	 */




	var has = Object.prototype.hasOwnProperty;
	var objToString$2 = Object.prototype.toString;

	/**
	 * Returns `true` if a value is an object, otherwise `false`.
	 *
	 * @name isObject
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean}
	 */
	// TODO: Move to a library
	var isObject = function isObject(value) {
	  return Boolean(value) && typeof value === 'object';
	};

	/**
	 * Returns `true` if a value is a plain object, otherwise `false`.
	 *
	 * @name isPlainObject
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean}
	 */
	// TODO: Move to a library
	var isPlainObject$1 = function isPlainObject(value) {
	  return Boolean(value) && objToString$2.call(value) === '[object Object]';
	};

	/**
	 * Assigns a key-value pair to a target object when the value assigned is owned,
	 * and where target[key] is undefined.
	 *
	 * @name shallowCombiner
	 * @api private
	 * @param {Object} target
	 * @param {Object} source
	 * @param {*} value
	 * @param {string} key
	 */
	var shallowCombiner = function shallowCombiner(target, source, value, key) {
	  if (has.call(source, key) && target[key] === undefined) {
	    target[key] = value;
	  }
	  return source;
	};

	/**
	 * Assigns a key-value pair to a target object when the value assigned is owned,
	 * and where target[key] is undefined; also merges objects recursively.
	 *
	 * @name deepCombiner
	 * @api private
	 * @param {Object} target
	 * @param {Object} source
	 * @param {*} value
	 * @param {string} key
	 * @return {Object}
	 */
	var deepCombiner = function(target, source, value, key) {
	  if (has.call(source, key)) {
	    if (isPlainObject$1(target[key]) && isPlainObject$1(value)) {
	        target[key] = defaultsDeep(target[key], value);
	    } else if (target[key] === undefined) {
	        target[key] = value;
	    }
	  }

	  return source;
	};

	/**
	 * TODO: Document
	 *
	 * @name defaultsWith
	 * @api private
	 * @param {Function} combiner
	 * @param {Object} target
	 * @param {...Object} sources
	 * @return {Object} Return the input `target`.
	 */
	var defaultsWith = function(combiner, target /*, ...sources */) {
	  if (!isObject(target)) {
	    return target;
	  }

	  combiner = combiner || shallowCombiner;
	  var sources = drop_1(2, arguments);

	  for (var i = 0; i < sources.length; i += 1) {
	    for (var key in sources[i]) {
	      combiner(target, sources[i], sources[i][key], key);
	    }
	  }

	  return target;
	};

	/**
	 * Copies owned, enumerable properties from a source object(s) to a target
	 * object when the value of that property on the source object is `undefined`.
	 * Recurses on objects.
	 *
	 * @name defaultsDeep
	 * @api public
	 * @param {Object} target
	 * @param {...Object} sources
	 * @return {Object} The input `target`.
	 */
	var defaultsDeep = function defaultsDeep(target /*, sources */) {
	  // TODO: Replace with `partial` call?
	  return defaultsWith.apply(null, [deepCombiner, target].concat(rest_1(arguments)));
	};

	/**
	 * Copies owned, enumerable properties from a source object(s) to a target
	 * object when the value of that property on the source object is `undefined`.
	 *
	 * @name defaults
	 * @api public
	 * @param {Object} target
	 * @param {...Object} sources
	 * @return {Object}
	 * @example
	 * var a = { a: 1 };
	 * var b = { a: 2, b: 2 };
	 *
	 * defaults(a, b);
	 * console.log(a); //=> { a: 1, b: 2 }
	 */
	var defaults = function(target /*, ...sources */) {
	  // TODO: Replace with `partial` call?
	  return defaultsWith.apply(null, [null, target].concat(rest_1(arguments)));
	};

	/*
	 * Exports.
	 */

	var defaults_1 = defaults;
	var deep = defaultsDeep;
	defaults_1.deep = deep;

	var componentUrl = createCommonjsModule(function (module, exports) {
	/**
	 * Parse the given `url`.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api public
	 */

	exports.parse = function(url){
	  var a = document.createElement('a');
	  a.href = url;
	  return {
	    href: a.href,
	    host: a.host || location.host,
	    port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
	    hash: a.hash,
	    hostname: a.hostname || location.hostname,
	    pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
	    protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
	    search: a.search,
	    query: a.search.slice(1)
	  };
	};

	/**
	 * Check if `url` is absolute.
	 *
	 * @param {String} url
	 * @return {Boolean}
	 * @api public
	 */

	exports.isAbsolute = function(url){
	  return 0 == url.indexOf('//') || !!~url.indexOf('://');
	};

	/**
	 * Check if `url` is relative.
	 *
	 * @param {String} url
	 * @return {Boolean}
	 * @api public
	 */

	exports.isRelative = function(url){
	  return !exports.isAbsolute(url);
	};

	/**
	 * Check if `url` is cross domain.
	 *
	 * @param {String} url
	 * @return {Boolean}
	 * @api public
	 */

	exports.isCrossDomain = function(url){
	  url = exports.parse(url);
	  var location = exports.parse(window.location.href);
	  return url.hostname !== location.hostname
	    || url.port !== location.port
	    || url.protocol !== location.protocol;
	};

	/**
	 * Return default port for `protocol`.
	 *
	 * @param  {String} protocol
	 * @return {String}
	 * @api private
	 */
	function port (protocol){
	  switch (protocol) {
	    case 'http:':
	      return 80;
	    case 'https:':
	      return 443;
	    default:
	      return location.port;
	  }
	}
	});
	var componentUrl_1 = componentUrl.parse;
	var componentUrl_2 = componentUrl.isAbsolute;
	var componentUrl_3 = componentUrl.isRelative;
	var componentUrl_4 = componentUrl.isCrossDomain;

	var lib$6 = createCommonjsModule(function (module, exports) {

	/**
	 * Module dependencies.
	 */

	var parse = componentUrl.parse;


	/**
	 * Get the top domain.
	 *
	 * The function constructs the levels of domain and attempts to set a global
	 * cookie on each one when it succeeds it returns the top level domain.
	 *
	 * The method returns an empty string when the hostname is an ip or `localhost`.
	 *
	 * Example levels:
	 *
	 *      domain.levels('http://www.google.co.uk');
	 *      // => ["co.uk", "google.co.uk", "www.google.co.uk"]
	 *
	 * Example:
	 *
	 *      domain('http://localhost:3000/baz');
	 *      // => ''
	 *      domain('http://dev:3000/baz');
	 *      // => ''
	 *      domain('http://127.0.0.1:3000/baz');
	 *      // => ''
	 *      domain('http://segment.io/baz');
	 *      // => 'segment.io'
	 *
	 * @param {string} url
	 * @return {string}
	 * @api public
	 */
	function domain(url) {
	  var cookie = exports.cookie;
	  var levels = exports.levels(url);

	  // Lookup the real top level one.
	  for (var i = 0; i < levels.length; ++i) {
	    var cname = '__tld__';
	    var domain = levels[i];
	    var opts = { domain: '.' + domain };

	    cookie(cname, 1, opts);
	    if (cookie(cname)) {
	      cookie(cname, null, opts);
	      return domain;
	    }
	  }

	  return '';
	}

	/**
	 * Levels returns all levels of the given url.
	 *
	 * @param {string} url
	 * @return {Array}
	 * @api public
	 */
	domain.levels = function(url) {
	  var host = parse(url).hostname;
	  var parts = host.split('.');
	  var last = parts[parts.length - 1];
	  var levels = [];

	  // Ip address.
	  if (parts.length === 4 && last === parseInt(last, 10)) {
	    return levels;
	  }

	  // Localhost.
	  if (parts.length <= 1) {
	    return levels;
	  }

	  // Create levels.
	  for (var i = parts.length - 2; i >= 0; --i) {
	    levels.push(parts.slice(i).join('.'));
	  }

	  return levels;
	};

	/**
	 * Expose cookie on domain.
	 */
	domain.cookie = analytics_jsComponentCookie;

	/*
	 * Exports.
	 */

	exports = module.exports = domain;
	});

	/**
	 * Module dependencies.
	 */




	// var debug = require('debug')('analytics.js:cookie');

	// var json = require('json3');


	/**
	 * Initialize a new `Cookie` with `options`.
	 *
	 * @param {Object} options
	 */

	function Cookie(options) {
	  this.options(options);
	}


	/**
	 * Get or set the cookie options.
	 *
	 * @param {Object} options
	 *   @field {Number} maxage (1 year)
	 *   @field {String} domain
	 *   @field {String} path
	 *   @field {Boolean} secure
	 */

	Cookie.prototype.options = function(options) {
	  if (arguments.length === 0) return this._options;

	  options = options || {};

	  var domain = '.' + lib$6(window.location.href);
	  if (domain === '.') domain = null;

	  this._options = defaults_1(options, {
	    // default to a year
	    maxage: 31536000000,
	    path: '/',
	    domain: domain
	  });

	  // http://curl.haxx.se/rfc/cookie_spec.html
	  // https://publicsuffix.org/list/effective_tld_names.dat
	  //
	  // try setting a dummy cookie with the options
	  // if the cookie isn't set, it probably means
	  // that the domain is on the public suffix list
	  // like myapp.herokuapp.com or localhost / ip.
	  this.set('ajs:test', true);
	  if (!this.get('ajs:test')) {
	    // debug('fallback to domain=null');
	    this._options.domain = null;
	  }
	  this.remove('ajs:test');
	};


	/**
	 * Set a `key` and `value` in our cookie.
	 *
	 * @param {String} key
	 * @param {Object} value
	 * @return {Boolean} saved
	 */

	Cookie.prototype.set = function(key, value) {
	  try {
	    value = JSON.stringify(value);
	    analytics_jsComponentCookie(key, value, clone_1(this._options));
	    return true;
	  } catch (e) {
	    return false;
	  }
	};


	/**
	 * Get a value from our cookie by `key`.
	 *
	 * @param {String} key
	 * @return {Object} value
	 */

	Cookie.prototype.get = function(key) {
	  try {
	    var value = analytics_jsComponentCookie(key);
	    value = value ? JSON.parse(value) : null;
	    return value;
	  } catch (e) {
	    return null;
	  }
	};


	/**
	 * Remove a value from our cookie by `key`.
	 *
	 * @param {String} key
	 * @return {Boolean} removed
	 */

	Cookie.prototype.remove = function(key) {
	  try {
	    analytics_jsComponentCookie(key, null, clone_1(this._options));
	    return true;
	  } catch (e) {
	    return false;
	  }
	};


	/**
	 * Expose the cookie singleton.
	 */

	var cookie_1 = lib$5(new Cookie());


	/**
	 * Expose the `Cookie` constructor.
	 */

	var Cookie_1 = Cookie;
	cookie_1.Cookie = Cookie_1;

	var hop = Object.prototype.hasOwnProperty;
	var strCharAt = String.prototype.charAt;
	var toStr$1 = Object.prototype.toString;

	/**
	 * Returns the character at a given index.
	 *
	 * @param {string} str
	 * @param {number} index
	 * @return {string|undefined}
	 */
	// TODO: Move to a library
	var charAt = function(str, index) {
	  return strCharAt.call(str, index);
	};

	/**
	 * hasOwnProperty, wrapped as a function.
	 *
	 * @name has
	 * @api private
	 * @param {*} context
	 * @param {string|number} prop
	 * @return {boolean}
	 */

	// TODO: Move to a library
	var has$1 = function has(context, prop) {
	  return hop.call(context, prop);
	};

	/**
	 * Returns true if a value is a string, otherwise false.
	 *
	 * @name isString
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */

	// TODO: Move to a library
	var isString = function isString(val) {
	  return toStr$1.call(val) === '[object String]';
	};

	/**
	 * Returns true if a value is array-like, otherwise false. Array-like means a
	 * value is not null, undefined, or a function, and has a numeric `length`
	 * property.
	 *
	 * @name isArrayLike
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */
	// TODO: Move to a library
	var isArrayLike = function isArrayLike(val) {
	  return val != null && (typeof val !== 'function' && typeof val.length === 'number');
	};


	/**
	 * indexKeys
	 *
	 * @name indexKeys
	 * @api private
	 * @param {} target
	 * @param {Function} pred
	 * @return {Array}
	 */
	var indexKeys = function indexKeys(target, pred) {
	  pred = pred || has$1;

	  var results = [];

	  for (var i = 0, len = target.length; i < len; i += 1) {
	    if (pred(target, i)) {
	      results.push(String(i));
	    }
	  }

	  return results;
	};

	/**
	 * Returns an array of an object's owned keys.
	 *
	 * @name objectKeys
	 * @api private
	 * @param {*} target
	 * @param {Function} pred Predicate function used to include/exclude values from
	 * the resulting array.
	 * @return {Array}
	 */
	var objectKeys = function objectKeys(target, pred) {
	  pred = pred || has$1;

	  var results = [];

	  for (var key in target) {
	    if (pred(target, key)) {
	      results.push(String(key));
	    }
	  }

	  return results;
	};

	/**
	 * Creates an array composed of all keys on the input object. Ignores any non-enumerable properties.
	 * More permissive than the native `Object.keys` function (non-objects will not throw errors).
	 *
	 * @name keys
	 * @api public
	 * @category Object
	 * @param {Object} source The value to retrieve keys from.
	 * @return {Array} An array containing all the input `source`'s keys.
	 * @example
	 * keys({ likes: 'avocado', hates: 'pineapple' });
	 * //=> ['likes', 'pineapple'];
	 *
	 * // Ignores non-enumerable properties
	 * var hasHiddenKey = { name: 'Tim' };
	 * Object.defineProperty(hasHiddenKey, 'hidden', {
	 *   value: 'i am not enumerable!',
	 *   enumerable: false
	 * })
	 * keys(hasHiddenKey);
	 * //=> ['name'];
	 *
	 * // Works on arrays
	 * keys(['a', 'b', 'c']);
	 * //=> ['0', '1', '2']
	 *
	 * // Skips unpopulated indices in sparse arrays
	 * var arr = [1];
	 * arr[4] = 4;
	 * keys(arr);
	 * //=> ['0', '4']
	 */
	var keys = function keys(source) {
	  if (source == null) {
	    return [];
	  }

	  // IE6-8 compatibility (string)
	  if (isString(source)) {
	    return indexKeys(source, charAt);
	  }

	  // IE6-8 compatibility (arguments)
	  if (isArrayLike(source)) {
	    return indexKeys(source, has$1);
	  }

	  return objectKeys(source);
	};

	/*
	 * Exports.
	 */

	var keys_1 = keys;

	/*
	 * Module dependencies.
	 */



	var objToString$3 = Object.prototype.toString;

	/**
	 * Tests if a value is a number.
	 *
	 * @name isNumber
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean} Returns `true` if `val` is a number, otherwise `false`.
	 */
	// TODO: Move to library
	var isNumber$2 = function isNumber(val) {
	  var type = typeof val;
	  return type === 'number' || (type === 'object' && objToString$3.call(val) === '[object Number]');
	};

	/**
	 * Tests if a value is an array.
	 *
	 * @name isArray
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean} Returns `true` if the value is an array, otherwise `false`.
	 */
	// TODO: Move to library
	var isArray$1 = typeof Array.isArray === 'function' ? Array.isArray : function isArray(val) {
	  return objToString$3.call(val) === '[object Array]';
	};

	/**
	 * Tests if a value is array-like. Array-like means the value is not a function and has a numeric
	 * `.length` property.
	 *
	 * @name isArrayLike
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */
	// TODO: Move to library
	var isArrayLike$1 = function isArrayLike(val) {
	  return val != null && (isArray$1(val) || (val !== 'function' && isNumber$2(val.length)));
	};

	/**
	 * Internal implementation of `each`. Works on arrays and array-like data structures.
	 *
	 * @name arrayEach
	 * @api private
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Array} array The array(-like) structure to iterate over.
	 * @return {undefined}
	 */
	var arrayEach = function arrayEach(iterator, array) {
	  for (var i = 0; i < array.length; i += 1) {
	    // Break iteration early if `iterator` returns `false`
	    if (iterator(array[i], i, array) === false) {
	      break;
	    }
	  }
	};

	/**
	 * Internal implementation of `each`. Works on objects.
	 *
	 * @name baseEach
	 * @api private
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Object} object The object to iterate over.
	 * @return {undefined}
	 */
	var baseEach = function baseEach(iterator, object) {
	  var ks = keys_1(object);

	  for (var i = 0; i < ks.length; i += 1) {
	    // Break iteration early if `iterator` returns `false`
	    if (iterator(object[ks[i]], ks[i], object) === false) {
	      break;
	    }
	  }
	};

	/**
	 * Iterate over an input collection, invoking an `iterator` function for each element in the
	 * collection and passing to it three arguments: `(value, index, collection)`. The `iterator`
	 * function can end iteration early by returning `false`.
	 *
	 * @name each
	 * @api public
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @return {undefined} Because `each` is run only for side effects, always returns `undefined`.
	 * @example
	 * var log = console.log.bind(console);
	 *
	 * each(log, ['a', 'b', 'c']);
	 * //-> 'a', 0, ['a', 'b', 'c']
	 * //-> 'b', 1, ['a', 'b', 'c']
	 * //-> 'c', 2, ['a', 'b', 'c']
	 * //=> undefined
	 *
	 * each(log, 'tim');
	 * //-> 't', 2, 'tim'
	 * //-> 'i', 1, 'tim'
	 * //-> 'm', 0, 'tim'
	 * //=> undefined
	 *
	 * // Note: Iteration order not guaranteed across environments
	 * each(log, { name: 'tim', occupation: 'enchanter' });
	 * //-> 'tim', 'name', { name: 'tim', occupation: 'enchanter' }
	 * //-> 'enchanter', 'occupation', { name: 'tim', occupation: 'enchanter' }
	 * //=> undefined
	 */
	var each = function each(iterator, collection) {
	  return (isArrayLike$1(collection) ? arrayEach : baseEach).call(this, iterator, collection);
	};

	/*
	 * Exports.
	 */

	var each_1 = each;

	/*
	 * Module dependencies.
	 */



	var strIndexOf = String.prototype.indexOf;

	/**
	 * Object.is/sameValueZero polyfill.
	 *
	 * @api private
	 * @param {*} value1
	 * @param {*} value2
	 * @return {boolean}
	 */
	// TODO: Move to library
	var sameValueZero = function sameValueZero(value1, value2) {
	  // Normal values and check for 0 / -0
	  if (value1 === value2) {
	    return value1 !== 0 || 1 / value1 === 1 / value2;
	  }
	  // NaN
	  return value1 !== value1 && value2 !== value2;
	};

	/**
	 * Searches a given `collection` for a value, returning true if the collection
	 * contains the value and false otherwise. Can search strings, arrays, and
	 * objects.
	 *
	 * @name includes
	 * @api public
	 * @param {*} searchElement The element to search for.
	 * @param {Object|Array|string} collection The collection to search.
	 * @return {boolean}
	 * @example
	 * includes(2, [1, 2, 3]);
	 * //=> true
	 *
	 * includes(4, [1, 2, 3]);
	 * //=> false
	 *
	 * includes(2, { a: 1, b: 2, c: 3 });
	 * //=> true
	 *
	 * includes('a', { a: 1, b: 2, c: 3 });
	 * //=> false
	 *
	 * includes('abc', 'xyzabc opq');
	 * //=> true
	 *
	 * includes('nope', 'xyzabc opq');
	 * //=> false
	 */
	var includes = function includes(searchElement, collection) {
	  var found = false;

	  // Delegate to String.prototype.indexOf when `collection` is a string
	  if (typeof collection === 'string') {
	    return strIndexOf.call(collection, searchElement) !== -1;
	  }

	  // Iterate through enumerable/own array elements and object properties.
	  each_1(function(value) {
	    if (sameValueZero(value, searchElement)) {
	      found = true;
	      // Exit iteration early when found
	      return false;
	    }
	  }, collection);

	  return found;
	};

	/*
	 * Exports.
	 */

	var includes_1 = includes;

	/*
	 * Module dependencies.
	 */



	/**
	 * Produce a new array by passing each value in the input `collection` through a transformative
	 * `iterator` function. The `iterator` function is passed three arguments:
	 * `(value, index, collection)`.
	 *
	 * @name map
	 * @api public
	 * @param {Function} iterator The transformer function to invoke per iteration.
	 * @param {Array} collection The collection to iterate over.
	 * @return {Array} A new array containing the results of each `iterator` invocation.
	 * @example
	 * var square = function(x) { return x * x; };
	 *
	 * map(square, [1, 2, 3]);
	 * //=> [1, 4, 9]
	 */
	var map = function map(iterator, collection) {
	  if (typeof iterator !== 'function') {
	    throw new TypeError('Expected a function but received a ' + typeof iterator);
	  }

	  var result = [];

	  each_1(function(val, i, collection) {
	    result.push(iterator(val, i, collection));
	  }, collection);

	  return result;
	};

	/*
	 * Exports.
	 */

	var map_1 = map;

	var rng;

	if (commonjsGlobal.crypto && crypto.getRandomValues) {
	  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	  // Moderately fast, high quality
	  var _rnds8 = new Uint8Array(16);
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(_rnds8);
	    return _rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var  _rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return _rnds;
	  };
	}

	var rngBrowser = rng;

	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php

	// Unique ID creation requires a high quality random # generator.  We feature
	// detect to determine the best RNG source, normalizing to a function that
	// returns 128-bits of randomness, since that's what's usually required


	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}

	// **`parse()` - Parse a UUID into it's component bytes**
	function parse$5(s, buf, offset) {
	  var i = (buf && offset) || 0, ii = 0;

	  buf = buf || [];
	  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	    if (ii < 16) { // Don't overflow!
	      buf[i + ii++] = _hexToByte[oct];
	    }
	  });

	  // Zero out remaining bytes if string was short
	  while (ii < 16) {
	    buf[i + ii++] = 0;
	  }

	  return buf;
	}

	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf, offset) {
	  var i = offset || 0, bth = _byteToHex;
	  return  bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	// random #'s we need to init node and clockseq
	var _seedBytes = rngBrowser();

	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];

	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};

	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; n++) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : unparse(b);
	}

	// **`v4()` - Generate random UUID**

	// See https://github.com/broofa/node-uuid for API details
	function v4(options, buf, offset) {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || rngBrowser)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ii++) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || unparse(rnds);
	}

	// Export public API
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	uuid.parse = parse$5;
	uuid.unparse = unparse;

	var uuid_1 = uuid;

	/**
	 * Module Dependencies.
	 */

	// var debug = require('debug')('analytics.js:normalize');







	/**
	 * HOP.
	 */

	var has$2 = Object.prototype.hasOwnProperty;

	/**
	 * Expose `normalize`
	 */

	var normalize_1 = normalize;

	/**
	 * Toplevel properties.
	 */

	var toplevel = [
	  'integrations',
	  'anonymousId',
	  'eventId',
	  'timestamp',
	  'context'
	];

	/**
	 * Normalize `msg` based on integrations `list`.
	 *
	 * @param {Object} msg
	 * @param {Array} list
	 * @return {Function}
	 */

	function normalize(msg, list) {
	  var lower = map_1(function(s) { return s.toLowerCase(); }, list);
	  var opts = msg.options || {};
	  var integrations = opts.integrations || {};
	  var providers = opts.providers || {};
	  var context = opts.context || {};
	  var ret = {};
	  // debug('<-', msg);

	  // integrations.
	  each_1(function(value, key) {
	    if (!integration(key)) return;
	    if (!has$2.call(integrations, key)) integrations[key] = value;
	    delete opts[key];
	  }, opts);

	  // providers.
	  delete opts.providers;
	  each_1(function(value, key) {
	    if (!integration(key)) return;
	    if (componentType(integrations[key]) === 'object') return;
	    if (has$2.call(integrations, key) && typeof providers[key] === 'boolean') return;
	    integrations[key] = value;
	  }, providers);

	  // move all toplevel options to msg
	  // and the rest to context.
	  each_1(function(value, key) {
	    if (includes_1(key, toplevel)) {
	      ret[key] = opts[key];
	    } else {
	      context[key] = opts[key];
	    }
	  }, opts);

	  // cleanup
	  delete msg.options;
	  ret.integrations = integrations;
	  ret.context = context;
	  ret = defaults_1(ret, msg);
	  if (!ret.eventId) {
	    ret.eventId = uuid_1.v4();
	  }
	  // debug('->', ret);
	  return ret;

	  function integration(name) {
	    return !!(includes_1(name, list) || name.toLowerCase() === 'all' || includes_1(name.toLowerCase(), lower));
	  }
	}

	/**
	 * Get the current page's canonical URL.
	 *
	 * @return {string|undefined}
	 */
	function canonical() {
	  var tags = document.getElementsByTagName('link');
	  // eslint-disable-next-line no-cond-assign
	  for (var i = 0, tag; tag = tags[i]; i++) {
	    if (tag.getAttribute('rel') === 'canonical') {
	      return tag.getAttribute('href');
	    }
	  }
	}

	/*
	 * Exports.
	 */

	var lib$7 = canonical;

	/*
	 * Module dependencies.
	 */





	/**
	 * Return a default `options.context.page` object.
	 *
	 * https://segment.com/docs/spec/page/#properties
	 *
	 * @return {Object}
	 */

	function pageDefaults() {
	  return {
	    path: canonicalPath(),
	    referrer: document.referrer,
	    search: location.search,
	    title: document.title,
	    url: canonicalUrl(location.search)
	  };
	}

	/**
	 * Return the canonical path for the page.
	 *
	 * @return {string}
	 */

	function canonicalPath() {
	  var canon = lib$7();
	  if (!canon) return window.location.pathname;
	  var parsed = componentUrl.parse(canon);
	  return parsed.pathname;
	}

	/**
	 * Return the canonical URL for the page concat the given `search`
	 * and strip the hash.
	 *
	 * @param {string} search
	 * @return {string}
	 */

	function canonicalUrl(search) {
	  var canon = lib$7();
	  if (canon) return includes_1('?', canon) ? canon : canon + search;
	  var url = window.location.href;
	  var i = url.indexOf('#');
	  return i === -1 ? url : url.slice(0, i);
	}

	/*
	 * Exports.
	 */

	var pageDefaults_1 = pageDefaults;

	var store = (function () {
		// Store.js
		var store = {},
			win = (typeof window != 'undefined' ? window : commonjsGlobal),
			doc = win.document,
			localStorageName = 'localStorage',
			scriptTag = 'script',
			storage;

		store.disabled = false;
		store.version = '1.3.20';
		store.set = function(key, value) {};
		store.get = function(key, defaultVal) {};
		store.has = function(key) { return store.get(key) !== undefined };
		store.remove = function(key) {};
		store.clear = function() {};
		store.transact = function(key, defaultVal, transactionFn) {
			if (transactionFn == null) {
				transactionFn = defaultVal;
				defaultVal = null;
			}
			if (defaultVal == null) {
				defaultVal = {};
			}
			var val = store.get(key, defaultVal);
			transactionFn(val);
			store.set(key, val);
		};
		store.getAll = function() {
			var ret = {};
			store.forEach(function(key, val) {
				ret[key] = val;
			});
			return ret
		};
		store.forEach = function() {};
		store.serialize = function(value) {
			return JSON.stringify(value)
		};
		store.deserialize = function(value) {
			if (typeof value != 'string') { return undefined }
			try { return JSON.parse(value) }
			catch(e) { return value || undefined }
		};

		// Functions to encapsulate questionable FireFox 3.6.13 behavior
		// when about.config::dom.storage.enabled === false
		// See https://github.com/marcuswestin/store.js/issues#issue/13
		function isLocalStorageNameSupported() {
			try { return (localStorageName in win && win[localStorageName]) }
			catch(err) { return false }
		}

		if (isLocalStorageNameSupported()) {
			storage = win[localStorageName];
			store.set = function(key, val) {
				if (val === undefined) { return store.remove(key) }
				storage.setItem(key, store.serialize(val));
				return val
			};
			store.get = function(key, defaultVal) {
				var val = store.deserialize(storage.getItem(key));
				return (val === undefined ? defaultVal : val)
			};
			store.remove = function(key) { storage.removeItem(key); };
			store.clear = function() { storage.clear(); };
			store.forEach = function(callback) {
				for (var i=0; i<storage.length; i++) {
					var key = storage.key(i);
					callback(key, store.get(key));
				}
			};
		} else if (doc && doc.documentElement.addBehavior) {
			var storageOwner,
				storageContainer;
			// Since #userData storage applies only to specific paths, we need to
			// somehow link our data to a specific path.  We choose /favicon.ico
			// as a pretty safe option, since all browsers already make a request to
			// this URL anyway and being a 404 will not hurt us here.  We wrap an
			// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
			// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
			// since the iframe access rules appear to allow direct access and
			// manipulation of the document element, even for a 404 page.  This
			// document can be used instead of the current document (which would
			// have been limited to the current path) to perform #userData storage.
			try {
				storageContainer = new ActiveXObject('htmlfile');
				storageContainer.open();
				storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>');
				storageContainer.close();
				storageOwner = storageContainer.w.frames[0].document;
				storage = storageOwner.createElement('div');
			} catch(e) {
				// somehow ActiveXObject instantiation failed (perhaps some special
				// security settings or otherwse), fall back to per-path storage
				storage = doc.createElement('div');
				storageOwner = doc.body;
			}
			var withIEStorage = function(storeFunction) {
				return function() {
					var args = Array.prototype.slice.call(arguments, 0);
					args.unshift(storage);
					// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
					// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
					storageOwner.appendChild(storage);
					storage.addBehavior('#default#userData');
					storage.load(localStorageName);
					var result = storeFunction.apply(store, args);
					storageOwner.removeChild(storage);
					return result
				}
			};

			// In IE7, keys cannot start with a digit or contain certain chars.
			// See https://github.com/marcuswestin/store.js/issues/40
			// See https://github.com/marcuswestin/store.js/issues/83
			var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
			var ieKeyFix = function(key) {
				return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
			};
			store.set = withIEStorage(function(storage, key, val) {
				key = ieKeyFix(key);
				if (val === undefined) { return store.remove(key) }
				storage.setAttribute(key, store.serialize(val));
				storage.save(localStorageName);
				return val
			});
			store.get = withIEStorage(function(storage, key, defaultVal) {
				key = ieKeyFix(key);
				var val = store.deserialize(storage.getAttribute(key));
				return (val === undefined ? defaultVal : val)
			});
			store.remove = withIEStorage(function(storage, key) {
				key = ieKeyFix(key);
				storage.removeAttribute(key);
				storage.save(localStorageName);
			});
			store.clear = withIEStorage(function(storage) {
				var attributes = storage.XMLDocument.documentElement.attributes;
				storage.load(localStorageName);
				for (var i=attributes.length-1; i>=0; i--) {
					storage.removeAttribute(attributes[i].name);
				}
				storage.save(localStorageName);
			});
			store.forEach = withIEStorage(function(storage, callback) {
				var attributes = storage.XMLDocument.documentElement.attributes;
				for (var i=0, attr; attr=attributes[i]; ++i) {
					callback(attr.name, store.deserialize(storage.getAttribute(attr.name)));
				}
			});
		}

		try {
			var testKey = '__storejs__';
			store.set(testKey, testKey);
			if (store.get(testKey) != testKey) { store.disabled = true; }
			store.remove(testKey);
		} catch(e) {
			store.disabled = true;
		}
		store.enabled = !store.disabled;
		
		return store
	}());

	/*
	 * Module dependencies.
	 */





	/**
	 * Initialize a new `Store` with `options`.
	 *
	 * @param {Object} options
	 */

	function Store(options) {
	  this.options(options);
	}

	/**
	 * Set the `options` for the store.
	 *
	 * @param {Object} options
	 *   @field {Boolean} enabled (true)
	 */

	Store.prototype.options = function(options) {
	  if (arguments.length === 0) return this._options;

	  options = options || {};
	  defaults_1(options, { enabled: true });

	  this.enabled = options.enabled && store.enabled;
	  this._options = options;
	};


	/**
	 * Set a `key` and `value` in local storage.
	 *
	 * @param {string} key
	 * @param {Object} value
	 */

	Store.prototype.set = function(key, value) {
	  if (!this.enabled) return false;
	  return store.set(key, value);
	};


	/**
	 * Get a value from local storage by `key`.
	 *
	 * @param {string} key
	 * @return {Object}
	 */

	Store.prototype.get = function(key) {
	  if (!this.enabled) return null;
	  return store.get(key);
	};


	/**
	 * Remove a value from local storage by `key`.
	 *
	 * @param {string} key
	 */

	Store.prototype.remove = function(key) {
	  if (!this.enabled) return false;
	  return store.remove(key);
	};


	/**
	 * Expose the store singleton.
	 */

	var store_1 = lib$5(new Store());


	/**
	 * Expose the `Store` constructor.
	 */

	var Store_1 = Store;
	store_1.Store = Store_1;

	/*
	 * Module Dependencies.
	 */




	/**
	 * HOP.
	 */

	var has$3 = Object.prototype.hasOwnProperty;

	/**
	 * Expose `Memory`
	 */

	var memory = lib$5(new Memory());

	/**
	 * Initialize `Memory` store
	 */

	function Memory() {
	  this.store = {};
	}

	/**
	 * Set a `key` and `value`.
	 *
	 * @param {String} key
	 * @param {Mixed} value
	 * @return {Boolean}
	 */

	Memory.prototype.set = function(key, value) {
	  this.store[key] = clone_1(value);
	  return true;
	};

	/**
	 * Get a `key`.
	 *
	 * @param {String} key
	 */

	Memory.prototype.get = function(key) {
	  if (!has$3.call(this.store, key)) return;
	  return clone_1(this.store[key]);
	};

	/**
	 * Remove a `key`.
	 *
	 * @param {String} key
	 * @return {Boolean}
	 */

	Memory.prototype.remove = function(key) {
	  delete this.store[key];
	  return true;
	};

	/*
	 * Module dependencies.
	 */

	// var clone = require('@ndhoule/clone');

	// var debug = require('debug')('analytics:entity');





	/**
	 * Expose `Entity`
	 */

	var entity = Entity;


	/**
	 * Initialize new `Entity` with `options`.
	 *
	 * @param {Object} options
	 */

	function Entity(options) {
	  this.options(options);
	  this.initialize();
	}

	/**
	 * Initialize picks the storage.
	 *
	 * Checks to see if cookies can be set
	 * otherwise fallsback to localStorage.
	 */

	Entity.prototype.initialize = function() {
	  cookie_1.set('ajs:cookies', true);

	  // cookies are enabled.
	  if (cookie_1.get('ajs:cookies')) {
	    cookie_1.remove('ajs:cookies');
	    this._storage = cookie_1;
	    return;
	  }

	  // localStorage is enabled.
	  if (store_1.enabled) {
	    this._storage = store_1;
	    return;
	  }

	  // fallback to memory storage.
	  // debug('warning using memory store both cookies and localStorage are disabled');
	  this._storage = memory;
	};

	/**
	 * Get the storage.
	 */

	Entity.prototype.storage = function() {
	  return this._storage;
	};


	/**
	 * Get or set storage `options`.
	 *
	 * @param {Object} options
	 *   @property {Object} cookie
	 *   @property {Object} localStorage
	 *   @property {Boolean} persist (default: `true`)
	 */

	Entity.prototype.options = function(options) {
	  if (arguments.length === 0) return this._options;
	  this._options = defaults_1(options || {}, this.defaults || {});
	};


	/**
	 * Get or set the entity's `id`.
	 *
	 * @param {String} id
	 */

	Entity.prototype.id = function(id) {
	  switch (arguments.length) {
	  case 0: return this._getId();
	  case 1: return this._setId(id);
	      // No default case
	  }
	};


	/**
	 * Get the entity's id.
	 *
	 * @return {String}
	 */

	Entity.prototype._getId = function() {
	  var ret = this._options.persist
	    ? this.storage().get(this._options.cookie.key)
	    : this._id;
	  return ret === undefined ? null : ret;
	};


	/**
	 * Set the entity's `id`.
	 *
	 * @param {String} id
	 */

	Entity.prototype._setId = function(id) {
	  if (this._options.persist) {
	    this.storage().set(this._options.cookie.key, id);
	  } else {
	    this._id = id;
	  }
	};


	/**
	 * Get or set the entity's `traits`.
	 *
	 * BACKWARDS COMPATIBILITY: aliased to `properties`
	 *
	 * @param {Object} traits
	 */

	Entity.prototype.properties = Entity.prototype.traits = function(traits) {
	  switch (arguments.length) {
	  case 0: return this._getTraits();
	  case 1: return this._setTraits(traits);
	      // No default case
	  }
	};


	/**
	 * Get the entity's traits.
	 * !!! NO ISO DATE as the original analytics.js does. All values shall be string.
	 * !!! NO DEEP CLONE as the orginal analytics.js does. All values shall be shallow;
	 *
	 * @return {Object}
	 */

	Entity.prototype._getTraits = function() {
	  // var ret = this._options.persist ? store.get(this._options.localStorage.key) : this._traits;
	  var ret = this._traits;
	  return Object.assign({}, ret);
	};


	/**
	 * Set the entity's `traits`.
	 *
	 * @param {Object} traits
	 */

	Entity.prototype._setTraits = function(traits) {
	  traits = traits || {};
	  // if (this._options.persist) {
	  //   store.set(this._options.localStorage.key, traits);
	  // } else {
	    this._traits = traits;
	  // }
	};


	/**
	 * Identify the entity with an `id` and `traits`. If we it's the same entity,
	 * extend the existing `traits` instead of overwriting.
	 *
	 * @param {String} id
	 * @param {Object} traits
	 */

	Entity.prototype.identify = function(id, traits) {
	  traits = traits || {};
	  var current = this.id();
	  if (current === null || current === id) traits = extend(this.traits(), traits);
	  if (id) this.id(id);
	  // this.debug('identify %o, %o', id, traits);
	  this.traits(traits);
	  this.save();
	};


	/**
	 * Save the entity to local storage and the cookie.
	 *
	 * @return {Boolean}
	 */

	Entity.prototype.save = function() {
	  if (!this._options.persist) return false;
	  cookie_1.set(this._options.cookie.key, this.id());
	  store_1.set(this._options.localStorage.key, this.traits());
	  return true;
	};


	// /**
	//  * Log the entity out, reseting `id` and `traits` to defaults.
	//  */

	// Entity.prototype.logout = function() {
	//   this.id(null);
	//   this.traits({});
	//   cookie.remove(this._options.cookie.key);
	//   store.remove(this._options.localStorage.key);
	// };


	// /**
	//  * Reset all entity state, logging out and returning options to defaults.
	//  */

	// Entity.prototype.reset = function() {
	//   this.logout();
	//   this.options({});
	// };


	/**
	 * Load saved entity `id` or `traits` from storage.
	 */

	Entity.prototype.load = function() {
	  this.id(cookie_1.get(this._options.cookie.key));
	  this.traits(store_1.get(this._options.localStorage.key));
	};

	/*
	 * Module dependencies.
	 */



	// var cookie = require('./cookie');
	// var debug = require('debug')('analytics:user');

	// var rawCookie = require('@lattebank/analytics.js-component-cookie');


	/**
	 * User defaults
	 */

	User.defaults = {
	  persist: true,
	  cookie: {
	    key: 'ajs_user_id',
	  },
	  localStorage: {
	    key: 'ajs_user_traits'
	  }
	};


	/**
	 * Initialize a new `User` with `options`.
	 *
	 * @param {Object} options
	 */

	function User(options) {
	  this.defaults = User.defaults;
	  // this.debug = debug;
	  entity.call(this, options);
	}


	/**
	 * Inherit `Entity`
	 */

	inherits_browser(User, entity);

	/**
	 * Set/get the user id.
	 *
	 * When the user id changes, the method will reset his anonymousId to a new one.
	 *
	 * // FIXME: What are the mixed types?
	 * @param {string} id
	 * @return {Mixed}
	 * @example
	 * // didn't change because the user didn't have previous id.
	 * anonymousId = user.anonymousId();
	 * user.id('foo');
	 * assert.equal(anonymousId, user.anonymousId());
	 *
	 * // didn't change because the user id changed to null.
	 * anonymousId = user.anonymousId();
	 * user.id('foo');
	 * user.id(null);
	 * assert.equal(anonymousId, user.anonymousId());
	 *
	 * // change because the user had previous id.
	 * anonymousId = user.anonymousId();
	 * user.id('foo');
	 * user.id('baz'); // triggers change
	 * user.id('baz'); // no change
	 * assert.notEqual(anonymousId, user.anonymousId());
	 */

	User.prototype.id = function(id) {
	  var prev = this._getId();
	  var ret = entity.prototype.id.apply(this, arguments);
	  if (prev == null) return ret;
	  // FIXME: We're relying on coercion here (1 == "1"), but our API treats these
	  // two values differently. Figure out what will break if we remove this and
	  // change to strict equality
	  /* eslint-disable eqeqeq */
	  if (prev != id && id) this.anonymousId(null);
	  /* eslint-enable eqeqeq */
	  return ret;
	};

	/**
	 * Set / get / remove anonymousId.
	 *
	 * @param {String} anonymousId
	 * @return {String|User}
	 */

	User.prototype.anonymousId = function(anonymousId) {
	  var store = this.storage();

	  // set / remove
	  if (arguments.length) {
	    store.set('ajs_anonymous_id', anonymousId);
	    return this;
	  }

	  // new
	  anonymousId = store.get('ajs_anonymous_id');
	  if (anonymousId) {
	    return anonymousId;
	  }

	  // // old - it is not stringified so we use the raw cookie.
	  // anonymousId = rawCookie('_sio');
	  // if (anonymousId) {
	  //   anonymousId = anonymousId.split('----')[0];
	  //   store.set('ajs_anonymous_id', anonymousId);
	  //   store.remove('_sio');
	  //   return anonymousId;
	  // }

	  // empty
	  anonymousId = uuid_1.v4();
	  store.set('ajs_anonymous_id', anonymousId);
	  return store.get('ajs_anonymous_id');
	};

	// /**
	//  * Remove anonymous id on logout too.
	//  */

	// User.prototype.logout = function() {
	//   Entity.prototype.logout.call(this);
	//   this.anonymousId(null);
	// };

	/**
	 * Load saved user `id` or `traits` from storage.
	 */

	User.prototype.load = function() {
	  entity.prototype.load.call(this);
	};


	/**
	 * Expose the user singleton.
	 */

	var user = lib$5(new User());


	/**
	 * Expose the `User` constructor.
	 */

	var User_1 = User;
	user.User = User_1;

	// var _analytics = global.analytics;

	/*
	 * Module dependencies.
	 */

	// var Alias = require('@lattebank/analytics.js-facade').Alias;

	// var Group = require('@lattebank/analytics.js-facade').Group;
	var Identify$1 = lib$4.Identify;
	var Page$1 = lib$4.Page;
	var Track$1 = lib$4.Track;





	// var debug = require('debug');


	// var foldl = require('@ndhoule/foldl');
	// var group = require('./group');

	// var isMeta = require('@segment/is-meta');

	// var memory = require('./memory');
	// var nextTick = require('next-tick');

	// var on = require('component-event').bind;

	// var pick = require('@ndhoule/pick');
	// var prevent = require('@segment/prevent-default');
	// var querystring = require('component-querystring');




	/**
	 * Initialize a new `Analytics` instance.
	 */

	function Analytics() {
	  this._options({});
	  this.Integrations = {};
	  this._integrations = {};
	  this._readied = false;
	  this._timeout = 300;
	  // this.log = debug('analytics.js');
	  lib$5(this);

	  // var self = this;
	  // this.on('initialize', function(settings, options) {
	  //   if (options.initialPageview) self.page();
	  //   self._parseQuery(window.location.search);
	  // });
	}

	/**
	 * Mix in event emitter.
	 */

	componentEmitter(Analytics.prototype);

	/**
	 * Use a `plugin`.
	 *
	 * @param {Function} plugin
	 * @return {Analytics}
	 */

	Analytics.prototype.use = function(plugin) {
	  plugin(this);
	  return this;
	};

	/**
	 * Define a new `Integration`.
	 *
	 * @param {Function} Integration
	 * @return {Analytics}
	 */

	Analytics.prototype.addIntegration = function(Integration) {
	  var name = Integration.prototype.name;
	  if (!name) throw new TypeError('attempted to add an invalid integration');
	  this.Integrations[name] = Integration;
	  return this;
	};

	/**
	 * Initialize with the given integration `settings` and `options`.
	 *
	 * Aliased to `init` for convenience.
	 *
	 * @param {Object} [settings={}]
	 * @param {Object} [options={}]
	 * @return {Analytics}
	 */

	Analytics.prototype.init = Analytics.prototype.initialize = function(settings, options) {
	  settings = settings || {};
	  options = options || {};

	  this._options(options);
	  this._readied = false;

	  // clean unknown integrations from settings
	  var self = this;
	  each_1(function(opts, name) {
	    var Integration = self.Integrations[name];
	    if (!Integration) delete settings[name];
	  }, settings);

	  // add integrations
	  each_1(function(opts, name) {
	    var Integration = self.Integrations[name];
	    var clonedOpts = {};
	    extend(true, clonedOpts, opts); // deep clone opts
	    var integration = new Integration(clonedOpts);
	    // self.log('initialize %o - %o', name, opts);
	    self.add(integration);
	  }, settings);

	  var integrations = this._integrations;

	  // load user now that options are set
	  user.load();
	//   group.load();

	  // make ready callback
	  var integrationCount = keys_1(integrations).length;
	  var ready = after_1(integrationCount, function() {
	    self._readied = true;
	    self.emit('ready');
	  });

	  // init if no integrations
	  if (integrationCount <= 0) {
	    ready();
	  }

	  // initialize integrations, passing ready
	  // create a list of any integrations that did not initialize - this will be passed with all events for replay support:
	  this.failedInitializations = [];
	  each_1(function(integration) {
	    if (options.initialPageview && integration.options.initialPageview === false) {
	      integration.page = after_1(2, integration.page);
	    }

	    integration.analytics = self;
	    integration.once('ready', ready);
	    try {
	      integration.initialize();
	    } catch (e) {
	      var integrationName = integration.name;
	      self.failedInitializations.push(integrationName);
	      self.log('Error initializing %s integration: %o', integrationName, e);
	      // Mark integration as ready to prevent blocking of anyone listening to analytics.ready()
	      integration.ready();
	    }
	  }, integrations);

	  this.emit('initialize', settings, options);
	  return this;
	};

	/**
	 * Set the user's `id`.
	 *
	 * @param {Mixed} id
	 */

	Analytics.prototype.setAnonymousId = function(id) {
	  this.user().anonymousId(id);
	  return this;
	};

	/**
	 * Add an integration.
	 *
	 * @param {Integration} integration
	 */

	Analytics.prototype.add = function(integration) {
	  this._integrations[integration.name] = integration;
	  return this;
	};

	/**
	 * Identify a user by optional `id` and `traits`.
	 *
	 * @param {string} [id=user.id()] User ID.
	 * @param {Object} [traits=null] User traits.
	 * @param {Object} [options=null]
	 * @param {Function} [fn]
	 * @return {Analytics}
	 */

	Analytics.prototype.identify = function(id, traits, options, fn) {
	  // Argument reshuffling.
	  /* eslint-disable no-unused-expressions, no-sequences */
	  if (is_1.fn(options)) fn = options, options = null;
	  if (is_1.fn(traits)) fn = traits, options = null, traits = null;
	  if (is_1.object(id)) options = traits, traits = id, id = user.id();
	  /* eslint-enable no-unused-expressions, no-sequences */

	  // clone traits before we manipulate so we don't do anything uncouth, and take
	  // from `user` so that we carryover anonymous traits
	  user.identify(id, traits);

	  var msg = this.normalize({
	    options: options,
	    traits: user.traits(),
	    userId: user.id()
	  });

	  this._invoke('identify', new Identify$1(msg));

	  // emit
	  this.emit('identify', id, traits, options);
	  this._callback(fn);
	  return this;
	};

	/**
	 * Return the current user.
	 *
	 * @return {Object}
	 */

	Analytics.prototype.user = function() {
	  return user;
	};

	// /**
	//  * Identify a group by optional `id` and `traits`. Or, if no arguments are
	//  * supplied, return the current group.
	//  *
	//  * @param {string} [id=group.id()] Group ID.
	//  * @param {Object} [traits=null] Group traits.
	//  * @param {Object} [options=null]
	//  * @param {Function} [fn]
	//  * @return {Analytics|Object}
	//  */

	// Analytics.prototype.group = function(id, traits, options, fn) {
	//   /* eslint-disable no-unused-expressions, no-sequences */
	//   if (!arguments.length) return group;
	//   if (is.fn(options)) fn = options, options = null;
	//   if (is.fn(traits)) fn = traits, options = null, traits = null;
	//   if (is.object(id)) options = traits, traits = id, id = group.id();
	//   /* eslint-enable no-unused-expressions, no-sequences */


	//   // grab from group again to make sure we're taking from the source
	//   group.identify(id, traits);

	//   var msg = this.normalize({
	//     options: options,
	//     traits: group.traits(),
	//     groupId: group.id()
	//   });

	//   this._invoke('group', new Group(msg));

	//   this.emit('group', id, traits, options);
	//   this._callback(fn);
	//   return this;
	// };

	/**
	 * Track an `event` that a user has triggered with optional `properties`.
	 *
	 * @param {string} event
	 * @param {Object} [properties=null]
	 * @param {Object} [options=null]
	 * @param {Function} [fn]
	 * @return {Analytics}
	 */

	Analytics.prototype.track = function(event, properties, options, fn) {
	  // Argument reshuffling.
	  /* eslint-disable no-unused-expressions, no-sequences */
	  if (is_1.fn(options)) fn = options, options = null;
	  if (is_1.fn(properties)) fn = properties, options = null, properties = null;
	  /* eslint-enable no-unused-expressions, no-sequences */

	  // figure out if the event is archived.
	  var plan = this.options.plan || {};
	  var events = plan.track || {};

	  // normalize
	  var msg = this.normalize({
	    properties: properties,
	    options: options,
	    event: event
	  });

	  // plan.
	  plan = events[event];
	  if (plan) {
	    // this.log('plan %o - %o', event, plan);
	    if (plan.enabled === false) {
	      // Disabled events should always be sent to Segment.
	      defaults_1(msg.integrations, { All: false, 'Segment.io': true });
	    } else {
	      defaults_1(msg.integrations, plan.integrations || {});
	    }
	  } else {
	    var defaultPlan = events.__default || { enabled: true };
	    if (!defaultPlan.enabled) {
	      // Disabled events should always be sent to Segment.
	      defaults_1(msg.integrations, { All: false, 'Segment.io': true });
	    }
	  }

	  this._invoke('track', new Track$1(msg));

	  this.emit('track', event, properties, options);
	  this._callback(fn);
	  return this;
	};

	/**
	 * Log an `exception` by the developer.
	 * Copied from Track
	 *
	 * @param {string} event
	 * @param {Object} [properties=null]
	 * @param {Object} [options=null]
	 * @param {Function} [fn]
	 * @return {Analytics}
	 */

	Analytics.prototype.exception = function(event, properties, options, fn) {
	  // Argument reshuffling.
	  /* eslint-disable no-unused-expressions, no-sequences */
	  if (is_1.fn(options)) fn = options, options = null;
	  if (is_1.fn(properties)) fn = properties, options = null, properties = null;
	  /* eslint-enable no-unused-expressions, no-sequences */

	  // Error.hasOwnProperty('name') === false;
	  if (properties instanceof Error) {
	    var error = {};
	    if (properties.name) {
	      error.name = properties.name;
	    }
	    if (properties.code) {
	      error.code = properties.code;
	    }
	    if (properties.message) {
	      error.message = properties.message;
	    }
	    if (properties.stack) {
	      error.stack = properties.stack;
	    }
	    properties = error;
	  }

	  // figure out if the event is archived.
	  var plan = this.options.plan || {};
	  var events = plan.track || {};

	  // normalize
	  var msg = this.normalize({
	    properties: properties,
	    options: options,
	    event: event
	  });

	  // plan.
	  plan = events[event];
	  if (plan) {
	    // this.log('plan %o - %o', event, plan);
	    if (plan.enabled === false) return this._callback(fn);
	    defaults_1(msg.integrations, plan.integrations || {});
	  }

	  this._invoke('exception', new Track$1(msg));

	  this.emit('exception', event, properties, options);
	  this._callback(fn);
	  return this;
	};

	/**
	 * Trigger a pageview, labeling the current page with an optional `category`,
	 * `name` and `properties`.
	 *
	 * @param {string} [category]
	 * @param {string} [name]
	 * @param {Object|string} [properties] (or path)
	 * @param {Object} [options]
	 * @param {Function} [fn]
	 * @return {Analytics}
	 */

	Analytics.prototype.page = function(category, name, properties, options, fn) {
	  // Argument reshuffling.
	  /* eslint-disable no-unused-expressions, no-sequences */
	  if (is_1.fn(options)) fn = options, options = null;
	  if (is_1.fn(properties)) fn = properties, options = properties = null;
	  if (is_1.fn(name)) fn = name, options = properties = name = null;
	  if (componentType(category) === 'object') options = name, properties = category, name = category = null;
	  if (componentType(name) === 'object') options = properties, properties = name, name = null;
	  if (componentType(category) === 'string' && componentType(name) !== 'string') name = category, category = null;
	  /* eslint-enable no-unused-expressions, no-sequences */

	  properties = clone_1(properties) || {};
	  if (name) properties.name = name;
	  if (category) properties.category = category;

	  // Ensure properties has baseline spec properties.
	  // TODO: Eventually move these entirely to `options.context.page`
	  var defs = pageDefaults_1();
	  defaults_1(properties, defs);

	  // // Mirror user overrides to `options.context.page` (but exclude custom properties)
	  // // (Any page defaults get applied in `this.normalize` for consistency.)
	  // // Weird, yeah--moving special props to `context.page` will fix this in the long term.
	  // var overrides = pick(keys(defs), properties);
	  // if (!is.empty(overrides)) {
	  //   options = options || {};
	  //   options.context = options.context || {};
	  //   options.context.page = overrides;
	  // }

	  var msg = this.normalize({
	    properties: properties,
	    category: category,
	    options: options,
	    name: name
	  });

	  this._invoke('page', new Page$1(msg));

	  this.emit('page', category, name, properties, options);
	  this._callback(fn);
	  return this;
	};

	// /**
	//  * Merge two previously unassociated user identities.
	//  *
	//  * @param {string} to
	//  * @param {string} from (optional)
	//  * @param {Object} options (optional)
	//  * @param {Function} fn (optional)
	//  * @return {Analytics}
	//  */

	// Analytics.prototype.alias = function(to, from, options, fn) {
	//   // Argument reshuffling.
	//   /* eslint-disable no-unused-expressions, no-sequences */
	//   if (is.fn(options)) fn = options, options = null;
	//   if (is.fn(from)) fn = from, options = null, from = null;
	//   if (is.object(from)) options = from, from = null;
	//   /* eslint-enable no-unused-expressions, no-sequences */

	//   var msg = this.normalize({
	//     options: options,
	//     previousId: from,
	//     userId: to
	//   });

	//   this._invoke('alias', new Alias(msg));

	//   this.emit('alias', to, from, options);
	//   this._callback(fn);
	//   return this;
	// };

	/**
	 * Register a `fn` to be fired when all the analytics services are ready.
	 *
	 * @param {Function} fn
	 * @return {Analytics}
	 */

	Analytics.prototype.ready = function(fn) {
	  if (is_1.fn(fn)) {
	    if (this._readied) {
	      nextTick(fn);
	    } else {
	      this.once('ready', fn);
	    }
	  }
	  return this;
	};

	// /**
	//  * Set the `timeout` (in milliseconds) used for callbacks.
	//  *
	//  * @param {Number} timeout
	//  */

	// Analytics.prototype.timeout = function(timeout) {
	//   this._timeout = timeout;
	// };

	// /**
	//  * Enable or disable debug.
	//  *
	//  * @param {string|boolean} str
	//  */

	// Analytics.prototype.debug = function(str) {
	//   if (!arguments.length || str) {
	//     debug.enable('analytics:' + (str || '*'));
	//   } else {
	//     debug.disable();
	//   }
	// };

	/**
	 * Apply options.
	 *
	 * @param {Object} options
	 * @return {Analytics}
	 * @api private
	 */

	Analytics.prototype._options = function(options) {
	  options = options || {};
	  this.options = options;
	  cookie_1.options(options.cookie);
	  store_1.options(options.localStorage);
	  user.options(options.user);
	  // group.options(options.group);
	  return this;
	};

	/**
	 * Callback a `fn` after our defined timeout period.
	 *
	 * @param {Function} fn
	 * @return {Analytics}
	 * @api private
	 */

	Analytics.prototype._callback = function(fn) {
	  if (is_1.fn(fn)) {
	    this._timeout ? setTimeout(fn, this._timeout) : nextTick(fn);
	  }
	  return this;
	};

	/**
	 * Call `method` with `facade` on all enabled integrations.
	 *
	 * @param {string} method
	 * @param {Facade} facade
	 * @return {Analytics}
	 * @api private
	 */

	Analytics.prototype._invoke = function(method, facade) {
	  var self = this;
	  this.emit('invoke', facade);

	  var failedInitializations = self.failedInitializations || [];
	  each_1(function(integration, name) {
	    if (!facade.enabled(name)) return;
	    // Check if an integration failed to initialize.
	    // If so, do not process the message as the integration is in an unstable state.
	    if (failedInitializations.indexOf(name) >= 0) {
	      self.log('Skipping invokation of .%s method of %s integration. Integation failed to initialize properly.', method, name);
	    } else {
	      try {
	        integration.invoke.call(integration, method, facade);
	      } catch (e) {
	        self.log('Error invoking .%s method of %s integration: %o', method, name, e);
	      }
	    }
	  }, this._integrations);

	  return this;
	};

	// /**
	//  * Push `args`.
	//  *
	//  * @param {Array} args
	//  * @api private
	//  */

	// Analytics.prototype.push = function(args) {
	//   var method = args.shift();
	//   if (!this[method]) return;
	//   this[method].apply(this, args);
	// };

	// /**
	//  * Reset group and user traits and id's.
	//  *
	//  * @api public
	//  */

	// Analytics.prototype.reset = function() {
	//   this.user().logout();
	//   this.group().logout();
	// };

	// /**
	//  * Parse the query string for callable methods.
	//  *
	//  * @param {String} query
	//  * @return {Analytics}
	//  * @api private
	//  */

	// Analytics.prototype._parseQuery = function(query) {
	//   // Parse querystring to an object
	//   var q = querystring.parse(query);
	//   // Create traits and properties objects, populate from querysting params
	//   var traits = pickPrefix('ajs_trait_', q);
	//   var props = pickPrefix('ajs_prop_', q);
	//   // Trigger based on callable parameters in the URL
	//   if (q.ajs_uid) this.identify(q.ajs_uid, traits);
	//   if (q.ajs_event) this.track(q.ajs_event, props);
	//   if (q.ajs_aid) user.anonymousId(q.ajs_aid);
	//   return this;

	//   /**
	//    * Create a shallow copy of an input object containing only the properties
	//    * whose keys are specified by a prefix, stripped of that prefix
	//    *
	//    * @param {String} prefix
	//    * @param {Object} object
	//    * @return {Object}
	//    * @api private
	//    */

	//   function pickPrefix(prefix, object) {
	//     var length = prefix.length;
	//     var sub;
	//     return foldl(function(acc, val, key) {
	//       if (key.substr(0, length) === prefix) {
	//         sub = key.substr(length);
	//         acc[sub] = val;
	//       }
	//       return acc;
	//     }, {}, object);
	//   }
	// };

	/**
	 * Normalize the given `msg`.
	 *
	 * @param {Object} msg
	 * @return {Object}
	 */

	Analytics.prototype.normalize = function(msg) {
	  msg = normalize_1(msg, keys_1(this._integrations));
	  if (msg.anonymousId) user.anonymousId(msg.anonymousId);
	  msg.anonymousId = user.anonymousId();

	  // Ensure all outgoing requests include page data in their contexts.
	  msg.context.page = defaults_1(msg.context.page || {}, pageDefaults_1());

	  return msg;
	};

	// /**
	//  * No conflict support.
	//  */

	// Analytics.prototype.noConflict = function() {
	//   window.analytics = _analytics;
	//   return this;
	// };

	/*
	 * Exports.
	 */

	var analytics = Analytics;
	// module.exports.cookie = cookie;
	// module.exports.memory = memory;
	// module.exports.store = store;
	var uuid$1 = uuid_1.v4;
	analytics.uuid = uuid$1;

	/*
	 * Module dependencies.
	 */



	/**
	 * Check if a predicate function returns `true` for all values in a `collection`.
	 * Checks owned, enumerable values and exits early when `predicate` returns
	 * `false`.
	 *
	 * @name every
	 * @param {Function} predicate The function used to test values.
	 * @param {Array|Object|string} collection The collection to search.
	 * @return {boolean} True if all values passes the predicate test, otherwise false.
	 * @example
	 * var isEven = function(num) { return num % 2 === 0; };
	 *
	 * every(isEven, []); // => true
	 * every(isEven, [1, 2]); // => false
	 * every(isEven, [2, 4, 6]); // => true
	 */
	var every = function every(predicate, collection) {
	  if (typeof predicate !== 'function') {
	    throw new TypeError('`predicate` must be a function but was a ' + typeof predicate);
	  }

	  var result = true;

	  each_1(function(val, key, collection) {
	    result = !!predicate(val, key, collection);

	    // Exit early
	    if (!result) {
	      return false;
	    }
	  }, collection);

	  return result;
	};

	/*
	 * Exports.
	 */

	var every_1 = every;

	// Stringifier
	var toString$1 = commonjsGlobal.JSON && typeof JSON.stringify === 'function' ? JSON.stringify : String;

	/**
	 * Format the given `str`.
	 *
	 * @param {string} str
	 * @param {...*} [args]
	 * @return {string}
	 */
	function fmt(str) {
	  var args = Array.prototype.slice.call(arguments, 1);
	  var j = 0;

	  return str.replace(/%([a-z])/gi, function(match, f) {
	    return fmt[f] ? fmt[f](args[j++]) : match + f;
	  });
	}

	// Formatters
	fmt.o = toString$1;
	fmt.s = String;
	fmt.d = parseInt;

	/*
	 * Exports.
	 */

	var lib$8 = fmt;

	/*
	 * Module dependencies.
	 */



	/**
	 * Reduces all the values in a collection down into a single value. Does so by iterating through the
	 * collection from left to right, repeatedly calling an `iterator` function and passing to it four
	 * arguments: `(accumulator, value, index, collection)`.
	 *
	 * Returns the final return value of the `iterator` function.
	 *
	 * @name foldl
	 * @api public
	 * @param {Function} iterator The function to invoke per iteration.
	 * @param {*} accumulator The initial accumulator value, passed to the first invocation of `iterator`.
	 * @param {Array|Object} collection The collection to iterate over.
	 * @return {*} The return value of the final call to `iterator`.
	 * @example
	 * foldl(function(total, n) {
	 *   return total + n;
	 * }, 0, [1, 2, 3]);
	 * //=> 6
	 *
	 * var phonebook = { bob: '555-111-2345', tim: '655-222-6789', sheila: '655-333-1298' };
	 *
	 * foldl(function(results, phoneNumber) {
	 *  if (phoneNumber[0] === '6') {
	 *    return results.concat(phoneNumber);
	 *  }
	 *  return results;
	 * }, [], phonebook);
	 * // => ['655-222-6789', '655-333-1298']
	 */
	var foldl = function foldl(iterator, accumulator, collection) {
	  if (typeof iterator !== 'function') {
	    throw new TypeError('Expected a function but received a ' + typeof iterator);
	  }

	  each_1(function(val, i, collection) {
	    accumulator = iterator(accumulator, val, i, collection);
	  }, collection);

	  return accumulator;
	};

	/*
	 * Exports.
	 */

	var foldl_1 = foldl;

	// https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html

	/**
	 * Invoke `fn(err)` when the given `el` script loads.
	 *
	 * @param {Element} el
	 * @param {Function} fn
	 * @api public
	 */

	var scriptOnload = function(el, fn){
	  return el.addEventListener
	    ? add(el, fn)
	    : attach(el, fn);
	};

	/**
	 * Add event listener to `el`, `fn()`.
	 *
	 * @param {Element} el
	 * @param {Function} fn
	 * @api private
	 */

	function add(el, fn){
	  el.addEventListener('load', function(_, e){ fn(null, e); }, false);
	  el.addEventListener('error', function(e){
	    var err = new Error('script error "' + el.src + '"');
	    err.event = e;
	    fn(err);
	  }, false);
	}

	/**
	 * Attach event.
	 *
	 * @param {Element} el
	 * @param {Function} fn
	 * @api private
	 */

	function attach(el, fn){
	  el.attachEvent('onreadystatechange', function(e){
	    if (!/complete|loaded/.test(el.readyState)) return;
	    fn(null, e);
	  });
	  el.attachEvent('onerror', function(e){
	    var err = new Error('failed to load the script "' + el.src + '"');
	    err.event = e || window.event;
	    fn(err);
	  });
	}

	var callable, byObserver;

	callable = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};

	byObserver = function (Observer) {
		var node = document.createTextNode(''), queue, i = 0;
		new Observer(function () {
			var data;
			if (!queue) return;
			data = queue;
			queue = null;
			if (typeof data === 'function') {
				data();
				return;
			}
			data.forEach(function (fn) { fn(); });
		}).observe(node, { characterData: true });
		return function (fn) {
			callable(fn);
			if (queue) {
				if (typeof queue === 'function') queue = [queue, fn];
				else queue.push(fn);
				return;
			}
			queue = fn;
			node.data = (i = ++i % 2);
		};
	};

	var nextTick$1 = (function () {
		// Node.js
		if ((typeof process !== 'undefined') && process &&
				(typeof process.nextTick === 'function')) {
			return process.nextTick;
		}

		// MutationObserver=
		if ((typeof document === 'object') && document) {
			if (typeof MutationObserver === 'function') {
				return byObserver(MutationObserver);
			}
			if (typeof WebKitMutationObserver === 'function') {
				return byObserver(WebKitMutationObserver);
			}
		}

		// W3C Draft
		// http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
		if (typeof setImmediate === 'function') {
			return function (cb) { setImmediate(callable(cb)); };
		}

		// Wide available standard
		if (typeof setTimeout === 'function') {
			return function (cb) { setTimeout(callable(cb), 0); };
		}

		return null;
	}());

	/**
	 * Module dependencies.
	 */





	/**
	 * Expose `loadScript`.
	 *
	 * @param {Object} options
	 * @param {Function} fn
	 * @api public
	 */

	var loadIframe = function loadIframe(options, fn){
	  if (!options) throw new Error('Cant load nothing...');

	  // Allow for the simplest case, just passing a `src` string.
	  if (is_1.string(options)) options = { src : options };

	  var https = document.location.protocol === 'https:' ||
	              document.location.protocol === 'chrome-extension:';

	  // If you use protocol relative URLs, third-party scripts like Google
	  // Analytics break when testing with `file:` so this fixes that.
	  if (options.src && options.src.indexOf('//') === 0) {
	    options.src = https ? 'https:' + options.src : 'http:' + options.src;
	  }

	  // Allow them to pass in different URLs depending on the protocol.
	  if (https && options.https) options.src = options.https;
	  else if (!https && options.http) options.src = options.http;

	  // Make the `<iframe>` element and insert it before the first iframe on the
	  // page, which is guaranteed to exist since this Javaiframe is running.
	  var iframe = document.createElement('iframe');
	  iframe.src = options.src;
	  iframe.width = options.width || 1;
	  iframe.height = options.height || 1;
	  iframe.style.display = 'none';

	  // If we have a fn, attach event handlers, even in IE. Based off of
	  // the Third-Party Javascript script loading example:
	  // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
	  if (is_1.fn(fn)) {
	    scriptOnload(iframe, fn);
	  }

	  nextTick$1(function(){
	    // Append after event listeners are attached for IE.
	    var firstScript = document.getElementsByTagName('script')[0];
	    firstScript.parentNode.insertBefore(iframe, firstScript);
	  });

	  // Return the iframe element in case they want to do anything special, like
	  // give it an ID or attributes.
	  return iframe;
	};

	/*
	 * Module dependencies.
	 */





	/**
	 * Loads a script asynchronously.
	 *
	 * @param {Object} options
	 * @param {Function} cb
	 */
	function loadScript(options, cb) {
	  if (!options) {
	    throw new Error('Can\'t load nothing...');
	  }

	  // Allow for the simplest case, just passing a `src` string.
	  if (componentType(options) === 'string') {
	    options = { src : options };
	  }

	  var https = document.location.protocol === 'https:' || document.location.protocol === 'chrome-extension:';

	  // If you use protocol relative URLs, third-party scripts like Google
	  // Analytics break when testing with `file:` so this fixes that.
	  if (options.src && options.src.indexOf('//') === 0) {
	    options.src = (https ? 'https:' : 'http:') + options.src;
	  }

	  // Allow them to pass in different URLs depending on the protocol.
	  if (https && options.https) {
	    options.src = options.https;
	  } else if (!https && options.http) {
	    options.src = options.http;
	  }

	  // Make the `<script>` element and insert it before the first script on the
	  // page, which is guaranteed to exist since this Javascript is running.
	  var script = document.createElement('script');
	  script.type = 'text/javascript';
	  script.async = true;
	  script.src = options.src;

	  // If we have a cb, attach event handlers. Does not work on < IE9 because
	  // older browser versions don't register element.onerror
	  if (componentType(cb) === 'function') {
	    scriptOnload(script, cb);
	  }

	  nextTick$1(function() {
	    // Append after event listeners are attached for IE.
	    var firstScript = document.getElementsByTagName('script')[0];
	    firstScript.parentNode.insertBefore(script, firstScript);
	  });

	  // Return the script element in case they want to do anything special, like
	  // give it an ID or attributes.
	  return script;
	}

	/*
	 * Exports.
	 */

	var loadScript_1 = loadScript;

	/**
	 * Expose `toNoCase`.
	 */

	var toNoCase_1 = toNoCase;


	/**
	 * Test whether a string is camel-case.
	 */

	var hasSpace = /\s/;
	var hasSeparator = /[\W_]/;


	/**
	 * Remove any starting case from a `string`, like camel or snake, but keep
	 * spaces and punctuation that may be important otherwise.
	 *
	 * @param {String} string
	 * @return {String}
	 */

	function toNoCase (string) {
	  if (hasSpace.test(string)) return string.toLowerCase();
	  if (hasSeparator.test(string)) return (unseparate(string) || string).toLowerCase();
	  return uncamelize(string).toLowerCase();
	}


	/**
	 * Separator splitter.
	 */

	var separatorSplitter = /[\W_]+(.|$)/g;


	/**
	 * Un-separate a `string`.
	 *
	 * @param {String} string
	 * @return {String}
	 */

	function unseparate (string) {
	  return string.replace(separatorSplitter, function (m, next) {
	    return next ? ' ' + next : '';
	  });
	}


	/**
	 * Camelcase splitter.
	 */

	var camelSplitter = /(.)([A-Z]+)/g;


	/**
	 * Un-camelcase a `string`.
	 *
	 * @param {String} string
	 * @return {String}
	 */

	function uncamelize (string) {
	  return string.replace(camelSplitter, function (m, previous, uppers) {
	    return previous + ' ' + uppers.toLowerCase().split('').join(' ');
	  });
	}

	var protos = createCommonjsModule(function (module, exports) {

	/**
	 * Module dependencies.
	 */



	// var events = require('analytics-events');









	/**
	 * hasOwnProperty reference.
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * No operation.
	 */

	var noop = function noop() {};

	/**
	 * Window defaults.
	 */

	var onerror = window.onerror;
	var onload = null;

	/**
	 * Mixin emitter.
	 */

	/* eslint-disable new-cap */
	componentEmitter(exports);
	/* eslint-enable new-cap */

	/**
	 * Initialize.
	 */

	exports.initialize = function () {
	  var ready = this.ready;
	  nextTick$1(ready);
	};

	/**
	 * Loaded?
	 *
	 * @api private
	 * @return {boolean}
	 */

	exports.loaded = function () {
	  return false;
	};

	/**
	 * Page.
	 *
	 * @api public
	 * @param {Page} page
	 */

	/* eslint-disable no-unused-vars */
	exports.page = function (page) {};
	/* eslint-enable no-unused-vars */

	/**
	 * Track.
	 *
	 * @api public
	 * @param {Track} track
	 */

	/* eslint-disable no-unused-vars */
	exports.track = function (track) {};
	/* eslint-enable no-unused-vars */

	/**
	 * Get values from items in `options` that are mapped to `key`.
	 * `options` is an integration setting which is a collection
	 * of type 'map', 'array', or 'mixed'
	 *
	 * Use cases include mapping events to pixelIds (map), sending generic
	 * conversion pixels only for specific events (array), or configuring dynamic
	 * mappings of event properties to query string parameters based on event (mixed)
	 *
	 * @api public
	 * @param {Object|Object[]|String[]} options An object, array of objects, or
	 * array of strings pulled from settings.mapping.
	 * @param {string} key The name of the item in options whose metadata
	 * we're looking for.
	 * @return {Array} An array of settings that match the input `key` name.
	 * @example
	 *
	 * // 'Map'
	 * var events = { my_event: 'a4991b88' };
	 * .map(events, 'My Event');
	 * // => ["a4991b88"]
	 * .map(events, 'whatever');
	 * // => []
	 *
	 * // 'Array'
	 * * var events = ['Completed Order', 'My Event'];
	 * .map(events, 'My Event');
	 * // => ["My Event"]
	 * .map(events, 'whatever');
	 * // => []
	 *
	 * // 'Mixed'
	 * var events = [{ key: 'my event', value: '9b5eb1fa' }];
	 * .map(events, 'my_event');
	 * // => ["9b5eb1fa"]
	 * .map(events, 'whatever');
	 * // => []
	 */

	exports.map = function (options, key) {
	  var normalizedComparator = toNoCase_1(key);
	  var mappingType = getMappingType(options);

	  if (mappingType === 'unknown') {
	    return [];
	  }

	  return foldl_1(function (matchingValues, val, key_) {
	    var compare;
	    var result;

	    if (mappingType === 'map') {
	      compare = key_;
	      result = val;
	    }

	    if (mappingType === 'array') {
	      compare = val;
	      result = val;
	    }

	    if (mappingType === 'mixed') {
	      compare = val.key;
	      result = val.value;
	    }

	    if (toNoCase_1(compare) === normalizedComparator) {
	      matchingValues.push(result);
	    }

	    return matchingValues;
	  }, [], options);
	};

	/**
	 * Invoke a `method` that may or may not exist on the prototype with `args`,
	 * queueing or not depending on whether the integration is "ready". Don't
	 * trust the method call, since it contains integration party code.
	 *
	 * @api private
	 * @param {string} method
	 * @param {...*} args
	 */

	exports.invoke = function (method) {
	  if (!this[method]) return;
	  var args = Array.prototype.slice.call(arguments, 1);
	  if (!this._ready) return this.queue(method, args);

	  // this.debug('%s with %o', method, args);
	  return this[method].apply(this, args);
	};

	/**
	 * Queue a `method` with `args`.
	 *
	 * @api private
	 * @param {string} method
	 * @param {Array} args
	 */

	exports.queue = function (method, args) {
	  this._queue.push({ method: method, args: args });
	};

	/**
	 * Flush the internal queue.
	 *
	 * @api private
	 */

	exports.flush = function () {
	  this._ready = true;
	  var self = this;

	  each_1(function (call) {
	    self[call.method].apply(self, call.args);
	  }, this._queue);

	  // Empty the queue.
	  this._queue.length = 0;
	};

	/**
	 * Reset the integration, removing its global variables.
	 *
	 * @api private
	 */

	exports.reset = function () {
	  for (var i = 0; i < this.globals.length; i++) {
	    window[this.globals[i]] = undefined;
	  }

	  window.onerror = onerror;
	  window.onload = onload;
	};

	/**
	 * Load a tag by `name`.
	 *
	 * @param {string} name The name of the tag.
	 * @param {Object} locals Locals used to populate the tag's template variables
	 * (e.g. `userId` in '<img src="https://whatever.com/{{ userId }}">').
	 * @param {Function} [callback=noop] A callback, invoked when the tag finishes
	 * loading.
	 */

	exports.load = function (name, locals, callback) {
	  // Argument shuffling
	  if (typeof name === 'function') { callback = name; locals = null; name = null; }
	  if (name && typeof name === 'object') { callback = locals; locals = name; name = null; }
	  if (typeof locals === 'function') { callback = locals; locals = null; }

	  // Default arguments
	  name = name || 'library';
	  locals = locals || {};

	  locals = this.locals(locals);
	  var template = this.templates[name];
	  if (!template) throw new Error(lib$8('template "%s" not defined.', name));
	  var attrs = render(template, locals);
	  callback = callback || noop;
	  // var self = this;
	  var el;

	  switch (template.type) {
	    case 'img':
	      attrs.width = 1;
	      attrs.height = 1;
	      el = loadImage(attrs, callback);
	      break;
	    case 'script':
	      el = loadScript_1(attrs, function (err) {
	        if (!err) return callback();
	        // self.debug('error loading "%s" error="%s"', self.name, err);
	      });
	        // TODO: hack until refactoring load-script
	      delete attrs.src;
	      each_1(function (val, key) {
	        el.setAttribute(key, val);
	      }, attrs);
	      break;
	    case 'iframe':
	      el = loadIframe(attrs, callback);
	      break;
	        // No default case
	  }

	  return el;
	};

	/**
	 * Locals for tag templates.
	 *
	 * By default it includes a cache buster and all of the options.
	 *
	 * @param {Object} [locals]
	 * @return {Object}
	 */

	exports.locals = function (locals) {
	  locals = locals || {};
	  var cache = Math.floor(new Date().getTime() / 3600000);
	  if (!locals.hasOwnProperty('cache')) locals.cache = cache; // eslint-disable-line no-prototype-builtins
	  each_1(function (val, key) {
	    if (!locals.hasOwnProperty(key)) locals[key] = val; // eslint-disable-line no-prototype-builtins
	  }, this.options);
	  return locals;
	};

	/**
	 * Simple way to emit ready.
	 *
	 * @api public
	 */

	exports.ready = function () {
	  this.emit('ready');
	};

	/**
	 * Wrap the initialize method in an exists check, so we don't have to do it for
	 * every single integration.
	 *
	 * @api private
	 */

	exports._wrapInitialize = function () {
	  var initialize = this.initialize;
	  this.initialize = function () {
	    // this.debug('initialize');
	    this._initialized = true;
	    var ret = initialize.apply(this, arguments);
	    this.emit('initialize');
	    return ret;
	  };
	};

	/**
	 * Wrap the page method to call to noop the first page call if the integration assumes
	 * a pageview.
	 *
	 * @api private
	 */

	exports._wrapPage = function() {
	  var page = this.page;
	  var initialPageSkipped = false;
	  this.page = function() {
	    if (this._assumesPageview && !initialPageSkipped) {
	      initialPageSkipped = true;
	      return;
	    }
	    return page.apply(this, arguments);
	  };
	};

	/**
	 * Wrap the track method to call other ecommerce methods if available depending
	 * on the `track.event()`.
	 *
	 * @api private
	 */

	exports._wrapTrack = function () {
	  var t = this.track;
	  this.track = function (track) {
	    var event = track.event();
	    var ret;

	    // for (var method in events) {
	    //   if (has.call(events, method)) {
	    //     var regexp = events[method];
	    //     if (!this[method]) continue;
	    //     if (!regexp.test(event)) continue;
	    //     ret = this[method].apply(this, arguments);
	    //     called = true;
	    //     break;
	    //   }
	    // }

	    ret = t.apply(this, arguments);
	    return ret;
	  };
	};

	/**
	 * Determine the type of the option passed to `#map`
	 *
	 * @api private
	 * @param {Object|Object[]} mapping
	 * @return {String} mappingType
	 */

	function getMappingType(mapping) {
	  if (is_1.array(mapping)) {
	    return every_1(isMixed, mapping) ? 'mixed' : 'array';
	  }
	  if (is_1.object(mapping)) return 'map';
	  return 'unknown';
	}

	/**
	 * Determine if item in mapping array is a valid "mixed" type value
	 *
	 * Must be an object with properties "key" (of type string)
	 * and "value" (of any type)
	 *
	 * @api private
	 * @param {*} item
	 * @return {Boolean}
	 */

	function isMixed(item) {
	  if (!is_1.object(item)) return false;
	  if (!is_1.string(item.key)) return false;
	  if (!has.call(item, 'value')) return false;
	  return true;
	}

	/**
	 * TODO: Document me
	 *
	 * @api private
	 * @param {Object} attrs
	 * @param {Function} fn
	 * @return {Image}
	 */

	function loadImage(attrs, fn) {
	  fn = fn || function () {};
	  var img = new Image();
	  img.onerror = error(fn, 'failed to load pixel', img);
	  img.onload = function () { fn(); };
	  img.src = attrs.src;
	  img.width = 1;
	  img.height = 1;
	  return img;
	}

	/**
	 * TODO: Document me
	 *
	 * @api private
	 * @param {Function} fn
	 * @param {string} message
	 * @param {Element} img
	 * @return {Function}
	 */

	function error(fn, message, img) {
	  return function (e) {
	    e = e || window.event;
	    var err = new Error(message);
	    err.event = e;
	    err.source = img;
	    fn(err);
	  };
	}

	/**
	 * Render template + locals into an `attrs` object.
	 *
	 * @api private
	 * @param {Object} template
	 * @param {Object} locals
	 * @return {Object}
	 */

	function render(template, locals) {
	  return foldl_1(function (attrs, val, key) {
	    attrs[key] = val.replace(/\{\{\ *(\w+)\ *\}\}/g, function (_, $1) { // eslint-disable-line no-useless-escape
	      return locals[$1];
	    });
	    return attrs;
	  }, {}, template.attrs);
	}
	});
	var protos_1 = protos.initialize;
	var protos_2 = protos.loaded;
	var protos_3 = protos.page;
	var protos_4 = protos.track;
	var protos_5 = protos.map;
	var protos_6 = protos.invoke;
	var protos_7 = protos.queue;
	var protos_8 = protos.flush;
	var protos_9 = protos.reset;
	var protos_10 = protos.load;
	var protos_11 = protos.locals;
	var protos_12 = protos.ready;
	var protos_13 = protos._wrapInitialize;
	var protos_14 = protos._wrapPage;
	var protos_15 = protos._wrapTrack;

	/**
	 * Expose `parse`.
	 */

	var domify = parse$6;

	/**
	 * Tests for browser support.
	 */

	var innerHTMLBug = false;
	var bugTestDiv;
	if (typeof document !== 'undefined') {
	  bugTestDiv = document.createElement('div');
	  // Setup
	  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
	  // Make sure that link elements get serialized correctly by innerHTML
	  // This requires a wrapper element in IE
	  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
	  bugTestDiv = undefined;
	}

	/**
	 * Wrap map from jquery.
	 */

	var map$1 = {
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
	  // for script/link/style tags to work in IE6-8, you have to wrap
	  // in a div with a non-whitespace character in front, ha!
	  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
	};

	map$1.td =
	map$1.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

	map$1.option =
	map$1.optgroup = [1, '<select multiple="multiple">', '</select>'];

	map$1.thead =
	map$1.tbody =
	map$1.colgroup =
	map$1.caption =
	map$1.tfoot = [1, '<table>', '</table>'];

	map$1.polyline =
	map$1.ellipse =
	map$1.polygon =
	map$1.circle =
	map$1.text =
	map$1.line =
	map$1.path =
	map$1.rect =
	map$1.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

	/**
	 * Parse `html` and return a DOM Node instance, which could be a TextNode,
	 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
	 * instance, depending on the contents of the `html` string.
	 *
	 * @param {String} html - HTML string to "domify"
	 * @param {Document} doc - The `document` instance to create the Node for
	 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
	 * @api private
	 */

	function parse$6(html, doc) {
	  if ('string' != typeof html) throw new TypeError('String expected');

	  // default to the global `document` object
	  if (!doc) doc = document;

	  // tag name
	  var m = /<([\w:]+)/.exec(html);
	  if (!m) return doc.createTextNode(html);

	  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

	  var tag = m[1];

	  // body support
	  if (tag == 'body') {
	    var el = doc.createElement('html');
	    el.innerHTML = html;
	    return el.removeChild(el.lastChild);
	  }

	  // wrap map
	  var wrap = map$1[tag] || map$1._default;
	  var depth = wrap[0];
	  var prefix = wrap[1];
	  var suffix = wrap[2];
	  var el = doc.createElement('div');
	  el.innerHTML = prefix + html + suffix;
	  while (depth--) el = el.lastChild;

	  // one element
	  if (el.firstChild == el.lastChild) {
	    return el.removeChild(el.firstChild);
	  }

	  // several elements
	  var fragment = doc.createDocumentFragment();
	  while (el.firstChild) {
	    fragment.appendChild(el.removeChild(el.firstChild));
	  }

	  return fragment;
	}

	var statics = createCommonjsModule(function (module, exports) {

	/**
	 * Module dependencies.
	 */






	/**
	 * Mix in emitter.
	 */

	/* eslint-disable new-cap */
	componentEmitter(exports);
	/* eslint-enable new-cap */

	/**
	 * Add a new option to the integration by `key` with default `value`.
	 *
	 * @api public
	 * @param {string} key
	 * @param {*} value
	 * @return {Integration}
	 */

	exports.option = function (key, value) {
	  this.prototype.defaults[key] = value;
	  return this;
	};

	/**
	 * Add a new mapping option.
	 *
	 * This will create a method `name` that will return a mapping for you to use.
	 *
	 * @api public
	 * @param {string} name
	 * @return {Integration}
	 * @example
	 * Integration('My Integration')
	 *   .mapping('events');
	 *
	 * new MyIntegration().track('My Event');
	 *
	 * .track = function(track){
	 *   var events = this.events(track.event());
	 *   each(send, events);
	 *  };
	 */

	exports.mapping = function (name) {
	  this.option(name, []);
	  this.prototype[name] = function (key) {
	    return this.map(this.options[name], key);
	  };
	  return this;
	};

	/**
	 * Register a new global variable `key` owned by the integration, which will be
	 * used to test whether the integration is already on the page.
	 *
	 * @api public
	 * @param {string} key
	 * @return {Integration}
	 */

	exports.global = function (key) {
	  this.prototype.globals.push(key);
	  return this;
	};

	/**
	 * Mark the integration as assuming an initial pageview, so to defer the first page call, keep track of
	 * whether we already nooped the first page call.
	 *
	 * @api public
	 * @return {Integration}
	 */

	exports.assumesPageview = function () {
	  this.prototype._assumesPageview = true;
	  return this;
	};

	/**
	 * Mark the integration as being "ready" once `load` is called.
	 *
	 * @api public
	 * @return {Integration}
	 */

	exports.readyOnLoad = function () {
	  this.prototype._readyOnLoad = true;
	  return this;
	};

	/**
	 * Mark the integration as being "ready" once `initialize` is called.
	 *
	 * @api public
	 * @return {Integration}
	 */

	exports.readyOnInitialize = function () {
	  this.prototype._readyOnInitialize = true;
	  return this;
	};

	/**
	 * Define a tag to be loaded.
	 *
	 * @api public
	 * @param {string} [name='library'] A nicename for the tag, commonly used in
	 * #load. Helpful when the integration has multiple tags and you need a way to
	 * specify which of the tags you want to load at a given time.
	 * @param {String} str DOM tag as string or URL.
	 * @return {Integration}
	 */

	exports.tag = function (name, tag) {
	  if (tag == null) {
	    tag = name;
	    name = 'library';
	  }
	  this.prototype.templates[name] = objectify(tag);
	  return this;
	};

	/**
	 * Given a string, give back DOM attributes.
	 *
	 * Do it in a way where the browser doesn't load images or iframes. It turns
	 * out domify will load images/iframes because whenever you construct those
	 * DOM elements, the browser immediately loads them.
	 *
	 * @api private
	 * @param {string} str
	 * @return {Object}
	 */

	function objectify(str) {
	  // replace `src` with `data-src` to prevent image loading
	  str = str.replace(' src="', ' data-src="');

	  var el = domify(str);
	  var attrs = {};

	  each_1(function (attr) {
	    // then replace it back
	    var name = attr.name === 'data-src' ? 'src' : attr.name;
	    if (!includes_1(attr.name + '=', str)) return;
	    attrs[name] = attr.value;
	  }, el.attributes);

	  return {
	    type: el.tagName.toLowerCase(),
	    attrs: attrs,
	  };
	}
	});
	var statics_1 = statics.option;
	var statics_2 = statics.mapping;
	var statics_3 = statics.global;
	var statics_4 = statics.assumesPageview;
	var statics_5 = statics.readyOnLoad;
	var statics_6 = statics.readyOnInitialize;
	var statics_7 = statics.tag;

	/**
	 * Module dependencies.
	 */


	// var debug = require('debug');


	// var slug = require('slug-component');



	/**
	 * Create a new `Integration` constructor.
	 *
	 * @constructs Integration
	 * @param {string} name
	 * @return {Function} Integration
	 */

	function createIntegration(name) {
	  /**
	   * Initialize a new `Integration`.
	   *
	   * @class
	   * @param {Object} options
	   */

	  function Integration(options) {
	    if (options && options.addIntegration) {
	      // plugin
	      return options.addIntegration(Integration);
	    }
	    // this.debug = debug('analytics:integration:' + slug(name));
	    var clonedOpts = {};
	    extend(true, clonedOpts, options); // deep clone options
	    this.options = defaults_1(clonedOpts || {}, this.defaults);
	    this._queue = [];
	    this.once('ready', componentBind(this, this.flush));

	    Integration.emit('construct', this);
	    this.ready = componentBind(this, this.ready);
	    this._wrapInitialize();
	    this._wrapPage();
	    this._wrapTrack();
	  }

	  Integration.prototype.defaults = {};
	  Integration.prototype.globals = [];
	  Integration.prototype.templates = {};
	  Integration.prototype.name = name;
	  extend(Integration, statics);
	  extend(Integration.prototype, protos);

	  return Integration;
	}

	/**
	 * Exports.
	 */

	var lib$9 = createIntegration;

	/**
	 * Analytics.js
	 *
	 * (C) 2013-2016 Segment.io Inc.
	 */




	// Create a new `analytics` singleton.
	var analytics$1 = new analytics();

	analytics$1.VERSION = '3.4.1';

	analytics$1.createIntegration = lib$9;

	/*
	 * Exports.
	 */

	var lib$a = analytics$1;

	return lib$a;

}());
