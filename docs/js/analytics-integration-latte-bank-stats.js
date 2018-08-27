/* analytics.js-integration-latte-bank 0.1.3 */
(function (require$$8) {
	'use strict';

	require$$8 = 'default' in require$$8 ? require$$8['default'] : require$$8;

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var index$2 = createCommonjsModule(function (module) {
	var Modernizr = {};

	function addTest(key, func) {
	  Modernizr[key] = func();
	}

	module.exports = Modernizr;

	// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-network-information/index.html
	// https://wicg.github.io/netinfo/#dfn-connection-types
	addTest('network', function () {
	  var connection = navigator['-webkit-connection'] || navigator.connection;
	  var userAgent = navigator.userAgent;
	  var network = 'UNKNOWN';
	  var wechat;
	  if (connection && connection.type) {
	    network = connection.type.toUpperCase();
	  } else if (wechat = userAgent.match(/MicroMessenger\/6\.\d\.\d NetType\/(\w+\+?)/i)) {
	    if (wechat) {
	      network = wechat[1].toUpperCase();
	    }
	  }

	  return network;
	});

	addTest('screen', function () {
	  var screenWidth = screen.width;
	  var innerWidth = window.innerWidth;
	  // var clientWidth = document.documentElement.clientWidth;
	  var screenHeight = screen.height;
	  var innerHeight = window.innerHeight;
	  // var clientHeight= document.documentElement.clientHeight;
	  var devicePixelRatio = window.devicePixelRatio || 1;

	  if (screenWidth / innerWidth > 1 && devicePixelRatio > 1) {
	    screenWidth = screenWidth / devicePixelRatio;
	    screenHeight = screenHeight / devicePixelRatio;
	  }

	  if (screenWidth % 1) {
	    screenWidth = screenWidth.toFixed(2);
	  }

	  if (screenHeight % 1) {
	    screenHeight = screenHeight.toFixed(2);
	  }

	  return screenWidth + 'x' + screenHeight + '@' + devicePixelRatio;
	});
	});

	var require$$0 = (index$2 && typeof index$2 === 'object' && 'default' in index$2 ? index$2['default'] : index$2);

	var uniform = createCommonjsModule(function (module) {
	function pick(from_, to, fields) {
	  var f;
	  for (var i = 0; i < fields.length; i++) {
	    f = fields[i];
	    if (from_[f]) {
	      to[f] = from_[f];
	    }
	  }
	}


	module.exports = {
	  defaults: function () { // ** append to root
	    var d = {};

	    d.timestamp = 1 * new Date();

	    pick(this.options, d, ['p_o', 'p_i', 'p_u', 'p_c', 'r_c', 't_c', 'pageId', 'pageName', 'previousPageId', 'viewId', 'previousViewId', 'correlationId']);

	    return d;
	  },

	  context: function () { // ** append to data
	    var opts = this.options;

	    var d = {};

	    pick(opts, d, ['t_c', 'channel', 'utm_campaign', 'utm_source', 'utm_medium', 'utm_term', 'utm_content']);

	    var tom = this.analytics;

	    // * User
	    var user = tom.user();
	    d.ajsId = user.id() || user.anonymousId();

	    return d;
	  },
	};
	});

	var require$$0$1 = (uniform && typeof uniform === 'object' && 'default' in uniform ? uniform['default'] : uniform);

	var index$3 = createCommonjsModule(function (module, exports) {
	(function (root, factory) {
	    if (typeof define === 'function' && define.amd) {
	        define(factory);
	    } else if (typeof exports === 'object') {
	        module.exports = factory();
	    } else {
	        root.deepmerge = factory();
	    }
	}(commonjsGlobal, function () {

	return function deepmerge(target, src) {
	    var array = Array.isArray(src);
	    var dst = array && [] || {};

	    if (array) {
	        target = target || [];
	        dst = dst.concat(target);
	        src.forEach(function(e, i) {
	            if (typeof dst[i] === 'undefined') {
	                dst[i] = e;
	            } else if (typeof e === 'object') {
	                dst[i] = deepmerge(target[i], e);
	            } else {
	                if (target.indexOf(e) === -1) {
	                    dst.push(e);
	                }
	            }
	        });
	    } else {
	        if (target && typeof target === 'object') {
	            Object.keys(target).forEach(function (key) {
	                dst[key] = target[key];
	            })
	        }
	        Object.keys(src).forEach(function (key) {
	            if (typeof src[key] !== 'object' || !src[key]) {
	                dst[key] = src[key];
	            }
	            else {
	                if (!target[key]) {
	                    dst[key] = src[key];
	                } else {
	                    dst[key] = deepmerge(target[key], src[key]);
	                }
	            }
	        });
	    }

	    return dst;
	}

	}));
	});

	var require$$1$1 = (index$3 && typeof index$3 === 'object' && 'default' in index$3 ? index$3['default'] : index$3);

	var utils = createCommonjsModule(function (module) {
	var merge = require$$1$1;
	var uniform = require$$0$1;


	function noop() {}

	function createImg(a) {
	  var img = document.createElement('img');
	  img.width = 1;
	  img.height = 1;
	  img.src = a;
	  return img;
	};

	function sendImage(url, data, callback) {
	  var img = createImg(url + '?' + data);
	  img.onload = img.onerror = function () {
	    img.onload = null;
	    img.onerror = null;
	    callback();
	  };
	};

	module.exports = {
	  send: function (payload) {
	    var defaults = merge(uniform.defaults.call(this), this.options.defaults ? this.options.defaults() : {});
	    // ** assert: payload should be an {}
	    payload.data = merge(uniform.context.call(this), payload.data);

	    var fields = merge(defaults, payload);

	    // FIXME:
	    fields.data = JSON.stringify(fields.data);

	    // ** collect only the non-null fields
	    var str = [];
	    for (var k in fields) {
	      if (fields[k]) {
	        str.push(k + '=' + fields[k]);
	      }
	    }
	    str = str.join('&');

	    sendImage(this.options.gif, str, noop);
	  },
	};
	});

	var require$$1 = (utils && typeof utils === 'object' && 'default' in utils ? utils['default'] : utils);

	var objectLength = createCommonjsModule(function (module) {
	// https://github.com/component/object/blob/master/index.js#L62

	var has = Object.prototype.hasOwnProperty;

	var keys = Object.keys || function (obj) {
	  var a = [];
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      a.push(key);
	    }
	  }
	  return a;
	};

	/**
	 * Return length of `obj`.
	 *
	 * @param {Object} obj
	 * @return {Number}
	 * @api public
	 */

	module.exports = function (obj) {
	  return keys(obj).length;
	};
	});

	var require$$2 = (objectLength && typeof objectLength === 'object' && 'default' in objectLength ? objectLength['default'] : objectLength);

	var find = createCommonjsModule(function (module) {
	module.exports = function $find(selector) {
	  // The selector should return ONE and only ONE element
	  var el = document.querySelector(selector);
	  return el;
	}
	});

	var require$$0$2 = (find && typeof find === 'object' && 'default' in find ? find['default'] : find);

	var parseMeta = createCommonjsModule(function (module) {
	var $find = require$$0$2;


	module.exports = function parseMeta() {
	  var $meta = $find('meta[name="h5a"]');

	  var d = {};

	  if ($meta) {
	    var content = $meta.getAttribute('content').split(';');
	    var c;
	    var kv;
	    var k;
	    var v;
	    for (var i = 0; i < content.length; i++) {
	      c = content[i];
	      if (c) {
	        kv = c.split('=');
	        k = kv[0];
	        v = kv[1];
	        if (k && v) {
	          d[k] = v;
	        }
	      }
	    }
	  }

	  return d;
	};
	});

	var require$$3 = (parseMeta && typeof parseMeta === 'object' && 'default' in parseMeta ? parseMeta['default'] : parseMeta);

	var parseUri = createCommonjsModule(function (module) {
	// a node.js module fork of
	// parseUri 1.2.2
	// (c) Steven Levithan <stevenlevithan.com>
	// MIT License
	// see: http://blog.stevenlevithan.com/archives/parseuri
	// see: http://stevenlevithan.com/demo/parseuri/js/

	// forked into a node.js module by franz enzenhofer
	// downloaded from https://www.npmjs.com/package/parseUri by hbrls

	function parseUri (str) {
	  var o   = parseUri.options,
	    m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
	    uri = {},
	    i   = 14;

	  while (i--) uri[o.key[i]] = m[i] || "";

	  uri[o.q.name] = {};
	  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
	    if ($1) uri[o.q.name][$1] = $2;
	  });

	  return uri;
	};

	parseUri.options = {
	  strictMode: false,
	  key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	  q:   {
	    name:   "queryKey",
	    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	  },
	  parser: {
	    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
	    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	  }
	};

	module.exports = parseUri
	});

	var require$$4 = (parseUri && typeof parseUri === 'object' && 'default' in parseUri ? parseUri['default'] : parseUri);

	var index$6 = createCommonjsModule(function (module) {
	/**
	 * Global Names
	 */

	var globals = /\b(Array|Date|Object|Math|JSON)\b/g;

	/**
	 * Return immediate identifiers parsed from `str`.
	 *
	 * @param {String} str
	 * @param {String|Function} map function or prefix
	 * @return {Array}
	 * @api public
	 */

	module.exports = function(str, fn){
	  var p = unique(props(str));
	  if (fn && 'string' == typeof fn) fn = prefixed(fn);
	  if (fn) return map(str, p, fn);
	  return p;
	};

	/**
	 * Return immediate identifiers in `str`.
	 *
	 * @param {String} str
	 * @return {Array}
	 * @api private
	 */

	function props(str) {
	  return str
	    .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
	    .replace(globals, '')
	    .match(/[a-zA-Z_]\w*/g)
	    || [];
	}

	/**
	 * Return `str` with `props` mapped with `fn`.
	 *
	 * @param {String} str
	 * @param {Array} props
	 * @param {Function} fn
	 * @return {String}
	 * @api private
	 */

	function map(str, props, fn) {
	  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
	  return str.replace(re, function(_){
	    if ('(' == _[_.length - 1]) return fn(_);
	    if (!~props.indexOf(_)) return _;
	    return fn(_);
	  });
	}

	/**
	 * Return unique array.
	 *
	 * @param {Array} arr
	 * @return {Array}
	 * @api private
	 */

	function unique(arr) {
	  var ret = [];

	  for (var i = 0; i < arr.length; i++) {
	    if (~ret.indexOf(arr[i])) continue;
	    ret.push(arr[i]);
	  }

	  return ret;
	}

	/**
	 * Map with prefix `str`.
	 */

	function prefixed(str) {
	  return function(_){
	    return str + _;
	  };
	}
	});

	var require$$1$2 = (index$6 && typeof index$6 === 'object' && 'default' in index$6 ? index$6['default'] : index$6);

	var index$5 = createCommonjsModule(function (module) {
	/**
	 * Module Dependencies
	 */

	var expr;
	try {
	  expr = require$$1$2;
	} catch(e) {
	  expr = require$$1$2;
	}

	/**
	 * Expose `toFunction()`.
	 */

	module.exports = toFunction;

	/**
	 * Convert `obj` to a `Function`.
	 *
	 * @param {Mixed} obj
	 * @return {Function}
	 * @api private
	 */

	function toFunction(obj) {
	  switch ({}.toString.call(obj)) {
	    case '[object Object]':
	      return objectToFunction(obj);
	    case '[object Function]':
	      return obj;
	    case '[object String]':
	      return stringToFunction(obj);
	    case '[object RegExp]':
	      return regexpToFunction(obj);
	    default:
	      return defaultToFunction(obj);
	  }
	}

	/**
	 * Default to strict equality.
	 *
	 * @param {Mixed} val
	 * @return {Function}
	 * @api private
	 */

	function defaultToFunction(val) {
	  return function(obj){
	    return val === obj;
	  };
	}

	/**
	 * Convert `re` to a function.
	 *
	 * @param {RegExp} re
	 * @return {Function}
	 * @api private
	 */

	function regexpToFunction(re) {
	  return function(obj){
	    return re.test(obj);
	  };
	}

	/**
	 * Convert property `str` to a function.
	 *
	 * @param {String} str
	 * @return {Function}
	 * @api private
	 */

	function stringToFunction(str) {
	  // immediate such as "> 20"
	  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

	  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
	  return new Function('_', 'return ' + get(str));
	}

	/**
	 * Convert `object` to a function.
	 *
	 * @param {Object} object
	 * @return {Function}
	 * @api private
	 */

	function objectToFunction(obj) {
	  var match = {};
	  for (var key in obj) {
	    match[key] = typeof obj[key] === 'string'
	      ? defaultToFunction(obj[key])
	      : toFunction(obj[key]);
	  }
	  return function(val){
	    if (typeof val !== 'object') return false;
	    for (var key in match) {
	      if (!(key in val)) return false;
	      if (!match[key](val[key])) return false;
	    }
	    return true;
	  };
	}

	/**
	 * Built the getter function. Supports getter style functions
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function get(str) {
	  var props = expr(str);
	  if (!props.length) return '_.' + str;

	  var val, i, prop;
	  for (i = 0; i < props.length; i++) {
	    prop = props[i];
	    val = '_.' + prop;
	    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";

	    // mimic negative lookbehind to avoid problems with nested properties
	    str = stripNested(prop, str, val);
	  }

	  return str;
	}

	/**
	 * Mimic negative lookbehind to avoid problems with nested properties.
	 *
	 * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
	 *
	 * @param {String} prop
	 * @param {String} str
	 * @param {String} val
	 * @return {String}
	 * @api private
	 */

	function stripNested (prop, str, val) {
	  return str.replace(new RegExp('(\\.)?' + prop, 'g'), function($0, $1) {
	    return $1 ? $0 : val;
	  });
	}
	});

	var require$$0$3 = (index$5 && typeof index$5 === 'object' && 'default' in index$5 ? index$5['default'] : index$5);

	var index$7 = createCommonjsModule(function (module) {
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

	module.exports = function(val){
	  switch (toString.call(val)) {
	    case '[object Function]': return 'function';
	    case '[object Date]': return 'date';
	    case '[object RegExp]': return 'regexp';
	    case '[object Arguments]': return 'arguments';
	    case '[object Array]': return 'array';
	    case '[object String]': return 'string';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val && val.nodeType === 1) return 'element';
	  if (val === Object(val)) return 'object';

	  return typeof val;
	};
	});

	var require$$2$1 = (index$7 && typeof index$7 === 'object' && 'default' in index$7 ? index$7['default'] : index$7);

	var index$4 = createCommonjsModule(function (module) {
	/**
	 * Module dependencies.
	 */

	try {
	  var type = require$$2$1;
	} catch (err) {
	  var type = require$$2$1;
	}

	var toFunction = require$$0$3;

	/**
	 * HOP reference.
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Iterate the given `obj` and invoke `fn(val, i)`
	 * in optional context `ctx`.
	 *
	 * @param {String|Array|Object} obj
	 * @param {Function} fn
	 * @param {Object} [ctx]
	 * @api public
	 */

	module.exports = function(obj, fn, ctx){
	  fn = toFunction(fn);
	  ctx = ctx || this;
	  switch (type(obj)) {
	    case 'array':
	      return array(obj, fn, ctx);
	    case 'object':
	      if ('number' == typeof obj.length) return array(obj, fn, ctx);
	      return object(obj, fn, ctx);
	    case 'string':
	      return string(obj, fn, ctx);
	  }
	};

	/**
	 * Iterate string chars.
	 *
	 * @param {String} obj
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @api private
	 */

	function string(obj, fn, ctx) {
	  for (var i = 0; i < obj.length; ++i) {
	    fn.call(ctx, obj.charAt(i), i);
	  }
	}

	/**
	 * Iterate object keys.
	 *
	 * @param {Object} obj
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @api private
	 */

	function object(obj, fn, ctx) {
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      fn.call(ctx, key, obj[key]);
	    }
	  }
	}

	/**
	 * Iterate array-ish.
	 *
	 * @param {Array|Object} obj
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @api private
	 */

	function array(obj, fn, ctx) {
	  for (var i = 0; i < obj.length; ++i) {
	    fn.call(ctx, obj[i], i);
	  }
	}
	});

	var require$$5 = (index$4 && typeof index$4 === 'object' && 'default' in index$4 ? index$4['default'] : index$4);

	var index$8 = createCommonjsModule(function (module) {
	var identity = function(_){ return _; };


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
	    normalize = options && isFunction(options.normalizer) ? options.normalizer : defaultNormalize;
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

	var require$$6 = (index$8 && typeof index$8 === 'object' && 'default' in index$8 ? index$8['default'] : index$8);

	var index$10 = createCommonjsModule(function (module) {
	'use strict';

	var max = Math.max;

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
	  var results = new Array(max(collection.length - 2, 0));

	  for (var i = 1; i < collection.length; i += 1) {
	    results[i - 1] = collection[i];
	  }

	  return results;
	};

	/*
	 * Exports.
	 */

	module.exports = rest;
	});

	var require$$0$4 = (index$10 && typeof index$10 === 'object' && 'default' in index$10 ? index$10['default'] : index$10);

	var index$11 = createCommonjsModule(function (module) {
	'use strict';

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

	module.exports = drop;
	});

	var require$$1$3 = (index$11 && typeof index$11 === 'object' && 'default' in index$11 ? index$11['default'] : index$11);

	var index$9 = createCommonjsModule(function (module) {
	'use strict';

	/*
	 * Module dependencies.
	 */

	var drop = require$$1$3;
	var rest = require$$0$4;

	var has = Object.prototype.hasOwnProperty;
	var objToString = Object.prototype.toString;

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
	var isPlainObject = function isPlainObject(value) {
	  return Boolean(value) && objToString.call(value) === '[object Object]';
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
	    if (isPlainObject(target[key]) && isPlainObject(value)) {
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
	  var sources = drop(2, arguments);

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
	  return defaultsWith.apply(null, [deepCombiner, target].concat(rest(arguments)));
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
	  return defaultsWith.apply(null, [null, target].concat(rest(arguments)));
	};

	/*
	 * Exports.
	 */

	module.exports = defaults;
	module.exports.deep = defaultsDeep;
	});

	var require$$7 = (index$9 && typeof index$9 === 'object' && 'default' in index$9 ? index$9['default'] : index$9);

	var index = createCommonjsModule(function (module) {
	var core = require$$8;

	/**
	 * Module dependencies.
	 */

	var defaults = require$$7;
	var dot = require$$6;
	var each = require$$5;
	var parseUri = require$$4;
	var parseMeta = require$$3;
	var len = require$$2;
	var utils = require$$1;
	var Modernizr = require$$0;

	/**
	 * Expose plugin.
	 */

	function entry(analytics) {
	  analytics.addIntegration(LBS);
	};

	entry.Integration = LBS;

	/**
	 * Expose `Latte Bank Stats` integration.
	 *
	 */

	var LBS = core.createIntegration('Latte Bank Stats')
	  .readyOnLoad()
	  .option('domain', 'auto');

	/**
	 * On `construct` swap any config-based methods to the proper implementation.
	 */

	LBS.on('construct', function(integration) {
	  var query = parseUri(window.location.href).queryKey;
	  var meta = parseMeta();

	  var opts = integration.options;

	  if (query.p_o) { opts.p_o = query.p_o; }
	  if (query.p_i) { opts.p_i = query.p_i; }
	  if (query.p_u) { opts.p_u = query.p_u; }
	  if (query.p_c) { opts.p_c = query.p_c; }

	  if (query.r_c) { opts.r_c = query.r_c; }

	  if (query.pageId) { opts.pageId = query.pageId; }

	  if (query.pageName) {
	    opts.pageName = query.pageName;
	  } else {
	    if (meta['page-name']) {
	      opts.pageName = meta['page-name'];
	    }
	  }

	  if (query.previousPageId) { opts.previousPageId = query.previousPageId; }
	  if (query.viewId) { opts.viewId = query.viewId; }
	  if (query.previousViewId) { opts.previousViewId = query.previousViewId; }
	  if (query.correlationId) { opts.correlationId = query.correlationId; }

	  /**
	   * 1. priority meta > t_c > channel
	   * 2. meta is WTFPL override, use it with care
	   */
	  if (meta.campaign) {
	    opts.channel = meta.campaign;
	    opts.t_c = meta.campaign;
	  } else if (query.t_c) {
	    opts.channel = query.t_c;
	    opts.t_c = query.t_c;
	  } else if (query.channel) {
	    opts.channel = query.channel;
	    opts.t_c = query.channel;
	  }

	  if (query.utm_campaign) { opts.utm_campaign = query.utm_campaign; }
	  if (query.utm_source) { opts.utm_source = query.utm_source; }
	  if (query.utm_medium) { opts.utm_medium = query.utm_medium; }
	  if (query.utm_term) { opts.utm_term = query.utm_term; }
	  if (query.utm_content) { opts.utm_content = query.utm_content; }
	});

	/**
	 * Initialize.
	 */

	LBS.prototype.initialize = function() {
	  this.pageCalled = false;
	  var opts = this.options;
	  // console.debug(opts);

	  /**
	   * Tom Riddle
	   * Lord Voldemort
	   * You-Know-Who
	   * He-Who-Must-Not-Be-Named
	   */
	  var tom = this.analytics;

	  // * User
	  if (opts.p_u) {
	    tom.identify(opts.p_u);
	  }

	  this.ready();
	};

	/**
	 * Loaded?
	 *
	 * @return {Boolean}
	 */

	LBS.prototype.loaded = function() {
	  return true;
	};

	/**
	 * Page.
	 *
	 * @api public
	 * @param {Page} page
	 */

	LBS.prototype.page = function(page) {
		if (page.obj.context.include !== this.constructor.prototype.name) {
			return;
		}

	  // var category = page.category();
	  var props = page.properties();
	  var name = page.fullName();
	  var opts = this.options;
	  // console.debug(opts);
	  var tom = this.analytics;

	  // var pageview = {};
	  var pagePath = path(props, opts);
	  // var pageReferrer = page.referrer() || '';

	  // // store for later
	  // // TODO: Why? Document this better
	  // this._category = category;

	  // pageview.location = props.url;

	  var REG_SPECIAL_CHARS = /[!@#\$%\^\&\*\)\(\+\=\.]/ig;

	  // set
	  var payload = {
	    eventId: page.obj.eventId,
	    event: 'pageview',
	    data: {
	      // FIXME: @chenjie
	      // if pageview
	      //     return data[pagename] or data[title]
	      pagename: opts.pageName,
	      title: name || props.title.replace(REG_SPECIAL_CHARS, '☒'), // FIXME:
	      page: pagePath, // GA->dp
	      // TODO: better naming
	      timing: tom.timing(),
	      // TODO: pick
	      network: Modernizr.network,
	      screen: Modernizr.screen,
	    },
	  };
	  // if (pageReferrer !== document.referrer) payload.referrer = pageReferrer; // allow referrer override if referrer was manually set
	  // window.ga('set', payload);

	  // if (this.pageCalled) delete pageview.location;

	  // send
	  utils.send.call(this, payload);

	  this.pageCalled = true;
	};

	/**
	 * Identify.
	 *
	 * @api public
	 * @param {Identify} event
	 */

	LBS.prototype.identify = function(identify) {
	  // var opts = this.options;

	  // if (opts.sendUserId && identify.userId()) {
	  //   window.ga('set', 'userId', identify.userId());
	  // }
	};

	/**
	 * Track.
	 *
	 * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
	 * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
	 *
	 * @param {Track} event
	 */

	LBS.prototype.track = function(track, options) {
	  // console.debug(track, options);
	  // var contextOpts = track.options(this.name);
	  // var interfaceOpts = this.options;
	  // var opts = defaults(options || {}, contextOpts);
	  // opts = defaults(opts, interfaceOpts);
		// var props = track.properties();
		if (track.obj.context.include !== this.constructor.prototype.name) {
			return;
		}

	  var properties = defaults({}, track.obj.properties);

	  var payload = {
	    eventId: track.obj.eventId,
	    // event: 'buttonClick',
	    // FIXME: @chenjie
	    // if pageview
	    //    use pageName
	    // else
	    //    use event
	    event: properties.event || this.options.pageName,
	    data: {
	      action: track.event(),
	    },
	  };

	  // FIXME:
	  delete properties.event;
	  defaults(payload.data, properties);

	  utils.send.call(this, payload);
	};

	/**
	 * Return the path based on `properties` and `options`.
	 *
	 * @param {Object} properties
	 * @param {Object} options
	 * @return {string|undefined}
	 */

	function path(properties, options) {
	  if (!properties) return;
	  var str = properties.path;
	  if (options.includeSearch && properties.search) str += properties.search;
	  return str;
	}

	/**
	 * Format the value property to Google's liking.
	 *
	 * @param {Number} value
	 * @return {Number}
	 */

	function formatValue(value) {
	  if (!value || value < 0) return 0;
	  return Math.round(value);
	}

	entry(core);
	});

	var index$1 = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

	return index$1;

}(analytics));
