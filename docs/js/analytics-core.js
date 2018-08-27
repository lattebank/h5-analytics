/* analytics.js-core 3.0.0 */
var analytics = (function () {
    'use strict';

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var index$5 = createCommonjsModule(function (module) {
    'use strict';

    var hop = Object.prototype.hasOwnProperty;
    var strCharAt = String.prototype.charAt;
    var toStr = Object.prototype.toString;

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
    var has = function has(context, prop) {
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
      return toStr.call(val) === '[object String]';
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
      pred = pred || has;

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
      pred = pred || has;

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
        return indexKeys(source, has);
      }

      return objectKeys(source);
    };

    /*
     * Exports.
     */

    module.exports = keys;
    });

    var require$$6 = (index$5 && typeof index$5 === 'object' && 'default' in index$5 ? index$5['default'] : index$5);

    var index$4 = createCommonjsModule(function (module) {
    'use strict';

    /*
     * Module dependencies.
     */

    var keys = require$$6;

    var objToString = Object.prototype.toString;

    /**
     * Tests if a value is a number.
     *
     * @name isNumber
     * @api private
     * @param {*} val The value to test.
     * @return {boolean} Returns `true` if `val` is a number, otherwise `false`.
     */
    // TODO: Move to library
    var isNumber = function isNumber(val) {
      var type = typeof val;
      return type === 'number' || (type === 'object' && objToString.call(val) === '[object Number]');
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
    var isArray = typeof Array.isArray === 'function' ? Array.isArray : function isArray(val) {
      return objToString.call(val) === '[object Array]';
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
    var isArrayLike = function isArrayLike(val) {
      return val != null && (isArray(val) || (val !== 'function' && isNumber(val.length)));
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
      var ks = keys(object);

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
      return (isArrayLike(collection) ? arrayEach : baseEach).call(this, iterator, collection);
    };

    /*
     * Exports.
     */

    module.exports = each;
    });

    var require$$4 = (index$4 && typeof index$4 === 'object' && 'default' in index$4 ? index$4['default'] : index$4);

    var index$3 = createCommonjsModule(function (module) {
    'use strict';

    /*
     * Module dependencies.
     */

    var each = require$$4;

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
      each(function(value) {
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

    module.exports = includes;
    });

    var require$$3 = (index$3 && typeof index$3 === 'object' && 'default' in index$3 ? index$3['default'] : index$3);

    var index$6 = createCommonjsModule(function (module) {
    /**
     * Expose `parse`.
     */

    module.exports = parse;

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

    var map = {
      legend: [1, '<fieldset>', '</fieldset>'],
      tr: [2, '<table><tbody>', '</tbody></table>'],
      col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
      // for script/link/style tags to work in IE6-8, you have to wrap
      // in a div with a non-whitespace character in front, ha!
      _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
    };

    map.td =
    map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

    map.option =
    map.optgroup = [1, '<select multiple="multiple">', '</select>'];

    map.thead =
    map.tbody =
    map.colgroup =
    map.caption =
    map.tfoot = [1, '<table>', '</table>'];

    map.polyline =
    map.ellipse =
    map.polygon =
    map.circle =
    map.text =
    map.line =
    map.path =
    map.rect =
    map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

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

    function parse(html, doc) {
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
      var wrap = map[tag] || map._default;
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
    });

    var require$$2 = (index$6 && typeof index$6 === 'object' && 'default' in index$6 ? index$6['default'] : index$6);

    var index$7 = createCommonjsModule(function (module) {
    /**
     * Expose `Emitter`.
     */

    if (typeof module !== 'undefined') {
      module.exports = Emitter;
    }

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    };

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

    var require$$15 = (index$7 && typeof index$7 === 'object' && 'default' in index$7 ? index$7['default'] : index$7);

    var statics = createCommonjsModule(function (module, exports) {
    'use strict';

    /**
     * Module dependencies.
     */

    var Emitter = require$$15;
    var domify = require$$2;
    var each = require$$4;
    var includes = require$$3;

    /**
     * Mix in emitter.
     */

    /* eslint-disable new-cap */
    Emitter(exports);
    /* eslint-enable new-cap */

    /**
     * Add a new option to the integration by `key` with default `value`.
     *
     * @api public
     * @param {string} key
     * @param {*} value
     * @return {Integration}
     */

    exports.option = function(key, value) {
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

    exports.mapping = function(name) {
      this.option(name, []);
      this.prototype[name] = function(key) {
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

    exports.global = function(key) {
      this.prototype.globals.push(key);
      return this;
    };

    /**
     * Mark the integration as assuming an initial pageview, so to defer loading
     * the script until the first `page` call, noop the first `initialize`.
     *
     * @api public
     * @return {Integration}
     */

    exports.assumesPageview = function() {
      this.prototype._assumesPageview = true;
      return this;
    };

    /**
     * Mark the integration as being "ready" once `load` is called.
     *
     * @api public
     * @return {Integration}
     */

    exports.readyOnLoad = function() {
      this.prototype._readyOnLoad = true;
      return this;
    };

    /**
     * Mark the integration as being "ready" once `initialize` is called.
     *
     * @api public
     * @return {Integration}
     */

    exports.readyOnInitialize = function() {
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

    exports.tag = function(name, tag) {
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

      each(function(attr) {
        // then replace it back
        var name = attr.name === 'data-src' ? 'src' : attr.name;
        if (!includes(attr.name + '=', str)) return;
        attrs[name] = attr.value;
      }, el.attributes);

      return {
        type: el.tagName.toLowerCase(),
        attrs: attrs
      };
    }
    });

    var require$$0$1 = (statics && typeof statics === 'object' && 'default' in statics ? statics['default'] : statics);

    var index$8 = createCommonjsModule(function (module) {
    /**
     * Expose `toNoCase`.
     */

    module.exports = toNoCase;


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
    });

    var require$$0$2 = (index$8 && typeof index$8 === 'object' && 'default' in index$8 ? index$8['default'] : index$8);

    var index$9 = createCommonjsModule(function (module) {
    'use strict';

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

    module.exports = (function () {
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
    });

    var require$$0$3 = (index$9 && typeof index$9 === 'object' && 'default' in index$9 ? index$9['default'] : index$9);

    var index$11 = createCommonjsModule(function (module) {
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
    });

    var require$$2$2 = (index$11 && typeof index$11 === 'object' && 'default' in index$11 ? index$11['default'] : index$11);

    var index$12 = createCommonjsModule(function (module) {
    // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html

    /**
     * Invoke `fn(err)` when the given `el` script loads.
     *
     * @param {Element} el
     * @param {Function} fn
     * @api public
     */

    module.exports = function(el, fn){
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
    });

    var require$$1$1 = (index$12 && typeof index$12 === 'object' && 'default' in index$12 ? index$12['default'] : index$12);

    var index$10 = createCommonjsModule(function (module) {
    'use strict';

    /*
     * Module dependencies.
     */

    var onload = require$$1$1;
    var tick = require$$0$3;
    var type = require$$2$2;

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
      if (type(options) === 'string') {
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
      if (type(cb) === 'function') {
        onload(script, cb);
      }

      tick(function() {
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

    module.exports = loadScript;
    });

    var require$$2$1 = (index$10 && typeof index$10 === 'object' && 'default' in index$10 ? index$10['default'] : index$10);

    var index$14 = createCommonjsModule(function (module) {
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

    var require$$7 = (index$14 && typeof index$14 === 'object' && 'default' in index$14 ? index$14['default'] : index$14);

    var index$13 = createCommonjsModule(function (module) {
    /**
     * Module dependencies.
     */

    var is = require$$7;
    var onload = require$$1$1;
    var tick = require$$0$3;

    /**
     * Expose `loadScript`.
     *
     * @param {Object} options
     * @param {Function} fn
     * @api public
     */

    module.exports = function loadIframe(options, fn){
      if (!options) throw new Error('Cant load nothing...');

      // Allow for the simplest case, just passing a `src` string.
      if (is.string(options)) options = { src : options };

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
      if (is.fn(fn)) {
        onload(iframe, fn);
      }

      tick(function(){
        // Append after event listeners are attached for IE.
        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(iframe, firstScript);
      });

      // Return the iframe element in case they want to do anything special, like
      // give it an ID or attributes.
      return iframe;
    };
    });

    var require$$3$1 = (index$13 && typeof index$13 === 'object' && 'default' in index$13 ? index$13['default'] : index$13);

    var index$15 = createCommonjsModule(function (module) {
    'use strict';

    /*
     * Module dependencies.
     */

    var each = require$$4;

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

      each(function(val, i, collection) {
        accumulator = iterator(accumulator, val, i, collection);
      }, collection);

      return accumulator;
    };

    /*
     * Exports.
     */

    module.exports = foldl;
    });

    var require$$0$4 = (index$15 && typeof index$15 === 'object' && 'default' in index$15 ? index$15['default'] : index$15);

    var index$16 = createCommonjsModule(function (module) {
    'use strict';

    // Stringifier
    var toString = commonjsGlobal.JSON && typeof JSON.stringify === 'function' ? JSON.stringify : String;

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
    fmt.o = toString;
    fmt.s = String;
    fmt.d = parseInt;

    /*
     * Exports.
     */

    module.exports = fmt;
    });

    var require$$6$1 = (index$16 && typeof index$16 === 'object' && 'default' in index$16 ? index$16['default'] : index$16);

    var index$17 = createCommonjsModule(function (module) {
    'use strict';

    /*
     * Module dependencies.
     */

    var each = require$$4;

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

      each(function(val, key, collection) {
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

    module.exports = every;
    });

    var require$$7$1 = (index$17 && typeof index$17 === 'object' && 'default' in index$17 ? index$17['default'] : index$17);

    var index$19 = createCommonjsModule(function (module) {
    'use strict';

    /*
     * Module dependencies.
     */

    var each = require$$4;

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

      each(function(val, i, collection) {
        result.push(iterator(val, i, collection));
      }, collection);

      return result;
    };

    /*
     * Exports.
     */

    module.exports = map;
    });

    var require$$2$3 = (index$19 && typeof index$19 === 'object' && 'default' in index$19 ? index$19['default'] : index$19);

    var index$18 = createCommonjsModule(function (module) {
    'use strict';

    /**
     * Module Dependencies
     */

    var map = require$$2$3;
    var foldl = require$$0$4;

    var eventMap = {
      // Promotions
      promotionViewed: [{
        object: 'promotion',
        action: 'viewed'
      }],
      promotionClicked: [{
        object: 'promotion',
        action: 'clicked'
      }],

      // Browsing
      productsSearched: [{
        object: 'products',
        action: 'searched'
      }],
      productListViewed: [{
        object: 'product list',
        action: 'viewed'
      }, {
        object: 'product category',
        action: 'viewed'
      }],
      productListFiltered: [{
        object: 'product list',
        action: 'filtered'
      }],

      // Core Ordering
      productClicked: [{
        object: 'product',
        action: 'clicked'
      }],
      productViewed: [{
        object: 'product',
        action: 'viewed'
      }],
      productAdded: [{
        object: 'product',
        action: 'added'
      }],
      productRemoved: [{
        object: 'product',
        action: 'removed'
      }],
      cartViewed: [{
        object: 'cart',
        action: 'viewed'
      }],
      orderUpdated: [{
        object: 'order',
        action: 'updated'
      }],
      orderCompleted: [{
        object: 'order',
        action: 'completed'
      }],
      orderRefunded: [{
        object: 'order',
        action: 'refunded'
      }],
      orderCancelled: [{
        object: 'order',
        action: 'cancelled'
      }],
      paymentInfoEntered: [{
        object: 'payment info',
        action: 'entered'
      }],
      checkoutStarted: [{
        object: 'checkout',
        action: 'started'
      }],
      checkoutStepViewed: [{
        object: 'checkout step',
        action: 'viewed'
      }],
      checkoutStepCompleted: [{
        object: 'checkout step',
        action: 'completed'
      }],

      // Coupons
      couponEntered: [{
        object: 'coupon',
        action: 'entered'
      }],
      couponApplied: [{
        object: 'coupon',
        action: 'applied'
      }],
      couponDenied: [{
        object: 'coupon',
        action: 'denied'
      }],
      couponRemoved: [{
        object: 'coupon',
        action: 'removed'
      }],

      // Wishlisting
      productAddedToWishlist: [{
        object: 'product',
        action: 'added to wishlist'
      }],
      productRemovedFromWishlist: [{
        object: 'product',
        action: 'removed from wishlist'
      }],
      productAddedFromWishlistToCart: [{
        object: 'product',
        action: 'added to cart from wishlist'
      }, {
        object: 'product',
        action: 'added from wishlist to cart'
      }],

      // Sharing
      productShared: [{
        object: 'product',
        action: 'shared'
      }],
      cartShared: [{
        object: 'cart',
        action: 'shared'
      }],

      // Reviewing
      productReviewed: [{
        object: 'product',
        action: 'reviewed'
      }],

      // App Lifecycle
      applicationInstalled: [{
        object: 'application',
        action: 'installed'
      }],
      applicationUpdated: [{
        object: 'application',
        action: 'updated'
      }],
      applicationOpened: [{
        object: 'application',
        action: 'opened'
      }],
      applicationBackgrounded: [{
        object: 'application',
        action: 'backgrounded'
      }],
      applicationUninstalled: [{
        object: 'application',
        action: 'uninstalled'
      }],

      // App Campaign and Referral Events
      installAttributed: [{
        object: 'install',
        action: 'attributed'
      }],
      deepLinkOpened: [{
        object: 'deep link',
        action: 'opened'
      }],
      pushNotificationReceived: [{
        object: 'push notification',
        action: 'received'
      }],
      pushNotificationTapped: [{
        object: 'push notification',
        action: 'tapped'
      }],
      pushNotificationBounced: [{
        object: 'push notification',
        action: 'bounced'
      }]
    };

    /**
     * Export the event map
     *
     * For each method
     *   - For each of its object:action alias pairs
     *     - For each permutation of that pair
     *       - Create a regex string
     *   - Join them and assign it to its respective method value
     *
     *  [{
     *    object: 'product list',
     *    action: 'viewed'
     *  },{
     *    object: 'product category',
     *    action: 'viewed'
     *  }] => /
     *    ^[ _]?product[ _]?list[ _]?viewed[ _]?
     *   |^[ _]?viewed[ _]?product[ _]?list[ _]?
     *   |^[ _]?product[ _]?category[ _]?viewed[ _]?
     *   |^[ _]?viewed[ _]?product[ _]?category[ _]?
     *   $/i
     *
     *  todo(cs/wj/nh): memoization strategy / build step?
     */

    module.exports = foldl(function transform(ret, pairs, method) {
      var values = map(function(pair) {
        return map(function(permutation) {
          var flattened = [].concat.apply([], map(function(words) {
            return words.split(' ');
          }, permutation));
          return '^[ _]?' + flattened.join('[ _]?') + '[ _]?';
        }, [
          [pair.action, pair.object],
          [pair.object, pair.action]
        ]).join('|');
      }, pairs);
      var conjoined = values.join('|') + '$';
      ret[method] = new RegExp(conjoined, 'i');
      return ret;
    }, {}, eventMap);
    });

    var require$$8 = (index$18 && typeof index$18 === 'object' && 'default' in index$18 ? index$18['default'] : index$18);

    var index$21 = createCommonjsModule(function (module) {
    'use strict';

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

    module.exports = arity;
    });

    var require$$0$5 = (index$21 && typeof index$21 === 'object' && 'default' in index$21 ? index$21['default'] : index$21);

    var index$20 = createCommonjsModule(function (module) {
    'use strict';

    /*
     * Module dependencies.
     */

    var arity = require$$0$5;

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
      if (!isNumber(n)) {
        throw new TypeError('Expected a number but received ' + typeof n);
      }

      if (!isFunction(fn)) {
        throw new TypeError('Expected a function but received ' + typeof fn);
      }

      var callCount = 0;

      return arity(fn.length, function() {
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

    module.exports = after;
    });

    var require$$13 = (index$20 && typeof index$20 === 'object' && 'default' in index$20 ? index$20['default'] : index$20);

    var protos = createCommonjsModule(function (module, exports) {
    'use strict';

    /**
     * Module dependencies.
     */

    var Emitter = require$$15;
    var after = require$$13;
    var each = require$$4;
    var events = require$$8;
    var every = require$$7$1;
    var fmt = require$$6$1;
    var foldl = require$$0$4;
    var is = require$$7;
    var loadIframe = require$$3$1;
    var loadScript = require$$2$1;
    var nextTick = require$$0$3;
    var normalize = require$$0$2;

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
    Emitter(exports);
    /* eslint-enable new-cap */

    /**
     * Initialize.
     */

    exports.initialize = function() {
      var ready = this.ready;
      nextTick(ready);
    };

    /**
     * Loaded?
     *
     * @api private
     * @return {boolean}
     */

    exports.loaded = function() {
      return false;
    };

    /**
     * Page.
     *
     * @api public
     * @param {Page} page
     */

    /* eslint-disable no-unused-vars */
    exports.page = function(page) {};
    /* eslint-enable no-unused-vars */

    /**
     * Track.
     *
     * @api public
     * @param {Track} track
     */

    /* eslint-disable no-unused-vars */
    exports.track = function(track) {};
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

    exports.map = function(options, key) {
      var normalizedComparator = normalize(key);
      var mappingType = getMappingType(options);

      if (mappingType === 'unknown') {
        return [];
      }

      return foldl(function(matchingValues, val, key) {
        var compare;
        var result;

        if (mappingType === 'map') {
          compare = key;
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

        if (normalize(compare) === normalizedComparator) {
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

    exports.invoke = function(method) {
      if (!this[method]) return;
      var args = Array.prototype.slice.call(arguments, 1);
      if (!this._ready) return this.queue(method, args);
      var ret;

      try {
        this.debug('%s with %o', method, args);
        ret = this[method].apply(this, args);
      } catch (e) {
        this.debug('error %o calling %s with %o', e, method, args);
      }

      return ret;
    };

    /**
     * Queue a `method` with `args`. If the integration assumes an initial
     * pageview, then let the first call to `page` pass through.
     *
     * @api private
     * @param {string} method
     * @param {Array} args
     */

    exports.queue = function(method, args) {
      if (method === 'page' && this._assumesPageview && !this._initialized) {
        return this.page.apply(this, args);
      }

      this._queue.push({ method: method, args: args });
    };

    /**
     * Flush the internal queue.
     *
     * @api private
     */

    exports.flush = function() {
      this._ready = true;
      var self = this;

      each(function(call) {
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

    exports.reset = function() {
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

    exports.load = function(name, locals, callback) {
      // Argument shuffling
      if (typeof name === 'function') { callback = name; locals = null; name = null; }
      if (name && typeof name === 'object') { callback = locals; locals = name; name = null; }
      if (typeof locals === 'function') { callback = locals; locals = null; }

      // Default arguments
      name = name || 'library';
      locals = locals || {};

      locals = this.locals(locals);
      var template = this.templates[name];
      if (!template) throw new Error(fmt('template "%s" not defined.', name));
      var attrs = render(template, locals);
      callback = callback || noop;
      var self = this;
      var el;

      switch (template.type) {
      case 'img':
        attrs.width = 1;
        attrs.height = 1;
        el = loadImage(attrs, callback);
        break;
      case 'script':
        el = loadScript(attrs, function(err) {
          if (!err) return callback();
          self.debug('error loading "%s" error="%s"', self.name, err);
        });
          // TODO: hack until refactoring load-script
        delete attrs.src;
        each(function(val, key) {
          el.setAttribute(key, val);
        }, attrs);
        break;
      case 'iframe':
        el = loadIframe(attrs, callback);
        break;
      default:
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

    exports.locals = function(locals) {
      locals = locals || {};
      var cache = Math.floor(new Date().getTime() / 3600000);
      if (!locals.hasOwnProperty('cache')) locals.cache = cache;
      each(function(val, key) {
        if (!locals.hasOwnProperty(key)) locals[key] = val;
      }, this.options);
      return locals;
    };

    /**
     * Simple way to emit ready.
     *
     * @api public
     */

    exports.ready = function() {
      this.emit('ready');
    };

    /**
     * Wrap the initialize method in an exists check, so we don't have to do it for
     * every single integration.
     *
     * @api private
     */

    exports._wrapInitialize = function() {
      var initialize = this.initialize;
      this.initialize = function() {
        this.debug('initialize');
        this._initialized = true;
        var ret = initialize.apply(this, arguments);
        this.emit('initialize');
        return ret;
      };

      if (this._assumesPageview) this.initialize = after(2, this.initialize);
    };

    /**
     * Wrap the page method to call `initialize` instead if the integration assumes
     * a pageview.
     *
     * @api private
     */

    exports._wrapPage = function() {
      var page = this.page;
      this.page = function() {
        if (this._assumesPageview && !this._initialized) {
          return this.initialize.apply(this, arguments);
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

    exports._wrapTrack = function() {
      var t = this.track;
      this.track = function(track) {
        var event = track.event();
        var called;
        var ret;

        for (var method in events) {
          if (has.call(events, method)) {
            var regexp = events[method];
            if (!this[method]) continue;
            if (!regexp.test(event)) continue;
            ret = this[method].apply(this, arguments);
            called = true;
            break;
          }
        }

        if (!called) ret = t.apply(this, arguments);
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
      if (is.array(mapping)) {
        return every(isMixed, mapping) ? 'mixed' : 'array';
      }
      if (is.object(mapping)) return 'map';
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
      if (!is.object(item)) return false;
      if (!is.string(item.key)) return false;
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
      fn = fn || function() {};
      var img = new Image();
      img.onerror = error(fn, 'failed to load pixel', img);
      img.onload = function() { fn(); };
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
      return function(e) {
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
      return foldl(function(attrs, val, key) {
        attrs[key] = val.replace(/\{\{\ *(\w+)\ *\}\}/g, function(_, $1) {
          return locals[$1];
        });
        return attrs;
      }, {}, template.attrs);
    }
    });

    var require$$1 = (protos && typeof protos === 'object' && 'default' in protos ? protos['default'] : protos);

    var index$22 = createCommonjsModule(function (module) {
    /**
     * Generate a slug from the given `str`.
     *
     * example:
     *
     *        generate('foo bar');
     *        // > foo-bar
     *
     * @param {String} str
     * @param {Object} options
     * @config {String|RegExp} [replace] characters to replace, defaulted to `/[^a-z0-9]/g`
     * @config {String} [separator] separator to insert, defaulted to `-`
     * @return {String}
     */

    module.exports = function (str, options) {
      options || (options = {});
      return str.toLowerCase()
        .replace(options.replace || /[^a-z0-9]/g, ' ')
        .replace(/^ +| +$/g, '')
        .replace(/ +/g, options.separator || '-')
    };
    });

    var require$$2$4 = (index$22 && typeof index$22 === 'object' && 'default' in index$22 ? index$22['default'] : index$22);

    var index$23 = createCommonjsModule(function (module) {
    'use strict';

    var has = Object.prototype.hasOwnProperty;

    /**
     * Copy the properties of one or more `objects` onto a destination object. Input objects are iterated over
     * in left-to-right order, so duplicate properties on later objects will overwrite those from
     * erevious ones. Only enumerable and own properties of the input objects are copied onto the
     * resulting object.
     *
     * @name extend
     * @api public
     * @category Object
     * @param {Object} dest The destination object.
     * @param {...Object} sources The source objects.
     * @return {Object} `dest`, extended with the properties of all `sources`.
     * @example
     * var a = { a: 'a' };
     * var b = { b: 'b' };
     * var c = { c: 'c' };
     *
     * extend(a, b, c);
     * //=> { a: 'a', b: 'b', c: 'c' };
     */
    var extend = function extend(dest /*, sources */) {
      var sources = Array.prototype.slice.call(arguments, 1);

      for (var i = 0; i < sources.length; i += 1) {
        for (var key in sources[i]) {
          if (has.call(sources[i], key)) {
            dest[key] = sources[i][key];
          }
        }
      }

      return dest;
    };

    /*
     * Exports.
     */

    module.exports = extend;
    });

    var require$$2$5 = (index$23 && typeof index$23 === 'object' && 'default' in index$23 ? index$23['default'] : index$23);

    var index$25 = createCommonjsModule(function (module) {
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

    var require$$0$6 = (index$25 && typeof index$25 === 'object' && 'default' in index$25 ? index$25['default'] : index$25);

    var index$26 = createCommonjsModule(function (module) {
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

    var require$$1$2 = (index$26 && typeof index$26 === 'object' && 'default' in index$26 ? index$26['default'] : index$26);

    var index$24 = createCommonjsModule(function (module) {
    'use strict';

    /*
     * Module dependencies.
     */

    var drop = require$$1$2;
    var rest = require$$0$6;

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

    var require$$5 = (index$24 && typeof index$24 === 'object' && 'default' in index$24 ? index$24['default'] : index$24);

    var index$27 = createCommonjsModule(function (module) {

    /**
     * Helpers.
     */

    var s = 1000
    var m = s * 60
    var h = m * 60
    var d = h * 24
    var y = d * 365.25

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} options
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    module.exports = function (val, options) {
      options = options || {}
      var type = typeof val
      if (type === 'string' && val.length > 0) {
        return parse(val)
      } else if (type === 'number' && isNaN(val) === false) {
        return options.long ?
    			fmtLong(val) :
    			fmtShort(val)
      }
      throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
    }

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      str = String(str)
      if (str.length > 10000) {
        return
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
      if (!match) {
        return
      }
      var n = parseFloat(match[1])
      var type = (match[2] || 'ms').toLowerCase()
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y
        case 'days':
        case 'day':
        case 'd':
          return n * d
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n
        default:
          return undefined
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + 'd'
      }
      if (ms >= h) {
        return Math.round(ms / h) + 'h'
      }
      if (ms >= m) {
        return Math.round(ms / m) + 'm'
      }
      if (ms >= s) {
        return Math.round(ms / s) + 's'
      }
      return ms + 'ms'
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong(ms) {
      return plural(ms, d, 'day') ||
        plural(ms, h, 'hour') ||
        plural(ms, m, 'minute') ||
        plural(ms, s, 'second') ||
        ms + ' ms'
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, n, name) {
      if (ms < n) {
        return
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + ' ' + name
      }
      return Math.ceil(ms / n) + ' ' + name + 's'
    }
    });

    var require$$0$8 = (index$27 && typeof index$27 === 'object' && 'default' in index$27 ? index$27['default'] : index$27);

    var debug = createCommonjsModule(function (module, exports) {
    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = createDebug.debug = createDebug.default = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require$$0$8;

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
     */

    exports.formatters = {};

    /**
     * Previous log timestamp.
     */

    var prevTime;

    /**
     * Select a color.
     * @param {String} namespace
     * @return {Number}
     * @api private
     */

    function selectColor(namespace) {
      var hash = 0, i;

      for (i in namespace) {
        hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }

      return exports.colors[Math.abs(hash) % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function createDebug(namespace) {

      function debug() {
        // disabled?
        if (!debug.enabled) return;

        var self = debug;

        // set `diff` timestamp
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // turn the `arguments` into a proper Array
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %O
          args.unshift('%O');
        }

        // apply any `formatters` transformations
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        // apply env-specific formatting (colors, etc.)
        exports.formatArgs.call(self, args);

        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);

      // env-specific initialization logic for debug instances
      if ('function' === typeof exports.init) {
        exports.init(debug);
      }

      return debug;
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      exports.save(namespaces);

      var split = (namespaces || '').split(/[\s,]+/);
      var len = split.length;

      for (var i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
      exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
    });

    var require$$0$7 = (debug && typeof debug === 'object' && 'default' in debug ? debug['default'] : debug);

    var browser = createCommonjsModule(function (module, exports) {
    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = require$$0$7;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = 'undefined' != typeof chrome
                   && 'undefined' != typeof chrome.storage
                      ? chrome.storage.local
                      : localstorage();

    /**
     * Colors.
     */

    exports.colors = [
      'lightseagreen',
      'forestgreen',
      'goldenrod',
      'dodgerblue',
      'darkorchid',
      'crimson'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
      // NB: In an Electron preload script, document will be defined but not fully
      // initialized. Since we know we're in Chrome, we'll just detect this case
      // explicitly
      if (typeof window !== 'undefined' && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
        return true;
      }

      // is webkit? http://stackoverflow.com/a/16459606/376773
      // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
      return (typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style) ||
        // is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== 'undefined' && window.console && (console.firebug || (console.exception && console.table))) ||
        // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
        // double check webkit in userAgent just in case we are in a worker
        (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return '[UnexpectedJSONParseError]: ' + err.message;
      }
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
      var useColors = this.useColors;

      args[0] = (useColors ? '%c' : '')
        + this.namespace
        + (useColors ? ' %c' : ' ')
        + args[0]
        + (useColors ? '%c ' : ' ')
        + '+' + exports.humanize(this.diff);

      if (!useColors) return;

      var c = 'color: ' + this.color;
      args.splice(1, 0, c, 'color: inherit')

      // the final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
          // we only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });

      args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
      // this hackery is required for IE8/9, where
      // the `console.log` function doesn't have 'apply'
      return 'object' === typeof console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem('debug');
        } else {
          exports.storage.debug = namespaces;
        }
      } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      try {
        return exports.storage.debug;
      } catch(e) {}

      // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
      if (typeof process !== 'undefined' && 'env' in process) {
        return process.env.DEBUG;
      }
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {}
    }

    /** Attach to Window*/
    if (window) {
      window.debug = exports;
    }
    });

    var require$$5$1 = (browser && typeof browser === 'object' && 'default' in browser ? browser['default'] : browser);

    var index$28 = createCommonjsModule(function (module) {
    'use strict';

    /*
     * Module dependencies.
     */

    var type = require$$2$2;

    /**
     * Deeply clone an object.
     *
     * @param {*} obj Any object.
     */

    var clone = function clone(obj) {
      var t = type(obj);

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

    module.exports = clone;
    });

    var require$$1$3 = (index$28 && typeof index$28 === 'object' && 'default' in index$28 ? index$28['default'] : index$28);

    var index$29 = createCommonjsModule(function (module) {
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

    module.exports = function(obj, fn){
      if ('string' == typeof fn) fn = obj[fn];
      if ('function' != typeof fn) throw new Error('bind() requires a function');
      var args = slice.call(arguments, 2);
      return function(){
        return fn.apply(obj, args.concat(slice.call(arguments)));
      }
    };
    });

    var require$$0$9 = (index$29 && typeof index$29 === 'object' && 'default' in index$29 ? index$29['default'] : index$29);

    var index$2 = createCommonjsModule(function (module) {
    'use strict';

    /**
     * Module dependencies.
     */

    var bind = require$$0$9;
    var clone = require$$1$3;
    var debug = require$$5$1;
    var defaults = require$$5;
    var extend = require$$2$5;
    var slug = require$$2$4;
    var protos = require$$1;
    var statics = require$$0$1;

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
        this.debug = debug('analytics:integration:' + slug(name));
        this.options = defaults(clone(options) || {}, this.defaults);
        this._queue = [];
        this.once('ready', bind(this, this.flush));

        Integration.emit('construct', this);
        this.ready = bind(this, this.ready);
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

    module.exports = createIntegration;
    });

    var require$$0 = (index$2 && typeof index$2 === 'object' && 'default' in index$2 ? index$2['default'] : index$2);

    var rngBrowser = createCommonjsModule(function (module) {
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

    module.exports = rng;
    });

    var require$$0$11 = (rngBrowser && typeof rngBrowser === 'object' && 'default' in rngBrowser ? rngBrowser['default'] : rngBrowser);

    var uuid$1 = createCommonjsModule(function (module) {
    //     uuid.js
    //
    //     Copyright (c) 2010-2012 Robert Kieffer
    //     MIT License - http://opensource.org/licenses/mit-license.php

    // Unique ID creation requires a high quality random # generator.  We feature
    // detect to determine the best RNG source, normalizing to a function that
    // returns 128-bits of randomness, since that's what's usually required
    var _rng = require$$0$11;

    // Maps for number <-> hex string conversion
    var _byteToHex = [];
    var _hexToByte = {};
    for (var i = 0; i < 256; i++) {
      _byteToHex[i] = (i + 0x100).toString(16).substr(1);
      _hexToByte[_byteToHex[i]] = i;
    }

    // **`parse()` - Parse a UUID into it's component bytes**
    function parse(s, buf, offset) {
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
    var _seedBytes = _rng();

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

      var rnds = options.random || (options.rng || _rng)();

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
    uuid.parse = parse;
    uuid.unparse = unparse;

    module.exports = uuid;
    });

    var require$$0$10 = (uuid$1 && typeof uuid$1 === 'object' && 'default' in uuid$1 ? uuid$1['default'] : uuid$1);

    var debug$1 = createCommonjsModule(function (module, exports) {
    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = createDebug.debug = createDebug.default = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require$$0$8;

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
     */

    exports.formatters = {};

    /**
     * Previous log timestamp.
     */

    var prevTime;

    /**
     * Select a color.
     * @param {String} namespace
     * @return {Number}
     * @api private
     */

    function selectColor(namespace) {
      var hash = 0, i;

      for (i in namespace) {
        hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }

      return exports.colors[Math.abs(hash) % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function createDebug(namespace) {

      function debug() {
        // disabled?
        if (!debug.enabled) return;

        var self = debug;

        // set `diff` timestamp
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // turn the `arguments` into a proper Array
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %O
          args.unshift('%O');
        }

        // apply any `formatters` transformations
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        // apply env-specific formatting (colors, etc.)
        exports.formatArgs.call(self, args);

        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);

      // env-specific initialization logic for debug instances
      if ('function' === typeof exports.init) {
        exports.init(debug);
      }

      return debug;
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      exports.save(namespaces);

      var split = (namespaces || '').split(/[\s,]+/);
      var len = split.length;

      for (var i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
      exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
    });

    var require$$0$14 = (debug$1 && typeof debug$1 === 'object' && 'default' in debug$1 ? debug$1['default'] : debug$1);

    var browser$1 = createCommonjsModule(function (module, exports) {
    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = require$$0$14;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = 'undefined' != typeof chrome
                   && 'undefined' != typeof chrome.storage
                      ? chrome.storage.local
                      : localstorage();

    /**
     * Colors.
     */

    exports.colors = [
      'lightseagreen',
      'forestgreen',
      'goldenrod',
      'dodgerblue',
      'darkorchid',
      'crimson'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
      // NB: In an Electron preload script, document will be defined but not fully
      // initialized. Since we know we're in Chrome, we'll just detect this case
      // explicitly
      if (typeof window !== 'undefined' && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
        return true;
      }

      // is webkit? http://stackoverflow.com/a/16459606/376773
      // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
      return (typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style) ||
        // is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== 'undefined' && window.console && (console.firebug || (console.exception && console.table))) ||
        // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
        // double check webkit in userAgent just in case we are in a worker
        (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return '[UnexpectedJSONParseError]: ' + err.message;
      }
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
      var useColors = this.useColors;

      args[0] = (useColors ? '%c' : '')
        + this.namespace
        + (useColors ? ' %c' : ' ')
        + args[0]
        + (useColors ? '%c ' : ' ')
        + '+' + exports.humanize(this.diff);

      if (!useColors) return;

      var c = 'color: ' + this.color;
      args.splice(1, 0, c, 'color: inherit')

      // the final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
          // we only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });

      args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
      // this hackery is required for IE8/9, where
      // the `console.log` function doesn't have 'apply'
      return 'object' === typeof console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem('debug');
        } else {
          exports.storage.debug = namespaces;
        }
      } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      try {
        return exports.storage.debug;
      } catch(e) {}

      // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
      if (typeof process !== 'undefined' && 'env' in process) {
        return process.env.DEBUG;
      }
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {}
    }

    /** Attach to Window*/
    if (window) {
      window.debug = exports;
    }
    });

    var require$$0$13 = (browser$1 && typeof browser$1 === 'object' && 'default' in browser$1 ? browser$1['default'] : browser$1);

    var index$30 = createCommonjsModule(function (module) {
    /**
     * Module dependencies.
     */

    var debug = require$$0$13('cookie');

    /**
     * Set or get cookie `name` with `value` and `options` object.
     *
     * @param {String} name
     * @param {String} value
     * @param {Object} options
     * @return {Mixed}
     * @api public
     */

    module.exports = function(name, value, options){
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
      return parse(str);
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

    function parse(str) {
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
        debug('error `encode(%o)` - %o', value, e)
      }
    }

    /**
     * Decode.
     */

    function decode(value) {
      try {
        return decodeURIComponent(value);
      } catch (e) {
        debug('error `decode(%o)` - %o', value, e)
      }
    }
    });

    var require$$0$12 = (index$30 && typeof index$30 === 'object' && 'default' in index$30 ? index$30['default'] : index$30);

    var inherits_browser = createCommonjsModule(function (module) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor
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
        ctor.super_ = superCtor
        var TempCtor = function () {}
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
      }
    }
    });

    var require$$2$7 = (inherits_browser && typeof inherits_browser === 'object' && 'default' in inherits_browser ? inherits_browser['default'] : inherits_browser);

    var index$31 = createCommonjsModule(function (module) {
    'use strict';

    var bind = require$$0$9;

    function bindAll(obj) {
      // eslint-disable-next-line guard-for-in
      for (var key in obj) {
        var val = obj[key];
        if (typeof val === 'function') {
          obj[key] = bind(obj, obj[key]);
        }
      }
      return obj;
    }

    module.exports = bindAll;
    });

    var require$$5$2 = (index$31 && typeof index$31 === 'object' && 'default' in index$31 ? index$31['default'] : index$31);

    var json3 = createCommonjsModule(function (module, exports) {
    /*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
    ;(function () {
      // Detect the `define` function exposed by asynchronous module loaders. The
      // strict `define` check is necessary for compatibility with `r.js`.
      var isLoader = typeof define === "function" && define.amd;

      // A set of types used to distinguish objects from primitives.
      var objectTypes = {
        "function": true,
        "object": true
      };

      // Detect the `exports` object exposed by CommonJS implementations.
      var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

      // Use the `global` object exposed by Node (including Browserify via
      // `insert-module-globals`), Narwhal, and Ringo as the default context,
      // and the `window` object in browsers. Rhino exports a `global` function
      // instead.
      var root = objectTypes[typeof window] && window || this,
          freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

      if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
        root = freeGlobal;
      }

      // Public: Initializes JSON 3 using the given `context` object, attaching the
      // `stringify` and `parse` functions to the specified `exports` object.
      function runInContext(context, exports) {
        context || (context = root["Object"]());
        exports || (exports = root["Object"]());

        // Native constructor aliases.
        var Number = context["Number"] || root["Number"],
            String = context["String"] || root["String"],
            Object = context["Object"] || root["Object"],
            Date = context["Date"] || root["Date"],
            SyntaxError = context["SyntaxError"] || root["SyntaxError"],
            TypeError = context["TypeError"] || root["TypeError"],
            Math = context["Math"] || root["Math"],
            nativeJSON = context["JSON"] || root["JSON"];

        // Delegate to the native `stringify` and `parse` implementations.
        if (typeof nativeJSON == "object" && nativeJSON) {
          exports.stringify = nativeJSON.stringify;
          exports.parse = nativeJSON.parse;
        }

        // Convenience aliases.
        var objectProto = Object.prototype,
            getClass = objectProto.toString,
            isProperty, forEach, undef;

        // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
        var isExtended = new Date(-3509827334573292);
        try {
          // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
          // results for certain dates in Opera >= 10.53.
          isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
            // Safari < 2.0.2 stores the internal millisecond time value correctly,
            // but clips the values returned by the date methods to the range of
            // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
            isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
        } catch (exception) {}

        // Internal: Determines whether the native `JSON.stringify` and `parse`
        // implementations are spec-compliant. Based on work by Ken Snyder.
        function has(name) {
          if (has[name] !== undef) {
            // Return cached feature test result.
            return has[name];
          }
          var isSupported;
          if (name == "bug-string-char-index") {
            // IE <= 7 doesn't support accessing string characters using square
            // bracket notation. IE 8 only supports this for primitives.
            isSupported = "a"[0] != "a";
          } else if (name == "json") {
            // Indicates whether both `JSON.stringify` and `JSON.parse` are
            // supported.
            isSupported = has("json-stringify") && has("json-parse");
          } else {
            var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
            // Test `JSON.stringify`.
            if (name == "json-stringify") {
              var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
              if (stringifySupported) {
                // A test function object with a custom `toJSON` method.
                (value = function () {
                  return 1;
                }).toJSON = value;
                try {
                  stringifySupported =
                    // Firefox 3.1b1 and b2 serialize string, number, and boolean
                    // primitives as object literals.
                    stringify(0) === "0" &&
                    // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                    // literals.
                    stringify(new Number()) === "0" &&
                    stringify(new String()) == '""' &&
                    // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                    // does not define a canonical JSON representation (this applies to
                    // objects with `toJSON` properties as well, *unless* they are nested
                    // within an object or array).
                    stringify(getClass) === undef &&
                    // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                    // FF 3.1b3 pass this test.
                    stringify(undef) === undef &&
                    // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                    // respectively, if the value is omitted entirely.
                    stringify() === undef &&
                    // FF 3.1b1, 2 throw an error if the given value is not a number,
                    // string, array, object, Boolean, or `null` literal. This applies to
                    // objects with custom `toJSON` methods as well, unless they are nested
                    // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                    // methods entirely.
                    stringify(value) === "1" &&
                    stringify([value]) == "[1]" &&
                    // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                    // `"[null]"`.
                    stringify([undef]) == "[null]" &&
                    // YUI 3.0.0b1 fails to serialize `null` literals.
                    stringify(null) == "null" &&
                    // FF 3.1b1, 2 halts serialization if an array contains a function:
                    // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                    // elides non-JSON values from objects and arrays, unless they
                    // define custom `toJSON` methods.
                    stringify([undef, getClass, null]) == "[null,null,null]" &&
                    // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                    // where character escape codes are expected (e.g., `\b` => `\u0008`).
                    stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                    // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                    stringify(null, value) === "1" &&
                    stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                    // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                    // serialize extended years.
                    stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                    // The milliseconds are optional in ES 5, but required in 5.1.
                    stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                    // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                    // four-digit years instead of six-digit years. Credits: @Yaffle.
                    stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                    // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                    // values less than 1000. Credits: @Yaffle.
                    stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                } catch (exception) {
                  stringifySupported = false;
                }
              }
              isSupported = stringifySupported;
            }
            // Test `JSON.parse`.
            if (name == "json-parse") {
              var parse = exports.parse;
              if (typeof parse == "function") {
                try {
                  // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                  // Conforming implementations should also coerce the initial argument to
                  // a string prior to parsing.
                  if (parse("0") === 0 && !parse(false)) {
                    // Simple parsing test.
                    value = parse(serialized);
                    var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                    if (parseSupported) {
                      try {
                        // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                        parseSupported = !parse('"\t"');
                      } catch (exception) {}
                      if (parseSupported) {
                        try {
                          // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                          // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                          // certain octal literals.
                          parseSupported = parse("01") !== 1;
                        } catch (exception) {}
                      }
                      if (parseSupported) {
                        try {
                          // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                          // points. These environments, along with FF 3.1b1 and 2,
                          // also allow trailing commas in JSON objects and arrays.
                          parseSupported = parse("1.") !== 1;
                        } catch (exception) {}
                      }
                    }
                  }
                } catch (exception) {
                  parseSupported = false;
                }
              }
              isSupported = parseSupported;
            }
          }
          return has[name] = !!isSupported;
        }

        if (!has("json")) {
          // Common `[[Class]]` name aliases.
          var functionClass = "[object Function]",
              dateClass = "[object Date]",
              numberClass = "[object Number]",
              stringClass = "[object String]",
              arrayClass = "[object Array]",
              booleanClass = "[object Boolean]";

          // Detect incomplete support for accessing string characters by index.
          var charIndexBuggy = has("bug-string-char-index");

          // Define additional utility methods if the `Date` methods are buggy.
          if (!isExtended) {
            var floor = Math.floor;
            // A mapping between the months of the year and the number of days between
            // January 1st and the first of the respective month.
            var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            // Internal: Calculates the number of days between the Unix epoch and the
            // first day of the given month.
            var getDay = function (year, month) {
              return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
            };
          }

          // Internal: Determines if a property is a direct property of the given
          // object. Delegates to the native `Object#hasOwnProperty` method.
          if (!(isProperty = objectProto.hasOwnProperty)) {
            isProperty = function (property) {
              var members = {}, constructor;
              if ((members.__proto__ = null, members.__proto__ = {
                // The *proto* property cannot be set multiple times in recent
                // versions of Firefox and SeaMonkey.
                "toString": 1
              }, members).toString != getClass) {
                // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
                // supports the mutable *proto* property.
                isProperty = function (property) {
                  // Capture and break the object's prototype chain (see section 8.6.2
                  // of the ES 5.1 spec). The parenthesized expression prevents an
                  // unsafe transformation by the Closure Compiler.
                  var original = this.__proto__, result = property in (this.__proto__ = null, this);
                  // Restore the original prototype chain.
                  this.__proto__ = original;
                  return result;
                };
              } else {
                // Capture a reference to the top-level `Object` constructor.
                constructor = members.constructor;
                // Use the `constructor` property to simulate `Object#hasOwnProperty` in
                // other environments.
                isProperty = function (property) {
                  var parent = (this.constructor || constructor).prototype;
                  return property in this && !(property in parent && this[property] === parent[property]);
                };
              }
              members = null;
              return isProperty.call(this, property);
            };
          }

          // Internal: Normalizes the `for...in` iteration algorithm across
          // environments. Each enumerated key is yielded to a `callback` function.
          forEach = function (object, callback) {
            var size = 0, Properties, members, property;

            // Tests for bugs in the current environment's `for...in` algorithm. The
            // `valueOf` property inherits the non-enumerable flag from
            // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
            (Properties = function () {
              this.valueOf = 0;
            }).prototype.valueOf = 0;

            // Iterate over a new instance of the `Properties` class.
            members = new Properties();
            for (property in members) {
              // Ignore all properties inherited from `Object.prototype`.
              if (isProperty.call(members, property)) {
                size++;
              }
            }
            Properties = members = null;

            // Normalize the iteration algorithm.
            if (!size) {
              // A list of non-enumerable properties inherited from `Object.prototype`.
              members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
              // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
              // properties.
              forEach = function (object, callback) {
                var isFunction = getClass.call(object) == functionClass, property, length;
                var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
                for (property in object) {
                  // Gecko <= 1.0 enumerates the `prototype` property of functions under
                  // certain conditions; IE does not.
                  if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                    callback(property);
                  }
                }
                // Manually invoke the callback for each non-enumerable property.
                for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
              };
            } else if (size == 2) {
              // Safari <= 2.0.4 enumerates shadowed properties twice.
              forEach = function (object, callback) {
                // Create a set of iterated properties.
                var members = {}, isFunction = getClass.call(object) == functionClass, property;
                for (property in object) {
                  // Store each property name to prevent double enumeration. The
                  // `prototype` property of functions is not enumerated due to cross-
                  // environment inconsistencies.
                  if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                    callback(property);
                  }
                }
              };
            } else {
              // No bugs detected; use the standard `for...in` algorithm.
              forEach = function (object, callback) {
                var isFunction = getClass.call(object) == functionClass, property, isConstructor;
                for (property in object) {
                  if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                    callback(property);
                  }
                }
                // Manually invoke the callback for the `constructor` property due to
                // cross-environment inconsistencies.
                if (isConstructor || isProperty.call(object, (property = "constructor"))) {
                  callback(property);
                }
              };
            }
            return forEach(object, callback);
          };

          // Public: Serializes a JavaScript `value` as a JSON string. The optional
          // `filter` argument may specify either a function that alters how object and
          // array members are serialized, or an array of strings and numbers that
          // indicates which properties should be serialized. The optional `width`
          // argument may be either a string or number that specifies the indentation
          // level of the output.
          if (!has("json-stringify")) {
            // Internal: A map of control characters and their escaped equivalents.
            var Escapes = {
              92: "\\\\",
              34: '\\"',
              8: "\\b",
              12: "\\f",
              10: "\\n",
              13: "\\r",
              9: "\\t"
            };

            // Internal: Converts `value` into a zero-padded string such that its
            // length is at least equal to `width`. The `width` must be <= 6.
            var leadingZeroes = "000000";
            var toPaddedString = function (width, value) {
              // The `|| 0` expression is necessary to work around a bug in
              // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
              return (leadingZeroes + (value || 0)).slice(-width);
            };

            // Internal: Double-quotes a string `value`, replacing all ASCII control
            // characters (characters with code unit values between 0 and 31) with
            // their escaped equivalents. This is an implementation of the
            // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
            var unicodePrefix = "\\u00";
            var quote = function (value) {
              var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
              var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
              for (; index < length; index++) {
                var charCode = value.charCodeAt(index);
                // If the character is a control character, append its Unicode or
                // shorthand escape sequence; otherwise, append the character as-is.
                switch (charCode) {
                  case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                    result += Escapes[charCode];
                    break;
                  default:
                    if (charCode < 32) {
                      result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                      break;
                    }
                    result += useCharIndex ? symbols[index] : value.charAt(index);
                }
              }
              return result + '"';
            };

            // Internal: Recursively serializes an object. Implements the
            // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
            var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
              var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
              try {
                // Necessary for host object support.
                value = object[property];
              } catch (exception) {}
              if (typeof value == "object" && value) {
                className = getClass.call(value);
                if (className == dateClass && !isProperty.call(value, "toJSON")) {
                  if (value > -1 / 0 && value < 1 / 0) {
                    // Dates are serialized according to the `Date#toJSON` method
                    // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                    // for the ISO 8601 date time string format.
                    if (getDay) {
                      // Manually compute the year, month, date, hours, minutes,
                      // seconds, and milliseconds if the `getUTC*` methods are
                      // buggy. Adapted from @Yaffle's `date-shim` project.
                      date = floor(value / 864e5);
                      for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                      for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                      date = 1 + date - getDay(year, month);
                      // The `time` value specifies the time within the day (see ES
                      // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                      // to compute `A modulo B`, as the `%` operator does not
                      // correspond to the `modulo` operation for negative numbers.
                      time = (value % 864e5 + 864e5) % 864e5;
                      // The hours, minutes, seconds, and milliseconds are obtained by
                      // decomposing the time within the day. See section 15.9.1.10.
                      hours = floor(time / 36e5) % 24;
                      minutes = floor(time / 6e4) % 60;
                      seconds = floor(time / 1e3) % 60;
                      milliseconds = time % 1e3;
                    } else {
                      year = value.getUTCFullYear();
                      month = value.getUTCMonth();
                      date = value.getUTCDate();
                      hours = value.getUTCHours();
                      minutes = value.getUTCMinutes();
                      seconds = value.getUTCSeconds();
                      milliseconds = value.getUTCMilliseconds();
                    }
                    // Serialize extended years correctly.
                    value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                      "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                      // Months, dates, hours, minutes, and seconds should have two
                      // digits; milliseconds should have three.
                      "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                      // Milliseconds are optional in ES 5.0, but required in 5.1.
                      "." + toPaddedString(3, milliseconds) + "Z";
                  } else {
                    value = null;
                  }
                } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
                  // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
                  // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
                  // ignores all `toJSON` methods on these objects unless they are
                  // defined directly on an instance.
                  value = value.toJSON(property);
                }
              }
              if (callback) {
                // If a replacement function was provided, call it to obtain the value
                // for serialization.
                value = callback.call(object, property, value);
              }
              if (value === null) {
                return "null";
              }
              className = getClass.call(value);
              if (className == booleanClass) {
                // Booleans are represented literally.
                return "" + value;
              } else if (className == numberClass) {
                // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                // `"null"`.
                return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
              } else if (className == stringClass) {
                // Strings are double-quoted and escaped.
                return quote("" + value);
              }
              // Recursively serialize objects and arrays.
              if (typeof value == "object") {
                // Check for cyclic structures. This is a linear search; performance
                // is inversely proportional to the number of unique nested objects.
                for (length = stack.length; length--;) {
                  if (stack[length] === value) {
                    // Cyclic structures cannot be serialized by `JSON.stringify`.
                    throw TypeError();
                  }
                }
                // Add the object to the stack of traversed objects.
                stack.push(value);
                results = [];
                // Save the current indentation level and indent one additional level.
                prefix = indentation;
                indentation += whitespace;
                if (className == arrayClass) {
                  // Recursively serialize array elements.
                  for (index = 0, length = value.length; index < length; index++) {
                    element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                    results.push(element === undef ? "null" : element);
                  }
                  result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
                } else {
                  // Recursively serialize object members. Members are selected from
                  // either a user-specified list of property names, or the object
                  // itself.
                  forEach(properties || value, function (property) {
                    var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                    if (element !== undef) {
                      // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                      // is not the empty string, let `member` {quote(property) + ":"}
                      // be the concatenation of `member` and the `space` character."
                      // The "`space` character" refers to the literal space
                      // character, not the `space` {width} argument provided to
                      // `JSON.stringify`.
                      results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                    }
                  });
                  result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
                }
                // Remove the object from the traversed object stack.
                stack.pop();
                return result;
              }
            };

            // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
            exports.stringify = function (source, filter, width) {
              var whitespace, callback, properties, className;
              if (objectTypes[typeof filter] && filter) {
                if ((className = getClass.call(filter)) == functionClass) {
                  callback = filter;
                } else if (className == arrayClass) {
                  // Convert the property names array into a makeshift set.
                  properties = {};
                  for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
                }
              }
              if (width) {
                if ((className = getClass.call(width)) == numberClass) {
                  // Convert the `width` to an integer and create a string containing
                  // `width` number of space characters.
                  if ((width -= width % 1) > 0) {
                    for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
                  }
                } else if (className == stringClass) {
                  whitespace = width.length <= 10 ? width : width.slice(0, 10);
                }
              }
              // Opera <= 7.54u2 discards the values associated with empty string keys
              // (`""`) only if they are used directly within an object member list
              // (e.g., `!("" in { "": 1})`).
              return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
            };
          }

          // Public: Parses a JSON source string.
          if (!has("json-parse")) {
            var fromCharCode = String.fromCharCode;

            // Internal: A map of escaped control characters and their unescaped
            // equivalents.
            var Unescapes = {
              92: "\\",
              34: '"',
              47: "/",
              98: "\b",
              116: "\t",
              110: "\n",
              102: "\f",
              114: "\r"
            };

            // Internal: Stores the parser state.
            var Index, Source;

            // Internal: Resets the parser state and throws a `SyntaxError`.
            var abort = function () {
              Index = Source = null;
              throw SyntaxError();
            };

            // Internal: Returns the next token, or `"$"` if the parser has reached
            // the end of the source string. A token may be a string, number, `null`
            // literal, or Boolean literal.
            var lex = function () {
              var source = Source, length = source.length, value, begin, position, isSigned, charCode;
              while (Index < length) {
                charCode = source.charCodeAt(Index);
                switch (charCode) {
                  case 9: case 10: case 13: case 32:
                    // Skip whitespace tokens, including tabs, carriage returns, line
                    // feeds, and space characters.
                    Index++;
                    break;
                  case 123: case 125: case 91: case 93: case 58: case 44:
                    // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                    // the current position.
                    value = charIndexBuggy ? source.charAt(Index) : source[Index];
                    Index++;
                    return value;
                  case 34:
                    // `"` delimits a JSON string; advance to the next character and
                    // begin parsing the string. String tokens are prefixed with the
                    // sentinel `@` character to distinguish them from punctuators and
                    // end-of-string tokens.
                    for (value = "@", Index++; Index < length;) {
                      charCode = source.charCodeAt(Index);
                      if (charCode < 32) {
                        // Unescaped ASCII control characters (those with a code unit
                        // less than the space character) are not permitted.
                        abort();
                      } else if (charCode == 92) {
                        // A reverse solidus (`\`) marks the beginning of an escaped
                        // control character (including `"`, `\`, and `/`) or Unicode
                        // escape sequence.
                        charCode = source.charCodeAt(++Index);
                        switch (charCode) {
                          case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                            // Revive escaped control characters.
                            value += Unescapes[charCode];
                            Index++;
                            break;
                          case 117:
                            // `\u` marks the beginning of a Unicode escape sequence.
                            // Advance to the first character and validate the
                            // four-digit code point.
                            begin = ++Index;
                            for (position = Index + 4; Index < position; Index++) {
                              charCode = source.charCodeAt(Index);
                              // A valid sequence comprises four hexdigits (case-
                              // insensitive) that form a single hexadecimal value.
                              if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                                // Invalid Unicode escape sequence.
                                abort();
                              }
                            }
                            // Revive the escaped character.
                            value += fromCharCode("0x" + source.slice(begin, Index));
                            break;
                          default:
                            // Invalid escape sequence.
                            abort();
                        }
                      } else {
                        if (charCode == 34) {
                          // An unescaped double-quote character marks the end of the
                          // string.
                          break;
                        }
                        charCode = source.charCodeAt(Index);
                        begin = Index;
                        // Optimize for the common case where a string is valid.
                        while (charCode >= 32 && charCode != 92 && charCode != 34) {
                          charCode = source.charCodeAt(++Index);
                        }
                        // Append the string as-is.
                        value += source.slice(begin, Index);
                      }
                    }
                    if (source.charCodeAt(Index) == 34) {
                      // Advance to the next character and return the revived string.
                      Index++;
                      return value;
                    }
                    // Unterminated string.
                    abort();
                  default:
                    // Parse numbers and literals.
                    begin = Index;
                    // Advance past the negative sign, if one is specified.
                    if (charCode == 45) {
                      isSigned = true;
                      charCode = source.charCodeAt(++Index);
                    }
                    // Parse an integer or floating-point value.
                    if (charCode >= 48 && charCode <= 57) {
                      // Leading zeroes are interpreted as octal literals.
                      if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                        // Illegal octal literal.
                        abort();
                      }
                      isSigned = false;
                      // Parse the integer component.
                      for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                      // Floats cannot contain a leading decimal point; however, this
                      // case is already accounted for by the parser.
                      if (source.charCodeAt(Index) == 46) {
                        position = ++Index;
                        // Parse the decimal component.
                        for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                        if (position == Index) {
                          // Illegal trailing decimal.
                          abort();
                        }
                        Index = position;
                      }
                      // Parse exponents. The `e` denoting the exponent is
                      // case-insensitive.
                      charCode = source.charCodeAt(Index);
                      if (charCode == 101 || charCode == 69) {
                        charCode = source.charCodeAt(++Index);
                        // Skip past the sign following the exponent, if one is
                        // specified.
                        if (charCode == 43 || charCode == 45) {
                          Index++;
                        }
                        // Parse the exponential component.
                        for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                        if (position == Index) {
                          // Illegal empty exponent.
                          abort();
                        }
                        Index = position;
                      }
                      // Coerce the parsed value to a JavaScript number.
                      return +source.slice(begin, Index);
                    }
                    // A negative sign may only precede numbers.
                    if (isSigned) {
                      abort();
                    }
                    // `true`, `false`, and `null` literals.
                    if (source.slice(Index, Index + 4) == "true") {
                      Index += 4;
                      return true;
                    } else if (source.slice(Index, Index + 5) == "false") {
                      Index += 5;
                      return false;
                    } else if (source.slice(Index, Index + 4) == "null") {
                      Index += 4;
                      return null;
                    }
                    // Unrecognized token.
                    abort();
                }
              }
              // Return the sentinel `$` character if the parser has reached the end
              // of the source string.
              return "$";
            };

            // Internal: Parses a JSON `value` token.
            var get = function (value) {
              var results, hasMembers;
              if (value == "$") {
                // Unexpected end of input.
                abort();
              }
              if (typeof value == "string") {
                if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                  // Remove the sentinel `@` character.
                  return value.slice(1);
                }
                // Parse object and array literals.
                if (value == "[") {
                  // Parses a JSON array, returning a new JavaScript array.
                  results = [];
                  for (;; hasMembers || (hasMembers = true)) {
                    value = lex();
                    // A closing square bracket marks the end of the array literal.
                    if (value == "]") {
                      break;
                    }
                    // If the array literal contains elements, the current token
                    // should be a comma separating the previous element from the
                    // next.
                    if (hasMembers) {
                      if (value == ",") {
                        value = lex();
                        if (value == "]") {
                          // Unexpected trailing `,` in array literal.
                          abort();
                        }
                      } else {
                        // A `,` must separate each array element.
                        abort();
                      }
                    }
                    // Elisions and leading commas are not permitted.
                    if (value == ",") {
                      abort();
                    }
                    results.push(get(value));
                  }
                  return results;
                } else if (value == "{") {
                  // Parses a JSON object, returning a new JavaScript object.
                  results = {};
                  for (;; hasMembers || (hasMembers = true)) {
                    value = lex();
                    // A closing curly brace marks the end of the object literal.
                    if (value == "}") {
                      break;
                    }
                    // If the object literal contains members, the current token
                    // should be a comma separator.
                    if (hasMembers) {
                      if (value == ",") {
                        value = lex();
                        if (value == "}") {
                          // Unexpected trailing `,` in object literal.
                          abort();
                        }
                      } else {
                        // A `,` must separate each object member.
                        abort();
                      }
                    }
                    // Leading commas are not permitted, object property names must be
                    // double-quoted strings, and a `:` must separate each property
                    // name and value.
                    if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                      abort();
                    }
                    results[value.slice(1)] = get(lex());
                  }
                  return results;
                }
                // Unexpected token encountered.
                abort();
              }
              return value;
            };

            // Internal: Updates a traversed object member.
            var update = function (source, property, callback) {
              var element = walk(source, property, callback);
              if (element === undef) {
                delete source[property];
              } else {
                source[property] = element;
              }
            };

            // Internal: Recursively traverses a parsed JSON object, invoking the
            // `callback` function for each value. This is an implementation of the
            // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
            var walk = function (source, property, callback) {
              var value = source[property], length;
              if (typeof value == "object" && value) {
                // `forEach` can't be used to traverse an array in Opera <= 8.54
                // because its `Object#hasOwnProperty` implementation returns `false`
                // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
                if (getClass.call(value) == arrayClass) {
                  for (length = value.length; length--;) {
                    update(value, length, callback);
                  }
                } else {
                  forEach(value, function (property) {
                    update(value, property, callback);
                  });
                }
              }
              return callback.call(source, property, value);
            };

            // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
            exports.parse = function (source, callback) {
              var result, value;
              Index = 0;
              Source = "" + source;
              result = get(lex());
              // If a JSON string contains multiple tokens, it is invalid.
              if (lex() != "$") {
                abort();
              }
              // Reset the parser state.
              Index = Source = null;
              return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
            };
          }
        }

        exports["runInContext"] = runInContext;
        return exports;
      }

      if (freeExports && !isLoader) {
        // Export for CommonJS environments.
        runInContext(root, freeExports);
      } else {
        // Export for web browsers and JavaScript engines.
        var nativeJSON = root.JSON,
            previousJSON = root["JSON3"],
            isRestored = false;

        var JSON3 = runInContext(root, (root["JSON3"] = {
          // Public: Restores the original value of the global `JSON` object and
          // returns a reference to the `JSON3` object.
          "noConflict": function () {
            if (!isRestored) {
              isRestored = true;
              root.JSON = nativeJSON;
              root["JSON3"] = previousJSON;
              nativeJSON = previousJSON = null;
            }
            return JSON3;
          }
        }));

        root.JSON = {
          "parse": JSON3.parse,
          "stringify": JSON3.stringify
        };
      }

      // Export for asynchronous module loaders.
      if (isLoader) {
        define(function () {
          return JSON3;
        });
      }
    }).call(commonjsGlobal);
    });

    var require$$1$5 = (json3 && typeof json3 === 'object' && 'default' in json3 ? json3['default'] : json3);

    var store$1 = createCommonjsModule(function (module) {
    "use strict"

    var JSON = require$$1$5;

    module.exports = (function() {
    	// Store.js
    	var store = {},
    		win = (typeof window != 'undefined' ? window : commonjsGlobal),
    		doc = win.document,
    		localStorageName = 'localStorage',
    		scriptTag = 'script',
    		storage

    	store.disabled = false
    	store.version = '1.3.20'
    	store.set = function(key, value) {}
    	store.get = function(key, defaultVal) {}
    	store.has = function(key) { return store.get(key) !== undefined }
    	store.remove = function(key) {}
    	store.clear = function() {}
    	store.transact = function(key, defaultVal, transactionFn) {
    		if (transactionFn == null) {
    			transactionFn = defaultVal
    			defaultVal = null
    		}
    		if (defaultVal == null) {
    			defaultVal = {}
    		}
    		var val = store.get(key, defaultVal)
    		transactionFn(val)
    		store.set(key, val)
    	}
    	store.getAll = function() {
    		var ret = {}
    		store.forEach(function(key, val) {
    			ret[key] = val
    		})
    		return ret
    	}
    	store.forEach = function() {}
    	store.serialize = function(value) {
    		return JSON.stringify(value)
    	}
    	store.deserialize = function(value) {
    		if (typeof value != 'string') { return undefined }
    		try { return JSON.parse(value) }
    		catch(e) { return value || undefined }
    	}

    	// Functions to encapsulate questionable FireFox 3.6.13 behavior
    	// when about.config::dom.storage.enabled === false
    	// See https://github.com/marcuswestin/store.js/issues#issue/13
    	function isLocalStorageNameSupported() {
    		try { return (localStorageName in win && win[localStorageName]) }
    		catch(err) { return false }
    	}

    	if (isLocalStorageNameSupported()) {
    		storage = win[localStorageName]
    		store.set = function(key, val) {
    			if (val === undefined) { return store.remove(key) }
    			storage.setItem(key, store.serialize(val))
    			return val
    		}
    		store.get = function(key, defaultVal) {
    			var val = store.deserialize(storage.getItem(key))
    			return (val === undefined ? defaultVal : val)
    		}
    		store.remove = function(key) { storage.removeItem(key) }
    		store.clear = function() { storage.clear() }
    		store.forEach = function(callback) {
    			for (var i=0; i<storage.length; i++) {
    				var key = storage.key(i)
    				callback(key, store.get(key))
    			}
    		}
    	} else if (doc && doc.documentElement.addBehavior) {
    		var storageOwner,
    			storageContainer
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
    			storageContainer = new ActiveXObject('htmlfile')
    			storageContainer.open()
    			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
    			storageContainer.close()
    			storageOwner = storageContainer.w.frames[0].document
    			storage = storageOwner.createElement('div')
    		} catch(e) {
    			// somehow ActiveXObject instantiation failed (perhaps some special
    			// security settings or otherwse), fall back to per-path storage
    			storage = doc.createElement('div')
    			storageOwner = doc.body
    		}
    		var withIEStorage = function(storeFunction) {
    			return function() {
    				var args = Array.prototype.slice.call(arguments, 0)
    				args.unshift(storage)
    				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
    				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
    				storageOwner.appendChild(storage)
    				storage.addBehavior('#default#userData')
    				storage.load(localStorageName)
    				var result = storeFunction.apply(store, args)
    				storageOwner.removeChild(storage)
    				return result
    			}
    		}

    		// In IE7, keys cannot start with a digit or contain certain chars.
    		// See https://github.com/marcuswestin/store.js/issues/40
    		// See https://github.com/marcuswestin/store.js/issues/83
    		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
    		var ieKeyFix = function(key) {
    			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
    		}
    		store.set = withIEStorage(function(storage, key, val) {
    			key = ieKeyFix(key)
    			if (val === undefined) { return store.remove(key) }
    			storage.setAttribute(key, store.serialize(val))
    			storage.save(localStorageName)
    			return val
    		})
    		store.get = withIEStorage(function(storage, key, defaultVal) {
    			key = ieKeyFix(key)
    			var val = store.deserialize(storage.getAttribute(key))
    			return (val === undefined ? defaultVal : val)
    		})
    		store.remove = withIEStorage(function(storage, key) {
    			key = ieKeyFix(key)
    			storage.removeAttribute(key)
    			storage.save(localStorageName)
    		})
    		store.clear = withIEStorage(function(storage) {
    			var attributes = storage.XMLDocument.documentElement.attributes
    			storage.load(localStorageName)
    			for (var i=attributes.length-1; i>=0; i--) {
    				storage.removeAttribute(attributes[i].name)
    			}
    			storage.save(localStorageName)
    		})
    		store.forEach = withIEStorage(function(storage, callback) {
    			var attributes = storage.XMLDocument.documentElement.attributes
    			for (var i=0, attr; attr=attributes[i]; ++i) {
    				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
    			}
    		})
    	}

    	try {
    		var testKey = '__storejs__'
    		store.set(testKey, testKey)
    		if (store.get(testKey) != testKey) { store.disabled = true }
    		store.remove(testKey)
    	} catch(e) {
    		store.disabled = true
    	}
    	store.enabled = !store.disabled

    	return store
    }())
    });

    var require$$0$16 = (store$1 && typeof store$1 === 'object' && 'default' in store$1 ? store$1['default'] : store$1);

    var store = createCommonjsModule(function (module) {
    /*
     * Module dependencies.
     */

    var bindAll = require$$5$2;
    var defaults = require$$5;
    var store = require$$0$16;

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
      defaults(options, { enabled: true });

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

    module.exports = bindAll(new Store());


    /**
     * Expose the `Store` constructor.
     */

    module.exports.Store = Store;
    });

    var require$$0$15 = (store && typeof store === 'object' && 'default' in store ? store['default'] : store);

    var memory = createCommonjsModule(function (module) {
    /*
     * Module Dependencies.
     */

    var bindAll = require$$5$2;
    var clone = require$$1$3;

    /**
     * HOP.
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * Expose `Memory`
     */

    module.exports = bindAll(new Memory());

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
      this.store[key] = clone(value);
      return true;
    };

    /**
     * Get a `key`.
     *
     * @param {String} key
     */

    Memory.prototype.get = function(key) {
      if (!has.call(this.store, key)) return;
      return clone(this.store[key]);
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
    });

    var require$$1$6 = (memory && typeof memory === 'object' && 'default' in memory ? memory['default'] : memory);

    var index$33 = createCommonjsModule(function (module, exports) {
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

    var require$$0$18 = (index$33 && typeof index$33 === 'object' && 'default' in index$33 ? index$33['default'] : index$33);

    var index$32 = createCommonjsModule(function (module, exports) {
    'use strict';

    /**
     * Module dependencies.
     */

    var parse = require$$0$18.parse;
    var cookie = require$$0$12;

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
    domain.cookie = cookie;

    /*
     * Exports.
     */

    exports = module.exports = domain;
    });

    var require$$0$17 = (index$32 && typeof index$32 === 'object' && 'default' in index$32 ? index$32['default'] : index$32);

    var cookie = createCommonjsModule(function (module) {
    /**
     * Module dependencies.
     */

    var bindAll = require$$5$2;
    var clone = require$$1$3;
    var cookie = require$$0$12;
    // var debug = require('debug')('analytics.js:cookie');
    var defaults = require$$5;
    var json = require$$1$5;
    var topDomain = require$$0$17;

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

      var domain = '.' + topDomain(window.location.href);
      if (domain === '.') domain = null;

      this._options = defaults(options, {
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
        value = json.stringify(value);
        cookie(key, value, clone(this._options));
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
        var value = cookie(key);
        value = value ? json.parse(value) : null;
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
        cookie(key, null, clone(this._options));
        return true;
      } catch (e) {
        return false;
      }
    };


    /**
     * Expose the cookie singleton.
     */

    module.exports = bindAll(new Cookie());


    /**
     * Expose the `Cookie` constructor.
     */

    module.exports.Cookie = Cookie;
    });

    var require$$4$2 = (cookie && typeof cookie === 'object' && 'default' in cookie ? cookie['default'] : cookie);

    var entity = createCommonjsModule(function (module) {
    /*
     * Module dependencies.
     */

    // var clone = require('@ndhoule/clone');
    var cookie = require$$4$2;
    // var debug = require('debug')('analytics:entity');
    var defaults = require$$5;
    var extend = require$$2$5;
    var memory = require$$1$6;
    var store = require$$0$15;
    // var isodateTraverse = require('@segment/isodate-traverse');

    /**
     * Expose `Entity`
     */

    module.exports = Entity;


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
      cookie.set('ajs:cookies', true);

      // cookies are enabled.
      if (cookie.get('ajs:cookies')) {
        cookie.remove('ajs:cookies');
        this._storage = cookie;
        return;
      }

      // localStorage is enabled.
      if (store.enabled) {
        this._storage = store;
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
      this._options = defaults(options || {}, this.defaults || {});
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
      default:
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
      default:
          // No default case
      }
    };


    /**
     * Get the entity's traits. Always convert ISO date strings into real dates,
     * since they aren't parsed back from local storage.
     *
     * @return {Object}
     */

    Entity.prototype._getTraits = function() {
      // var ret = this._options.persist ? store.get(this._options.localStorage.key) : this._traits;
      // return ret ? isodateTraverse(clone(ret)) : {};
      return {};
    };


    /**
     * Set the entity's `traits`.
     *
     * @param {Object} traits
     */

    Entity.prototype._setTraits = function(traits) {
      // traits = traits || {};
      // if (this._options.persist) {
      //   store.set(this._options.localStorage.key, traits);
      // } else {
      //   this._traits = traits;
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
      cookie.set(this._options.cookie.key, this.id());
      store.set(this._options.localStorage.key, this.traits());
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
      this.id(cookie.get(this._options.cookie.key));
      this.traits(store.get(this._options.localStorage.key));
    };
    });

    var require$$4$1 = (entity && typeof entity === 'object' && 'default' in entity ? entity['default'] : entity);

    var user = createCommonjsModule(function (module) {
    /*
     * Module dependencies.
     */

    var Entity = require$$4$1;
    var bindAll = require$$5$2;
    // var cookie = require('./cookie');
    // var debug = require('debug')('analytics:user');
    var inherit = require$$2$7;
    var rawCookie = require$$0$12;
    var uuid = require$$0$10;

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
      Entity.call(this, options);
    }


    /**
     * Inherit `Entity`
     */

    inherit(User, Entity);

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
      var ret = Entity.prototype.id.apply(this, arguments);
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
      anonymousId = uuid.v4();
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
      Entity.prototype.load.call(this);
    };


    /**
     * Expose the user singleton.
     */

    module.exports = bindAll(new User());


    /**
     * Expose the `User` constructor.
     */

    module.exports.User = User;
    });

    var require$$2$6 = (user && typeof user === 'object' && 'default' in user ? user['default'] : user);

    var index$34 = createCommonjsModule(function (module) {
    'use strict';

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

    module.exports = canonical;
    });

    var require$$2$8 = (index$34 && typeof index$34 === 'object' && 'default' in index$34 ? index$34['default'] : index$34);

    var pageDefaults = createCommonjsModule(function (module) {
    /*
     * Module dependencies.
     */

    var canonical = require$$2$8;
    var includes = require$$3;
    var url = require$$0$18;

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
        search: searchPath(),
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
      var canon = canonical();
      if (!canon) return window.location.pathname;
      var parsed = url.parse(canon);
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
      var canon = canonical();
      if (canon) return includes('?', canon) ? canon : canon + search;
      var url = window.location.href;
      var i = url.indexOf('#');
      return i === -1 ? url : url.slice(0, i);
    }

    /**
     * Return the search path for the page
     * This is preferable to window.location.search because SPAs
     * can have a # in the url which will include the query param in
     * the hash
     *
     * @return {string}
     */

    function searchPath() {
      var url = window.location.href;
      var u = url.indexOf('?');
      return u === -1 ? '' : url.slice(u, -1);
    }

    /*
     * Exports.
     */

    module.exports = pageDefaults;
    });

    var require$$4$3 = (pageDefaults && typeof pageDefaults === 'object' && 'default' in pageDefaults ? pageDefaults['default'] : pageDefaults);

    var normalize = createCommonjsModule(function (module) {
    /**
     * Module Dependencies.
     */

    // var debug = require('debug')('analytics.js:normalize');
    var defaults = require$$5;
    var each = require$$4;
    var includes = require$$3;
    var map = require$$2$3;
    var type = require$$2$2;
    var uuid = require$$0$10;

    /**
     * HOP.
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * Expose `normalize`
     */

    module.exports = normalize;

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
      var lower = map(function(s) { return s.toLowerCase(); }, list);
      var opts = msg.options || {};
      var integrations = opts.integrations || {};
      var providers = opts.providers || {};
      var context = opts.context || {};
      var ret = {};
      // debug('<-', msg);

      // integrations.
      each(function(value, key) {
        if (!integration(key)) return;
        if (!has.call(integrations, key)) integrations[key] = value;
        delete opts[key];
      }, opts);

      // providers.
      delete opts.providers;
      each(function(value, key) {
        if (!integration(key)) return;
        if (type(integrations[key]) === 'object') return;
        if (has.call(integrations, key) && typeof providers[key] === 'boolean') return;
        integrations[key] = value;
      }, providers);

      // move all toplevel options to msg
      // and the rest to context.
      each(function(value, key) {
        if (includes(key, toplevel)) {
          ret[key] = opts[key];
        } else {
          context[key] = opts[key];
        }
      }, opts);

      // cleanup
      delete msg.options;
      ret.integrations = integrations;
      ret.context = context;
      ret = defaults(ret, msg);
      if (!ret.eventId) {
        ret.eventId = uuid.v4();
      }
      // debug('->', ret);
      return ret;

      function integration(name) {
        return !!(includes(name, list) || name.toLowerCase() === 'all' || includes(name.toLowerCase(), lower));
      }
    }
    });

    var require$$5$3 = (normalize && typeof normalize === 'object' && 'default' in normalize ? normalize['default'] : normalize);

    var index$36 = createCommonjsModule(function (module) {
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

    var require$$0$20 = (index$36 && typeof index$36 === 'object' && 'default' in index$36 ? index$36['default'] : index$36);

    var index$37 = createCommonjsModule(function (module) {
    module.exports = function isEmail (string) {
        return (/.+\@.+\..+/).test(string);
    };
    });

    var require$$2$9 = (index$37 && typeof index$37 === 'object' && 'default' in index$37 ? index$37['default'] : index$37);

    var index$38 = createCommonjsModule(function (module) {
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
      }

      if (val === null) return 'null';
      if (val === undefined) return 'undefined';
      if (val === Object(val)) return 'object';

      return typeof val;
    };
    });

    var require$$0$21 = (index$38 && typeof index$38 === 'object' && 'default' in index$38 ? index$38['default'] : index$38);

    var utils = createCommonjsModule(function (module, exports) {
    'use strict';

    exports.inherit = require$$2$7;
    exports.clone = require$$1$3;
    exports.type = require$$0$21;
    });

    var require$$1$8 = (utils && typeof utils === 'object' && 'default' in utils ? utils['default'] : utils);

    var index$39 = createCommonjsModule(function (module, exports) {
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

    var require$$1$9 = (index$39 && typeof index$39 === 'object' && 'default' in index$39 ? index$39['default'] : index$39);

    var seconds = createCommonjsModule(function (module, exports) {
    'use strict';

    /**
     * Matcher.
     */

    var matcher = /\d{10}/;


    /**
     * Check whether a string is a second date string.
     *
     * @param {string} string
     * @return {Boolean}
     */
    exports.is = function(string) {
      return matcher.test(string);
    };


    /**
     * Convert a second string to a date.
     *
     * @param {string} seconds
     * @return {Date}
     */
    exports.parse = function(seconds) {
      var millis = parseInt(seconds, 10) * 1000;
      return new Date(millis);
    };
    });

    var require$$0$22 = (seconds && typeof seconds === 'object' && 'default' in seconds ? seconds['default'] : seconds);

    var milliseconds = createCommonjsModule(function (module, exports) {
    'use strict';

    /**
     * Matcher.
     */

    var matcher = /\d{13}/;


    /**
     * Check whether a string is a millisecond date string.
     *
     * @param {string} string
     * @return {boolean}
     */
    exports.is = function(string) {
      return matcher.test(string);
    };


    /**
     * Convert a millisecond string to a date.
     *
     * @param {string} millis
     * @return {Date}
     */
    exports.parse = function(millis) {
      millis = parseInt(millis, 10);
      return new Date(millis);
    };
    });

    var require$$1$11 = (milliseconds && typeof milliseconds === 'object' && 'default' in milliseconds ? milliseconds['default'] : milliseconds);

    var index$41 = createCommonjsModule(function (module, exports) {
    'use strict';

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

    exports.parse = function(iso) {
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

    exports.is = function(string, strict) {
      if (strict && (/^\d{4}-\d{2}-\d{2}/).test(string) === false) {
        return false;
      }
      return matcher.test(string);
    };
    });

    var require$$0$23 = (index$41 && typeof index$41 === 'object' && 'default' in index$41 ? index$41['default'] : index$41);

    var index$42 = createCommonjsModule(function (module) {
    /**!
     * is
     * the definitive JavaScript type testing library
     *
     * @copyright 2013 Enrico Marino
     * @license MIT
     */

    var objProto = Object.prototype;
    var owns = objProto.hasOwnProperty;
    var toString = objProto.toString;
    var isActualNaN = function (value) {
      return value !== value;
    };
    var NON_HOST_TYPES = {
      "boolean": 1,
      "number": 1,
      "string": 1,
      "undefined": 1
    };

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

    is.a =
    is.type = function (value, type) {
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
      return value !== undefined;
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
      var type = toString.call(value);
      var key;

      if ('[object Array]' === type || '[object Arguments]' === type) {
        return value.length === 0;
      }

      if ('[object Object]' === type) {
        for (key in value) if (owns.call(value, key)) return false;
        return true;
      }

      if ('[object String]' === type) {
        return '' === value;
      }

      return false;
    };

    /**
     * is.equal
     * Test if `value` is equal to `other`.
     *
     * @param {Mixed} value value to test
     * @param {Mixed} other value to compare with
     * @return {Boolean} true if `value` is equal to `other`, false otherwise
     */

    is.equal = function (value, other) {
      var type = toString.call(value)
      var key;

      if (type !== toString.call(other)) {
        return false;
      }

      if ('[object Object]' === type) {
        for (key in value) {
          if (!is.equal(value[key], other[key])) {
            return false;
          }
        }
        return true;
      }

      if ('[object Array]' === type) {
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

      if ('[object Function]' === type) {
        return value.prototype === other.prototype;
      }

      if ('[object Date]' === type) {
        return value.getTime() === other.getTime();
      }

      return value === other;
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
     * is.null
     * Test if `value` is null.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is null, false otherwise
     * @api public
     */

    is['null'] = function (value) {
      return value === null;
    };

    /**
     * is.undefined
     * Test if `value` is undefined.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is undefined, false otherwise
     * @api public
     */

    is.undefined = function (value) {
      return value === undefined;
    };

    /**
     * Test arguments.
     */

    /**
     * is.arguments
     * Test if `value` is an arguments object.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an arguments object, false otherwise
     * @api public
     */

    is.arguments = function (value) {
      var isStandardArguments = '[object Arguments]' === toString.call(value);
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

    is.array = function (value) {
      return '[object Array]' === toString.call(value);
    };

    /**
     * is.arguments.empty
     * Test if `value` is an empty arguments object.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an empty arguments object, false otherwise
     * @api public
     */
    is.arguments.empty = function (value) {
      return is.arguments(value) && value.length === 0;
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
      return !!value && !is.boolean(value)
        && owns.call(value, 'length')
        && isFinite(value.length)
        && is.number(value.length)
        && value.length >= 0;
    };

    /**
     * Test boolean.
     */

    /**
     * is.boolean
     * Test if `value` is a boolean.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a boolean, false otherwise
     * @api public
     */

    is.boolean = function (value) {
      return '[object Boolean]' === toString.call(value);
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
      return is.boolean(value) && (value === false || value.valueOf() === false);
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
      return is.boolean(value) && (value === true || value.valueOf() === true);
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
      return '[object Date]' === toString.call(value);
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
      return '[object Error]' === toString.call(value);
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
      return isAlert || '[object Function]' === toString.call(value);
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
      return '[object Number]' === toString.call(value);
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
      return is.number(value) && !isActualNaN(value) && value % 1 !== 0;
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
     * is.int
     * Test if `value` is an integer.
     *
     * @param value to test
     * @return {Boolean} true if `value` is an integer, false otherwise
     * @api public
     */

    is.int = function (value) {
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
      return value && '[object Object]' === toString.call(value);
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
      return '[object RegExp]' === toString.call(value);
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
      return '[object String]' === toString.call(value);
    };
    });

    var require$$3$2 = (index$42 && typeof index$42 === 'object' && 'default' in index$42 ? index$42['default'] : index$42);

    var index$40 = createCommonjsModule(function (module) {
    'use strict';

    var is = require$$3$2;
    var isodate = require$$0$23;
    var milliseconds = require$$1$11;
    var seconds = require$$0$22;

    /**
     * Returns a new Javascript Date object, allowing a variety of extra input types
     * over the native Date constructor.
     *
     * @param {Date|string|number} val
     */
    module.exports = function newDate(val) {
      if (is.date(val)) return val;
      if (is.number(val)) return new Date(toMs(val));

      // date strings
      if (isodate.is(val)) {
        return isodate.parse(val);
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
    });

    var require$$1$10 = (index$40 && typeof index$40 === 'object' && 'default' in index$40 ? index$40['default'] : index$40);

    var index$46 = createCommonjsModule(function (module) {
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

    var require$$1$14 = (index$46 && typeof index$46 === 'object' && 'default' in index$46 ? index$46['default'] : index$46);

    var index$45 = createCommonjsModule(function (module) {
    /**
     * Module Dependencies
     */

    var expr;
    try {
      expr = require$$1$14;
    } catch(e) {
      expr = require$$1$14;
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

    var require$$0$25 = (index$45 && typeof index$45 === 'object' && 'default' in index$45 ? index$45['default'] : index$45);

    var index$47 = createCommonjsModule(function (module) {
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

    var require$$2$11 = (index$47 && typeof index$47 === 'object' && 'default' in index$47 ? index$47['default'] : index$47);

    var index$44 = createCommonjsModule(function (module) {
    /**
     * Module dependencies.
     */

    try {
      var type = require$$2$11;
    } catch (err) {
      var type = require$$2$11;
    }

    var toFunction = require$$0$25;

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

    var require$$1$13 = (index$44 && typeof index$44 === 'object' && 'default' in index$44 ? index$44['default'] : index$44);

    var index$43 = createCommonjsModule(function (module) {
    'use strict';

    var type = require$$2$2;
    var each = require$$1$13;
    var isodate = require$$0$23;

    /**
     * Expose `traverse`.
     */

    module.exports = traverse;

    /**
     * Traverse an object or array, and return a clone with all ISO strings parsed
     * into Date objects.
     *
     * @param {Object} obj
     * @return {Object}
     */

    function traverse(input, strict) {
      if (strict === undefined) strict = true;

      if (type(input) === 'object') return object(input, strict);
      if (type(input) === 'array') return array(input, strict);
      return input;
    }

    /**
     * Object traverser.
     *
     * @param {Object} obj
     * @param {Boolean} strict
     * @return {Object}
     */

    function object(obj, strict) {
      each(obj, function(key, val) {
        if (isodate.is(val, strict)) {
          obj[key] = isodate.parse(val);
        } else if (type(val) === 'object' || type(val) === 'array') {
          traverse(val, strict);
        }
      });
      return obj;
    }

    /**
     * Array traverser.
     *
     * @param {Array} arr
     * @param {Boolean} strict
     * @return {Array}
     */

    function array(arr, strict) {
      each(arr, function(val, x) {
        if (type(val) === 'object') {
          traverse(val, strict);
        } else if (isodate.is(val, strict)) {
          arr[x] = isodate.parse(val);
        }
      });
      return arr;
    }
    });

    var require$$1$12 = (index$43 && typeof index$43 === 'object' && 'default' in index$43 ? index$43['default'] : index$43);

    var isEnabled = createCommonjsModule(function (module) {
    'use strict';

    /**
     * A few integrations are disabled by default. They must be explicitly
     * enabled by setting options[Provider] = true.
     */

    var disabled = {
      Salesforce: true
    };

    /**
     * Check whether an integration should be enabled by default.
     *
     * @param {string} integration
     * @return {boolean}
     */

    module.exports = function(integration) {
      return !disabled[integration];
    };
    });

    var require$$4$4 = (isEnabled && typeof isEnabled === 'object' && 'default' in isEnabled ? isEnabled['default'] : isEnabled);

    var address = createCommonjsModule(function (module) {
    'use strict';

    /**
     * Module dependencies.
     */

    var get = require$$0$20;

    /**
     * Add address getters to `proto`.
     *
     * @param {Function} proto
     */
    module.exports = function(proto) {
      proto.zip = trait('postalCode', 'zip');
      proto.country = trait('country');
      proto.street = trait('street');
      proto.state = trait('state');
      proto.city = trait('city');
      proto.region = trait('region');

      function trait(a, b) {
        return function() {
          var traits = this.traits();
          var props = this.properties ? this.properties() : {};

          return get(traits, 'address.' + a)
            || get(traits, a)
            || (b ? get(traits, 'address.' + b) : null)
            || (b ? get(traits, b) : null)
            || get(props, 'address.' + a)
            || get(props, a)
            || (b ? get(props, 'address.' + b) : null)
            || (b ? get(props, b) : null);
        };
      }
    };
    });

    var require$$5$4 = (address && typeof address === 'object' && 'default' in address ? address['default'] : address);

    var facade = createCommonjsModule(function (module) {
    'use strict';

    var address = require$$5$4;
    var clone = require$$1$8.clone;
    var isEnabled = require$$4$4;
    var newDate = require$$1$10;
    var objCase = require$$0$20;
    var traverse = require$$1$12;
    var type = require$$1$8.type;

    /**
     * Initialize a new `Facade` with an `obj` of arguments.
     *
     * @param {Object} obj
     * @param {Object} opts
     */
    function Facade(obj, opts) {
      opts = opts || {};
      if (!('clone' in opts)) opts.clone = true;
      if (opts.clone) obj = clone(obj);
      if (!('traverse' in opts)) opts.traverse = true;
      if (!('timestamp' in obj)) obj.timestamp = new Date();
      else obj.timestamp = newDate(obj.timestamp);
      if (opts.traverse) traverse(obj);
      this.opts = opts;
      this.obj = obj;
    }

    /**
     * Mixin address traits.
     */

    address(Facade.prototype);

    /**
     * Return a proxy function for a `field` that will attempt to first use methods,
     * and fallback to accessing the underlying object directly. You can specify
     * deeply nested fields too like:
     *
     *   this.proxy('options.Librato');
     *
     * @param {string} field
     */
    Facade.prototype.proxy = function(field) {
      var fields = field.split('.');
      field = fields.shift();

      // Call a function at the beginning to take advantage of facaded fields
      var obj = this[field] || this.field(field);
      if (!obj) return obj;
      if (typeof obj === 'function') obj = obj.call(this) || {};
      if (fields.length === 0) return this.opts.clone ? transform(obj) : obj;

      obj = objCase(obj, fields.join('.'));
      return this.opts.clone ? transform(obj) : obj;
    };

    /**
     * Directly access a specific `field` from the underlying object, returning a
     * clone so outsiders don't mess with stuff.
     *
     * @param {string} field
     * @return {*}
     */
    Facade.prototype.field = function(field) {
      var obj = this.obj[field];
      return this.opts.clone ? transform(obj) : obj;
    };

    /**
     * Utility method to always proxy a particular `field`. You can specify deeply
     * nested fields too like:
     *
     *   Facade.proxy('options.Librato');
     *
     * @param {string} field
     * @return {Function}
     */
    Facade.proxy = function(field) {
      return function() {
        return this.proxy(field);
      };
    };

    /**
     * Utility method to directly access a `field`.
     *
     * @param {string} field
     * @return {Function}
     */
    Facade.field = function(field) {
      return function() {
        return this.field(field);
      };
    };

    /**
     * Proxy multiple `path`.
     *
     * @param {string} path
     * @return {Array}
     */
    Facade.multi = function(path) {
      return function() {
        var multi = this.proxy(path + 's');
        if (type(multi) === 'array') return multi;
        var one = this.proxy(path);
        if (one) one = [this.opts.clone ? clone(one) : one];
        return one || [];
      };
    };

    /**
     * Proxy one `path`.
     *
     * @param {string} path
     * @return {*}
     */
    Facade.one = function(path) {
      return function() {
        var one = this.proxy(path);
        if (one) return one;
        var multi = this.proxy(path + 's');
        if (type(multi) === 'array') return multi[0];
      };
    };

    /**
     * Get the basic json object of this facade.
     *
     * @return {Object}
     */
    Facade.prototype.json = function() {
      var ret = this.opts.clone ? clone(this.obj) : this.obj;
      if (this.type) ret.type = this.type();
      return ret;
    };

    /**
     * Get the options of a call (formerly called "context"). If you pass an
     * integration name, it will get the options for that specific integration, or
     * undefined if the integration is not enabled.
     *
     * @param {string} [integration]
     * @return {Object or Null}
     */
    Facade.prototype.options = function(integration) {
      var obj = this.obj.options || this.obj.context || {};
      var options = this.opts.clone ? clone(obj) : obj;
      if (!integration) return options;
      if (!this.enabled(integration)) return;
      var integrations = this.integrations();
      var value = integrations[integration] || objCase(integrations, integration);
      if (typeof value !== 'object') value = objCase(this.options(), integration);
      return typeof value === 'object' ? value : {};
    };

    Facade.prototype.context = Facade.prototype.options;

    /**
     * Check whether an integration is enabled.
     *
     * @param {string} integration
     * @return {boolean}
     */
    Facade.prototype.enabled = function(integration) {
      var allEnabled = this.proxy('options.providers.all');
      if (typeof allEnabled !== 'boolean') allEnabled = this.proxy('options.all');
      if (typeof allEnabled !== 'boolean') allEnabled = this.proxy('integrations.all');
      if (typeof allEnabled !== 'boolean') allEnabled = true;

      var enabled = allEnabled && isEnabled(integration);
      var options = this.integrations();

      // If the integration is explicitly enabled or disabled, use that
      // First, check options.providers for backwards compatibility
      if (options.providers && options.providers.hasOwnProperty(integration)) {
        enabled = options.providers[integration];
      }

      // Next, check for the integration's existence in 'options' to enable it.
      // If the settings are a boolean, use that, otherwise it should be enabled.
      if (options.hasOwnProperty(integration)) {
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
     * @api private
     * @param {string} integration
     * @return {Object}
     */
    Facade.prototype.integrations = function() {
      return this.obj.integrations || this.proxy('options.providers') || this.options();
    };

    /**
     * Check whether the user is active.
     *
     * @return {boolean}
     */
    Facade.prototype.active = function() {
      var active = this.proxy('options.active');
      if (active === null || active === undefined) active = true;
      return active;
    };

    /**
     * Get `sessionId / anonymousId`.
     *
     * @api public
     * @return {*}
     */
    Facade.prototype.anonymousId = function() {
      return this.field('anonymousId') || this.field('sessionId');
    };

    Facade.prototype.sessionId = Facade.prototype.anonymousId;

    /**
     * Get `groupId` from `context.groupId`.
     *
     * @api public
     * @return {string}
     */
    Facade.prototype.groupId = Facade.proxy('options.groupId');

    /**
     * Get the call's "super properties" which are just traits that have been
     * passed in as if from an identify call.
     *
     * @param {Object} aliases
     * @return {Object}
     */
    Facade.prototype.traits = function(aliases) {
      var ret = this.proxy('options.traits') || {};
      var id = this.userId();
      aliases = aliases || {};

      if (id) ret.id = id;

      for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy('options.traits.' + alias) : this[alias]();
        if (value == null) continue;
        ret[aliases[alias]] = value;
        delete ret[alias];
      }

      return ret;
    };

    /**
     * Add a convenient way to get the library name and version
     */
    Facade.prototype.library = function() {
      var library = this.proxy('options.library');
      if (!library) return { name: 'unknown', version: null };
      if (typeof library === 'string') return { name: library, version: null };
      return library;
    };

    /**
     * Return the device information or an empty object
     *
     * @return {Object}
     */
    Facade.prototype.device = function() {
      var device = this.proxy('context.device');
      if (type(device) !== 'object') device = {};
      var library = this.library().name;
      if (device.type) return device;

      if (library.indexOf('ios') > -1) device.type = 'ios';
      if (library.indexOf('android') > -1) device.type = 'android';
      return device;
    };

    /**
     * Set up some basic proxies.
     */

    Facade.prototype.userAgent = Facade.proxy('context.userAgent');
    Facade.prototype.timezone = Facade.proxy('context.timezone');
    Facade.prototype.timestamp = Facade.field('timestamp');
    Facade.prototype.channel = Facade.field('channel');
    Facade.prototype.ip = Facade.proxy('context.ip');
    Facade.prototype.userId = Facade.field('userId');

    /**
     * Return the cloned and traversed object
     *
     * @param {*} obj
     * @return {*}
     */
    function transform(obj) {
      return clone(obj);
    }

    /**
     * Exports.
     */

    module.exports = Facade;
    });

    var require$$0$24 = (facade && typeof facade === 'object' && 'default' in facade ? facade['default'] : facade);

    var identify = createCommonjsModule(function (module) {
    'use strict';

    var Facade = require$$0$24;
    var get = require$$0$20;
    var inherit = require$$1$8.inherit;
    var isEmail = require$$2$9;
    var newDate = require$$1$10;
    var trim = require$$1$9;
    var type = require$$1$8.type;

    /**
     * Initialize a new `Identify` facade with a `dictionary` of arguments.
     *
     * @param {Object} dictionary
     *   @param {string} userId
     *   @param {string} sessionId
     *   @param {Object} traits
     *   @param {Object} options
     * @param {Object} opts
     *   @property {boolean|undefined} clone
     */
    function Identify(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    /**
     * Inherit from `Facade`.
     */

    inherit(Identify, Facade);

    /**
     * Get the facade's action.
     */
    Identify.prototype.action = function() {
      return 'identify';
    };

    Identify.prototype.type = Identify.prototype.action;

    /**
     * Get the user's traits.
     *
     * @param {Object} aliases
     * @return {Object}
     */
    Identify.prototype.traits = function(aliases) {
      var ret = this.field('traits') || {};
      var id = this.userId();
      aliases = aliases || {};

      if (id) ret.id = id;

      for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy('traits.' + alias) : this[alias]();
        if (value == null) continue;
        ret[aliases[alias]] = value;
        if (alias !== aliases[alias]) delete ret[alias];
      }

      return ret;
    };

    /**
     * Get the user's email, falling back to their user ID if it's a valid email.
     *
     * @return {string}
     */
    Identify.prototype.email = function() {
      var email = this.proxy('traits.email');
      if (email) return email;

      var userId = this.userId();
      if (isEmail(userId)) return userId;
    };

    /**
     * Get the user's created date, optionally looking for `createdAt` since lots of
     * people do that instead.
     *
     * @return {Date|undefined}
     */
    Identify.prototype.created = function() {
      var created = this.proxy('traits.created') || this.proxy('traits.createdAt');
      if (created) return newDate(created);
    };

    /**
     * Get the company created date.
     *
     * @return {Date|undefined}
     */
    Identify.prototype.companyCreated = function() {
      var created = this.proxy('traits.company.created') || this.proxy('traits.company.createdAt');

      if (created) {
        return newDate(created);
      }
    };

    /**
     * Get the user's name, optionally combining a first and last name if that's all
     * that was provided.
     *
     * @return {string|undefined}
     */
    Identify.prototype.name = function() {
      var name = this.proxy('traits.name');
      if (typeof name === 'string') {
        return trim(name);
      }

      var firstName = this.firstName();
      var lastName = this.lastName();
      if (firstName && lastName) {
        return trim(firstName + ' ' + lastName);
      }
    };

    /**
     * Get the user's first name, optionally splitting it out of a single name if
     * that's all that was provided.
     *
     * @return {string|undefined}
     */
    Identify.prototype.firstName = function() {
      var firstName = this.proxy('traits.firstName');
      if (typeof firstName === 'string') {
        return trim(firstName);
      }

      var name = this.proxy('traits.name');
      if (typeof name === 'string') {
        return trim(name).split(' ')[0];
      }
    };

    /**
     * Get the user's last name, optionally splitting it out of a single name if
     * that's all that was provided.
     *
     * @return {string|undefined}
     */
    Identify.prototype.lastName = function() {
      var lastName = this.proxy('traits.lastName');
      if (typeof lastName === 'string') {
        return trim(lastName);
      }

      var name = this.proxy('traits.name');
      if (typeof name !== 'string') {
        return;
      }

      var space = trim(name).indexOf(' ');
      if (space === -1) {
        return;
      }

      return trim(name.substr(space + 1));
    };

    /**
     * Get the user's unique id.
     *
     * @return {string|undefined}
     */
    Identify.prototype.uid = function() {
      return this.userId() || this.username() || this.email();
    };

    /**
     * Get description.
     *
     * @return {string}
     */
    Identify.prototype.description = function() {
      return this.proxy('traits.description') || this.proxy('traits.background');
    };

    /**
     * Get the age.
     *
     * If the age is not explicitly set
     * the method will compute it from `.birthday()`
     * if possible.
     *
     * @return {number}
     */
    Identify.prototype.age = function() {
      var date = this.birthday();
      var age = get(this.traits(), 'age');
      if (age != null) return age;
      if (type(date) !== 'date') return;
      var now = new Date();
      return now.getFullYear() - date.getFullYear();
    };

    /**
     * Get the avatar.
     *
     * .photoUrl needed because help-scout
     * implementation uses `.avatar || .photoUrl`.
     *
     * .avatarUrl needed because trakio uses it.
     *
     * @return {*}
     */
    Identify.prototype.avatar = function() {
      var traits = this.traits();
      return get(traits, 'avatar') || get(traits, 'photoUrl') || get(traits, 'avatarUrl');
    };

    /**
     * Get the position.
     *
     * .jobTitle needed because some integrations use it.
     *
     * @return {*}
     */
    Identify.prototype.position = function() {
      var traits = this.traits();
      return get(traits, 'position') || get(traits, 'jobTitle');
    };

    /**
     * Setup sme basic "special" trait proxies.
     */

    Identify.prototype.username = Facade.proxy('traits.username');
    Identify.prototype.website = Facade.one('traits.website');
    Identify.prototype.websites = Facade.multi('traits.website');
    Identify.prototype.phone = Facade.one('traits.phone');
    Identify.prototype.phones = Facade.multi('traits.phone');
    Identify.prototype.address = Facade.proxy('traits.address');
    Identify.prototype.gender = Facade.proxy('traits.gender');
    Identify.prototype.birthday = Facade.proxy('traits.birthday');

    /**
     * Exports.
     */

    module.exports = Identify;
    });

    var require$$2$10 = (identify && typeof identify === 'object' && 'default' in identify ? identify['default'] : identify);

    var track$1 = createCommonjsModule(function (module) {
    'use strict';

    var inherit = require$$1$8.inherit;
    var type = require$$1$8.type;
    var Facade = require$$0$24;
    var Identify = require$$2$10;
    var isEmail = require$$2$9;
    var get = require$$0$20;

    /**
     * Initialize a new `Track` facade with a `dictionary` of arguments.
     *
     * @param {object} dictionary
     *   @property {string} event
     *   @property {string} userId
     *   @property {string} sessionId
     *   @property {Object} properties
     *   @property {Object} options
     * @param {Object} opts
     *   @property {boolean|undefined} clone
     */

    function Track(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    /**
     * Inherit from `Facade`.
     */

    inherit(Track, Facade);

    /**
     * Return the facade's action.
     *
     * @return {string}
     */

    Track.prototype.action = function() {
      return 'track';
    };

    Track.prototype.type = Track.prototype.action;

    /**
     * Setup some basic proxies.
     */

    Track.prototype.event = Facade.field('event');
    Track.prototype.value = Facade.proxy('properties.value');

    /**
     * Misc
     */

    Track.prototype.category = Facade.proxy('properties.category');

    /**
     * Ecommerce
     */

    Track.prototype.id = Facade.proxy('properties.id');
    Track.prototype.sku = Facade.proxy('properties.sku');
    Track.prototype.tax = Facade.proxy('properties.tax');
    Track.prototype.name = Facade.proxy('properties.name');
    Track.prototype.price = Facade.proxy('properties.price');
    Track.prototype.total = Facade.proxy('properties.total');
    Track.prototype.repeat = Facade.proxy('properties.repeat');
    Track.prototype.coupon = Facade.proxy('properties.coupon');
    Track.prototype.shipping = Facade.proxy('properties.shipping');
    Track.prototype.discount = Facade.proxy('properties.discount');

    /**
     * Description
     */

    Track.prototype.description = Facade.proxy('properties.description');

    /**
     * Plan
     */

    Track.prototype.plan = Facade.proxy('properties.plan');

    /**
     * Order id.
     *
     * @return {string}
     */
    Track.prototype.orderId = function() {
      return this.proxy('properties.id')
        || this.proxy('properties.orderId');
    };

    /**
     * Get subtotal.
     *
     * @return {number}
     */
    Track.prototype.subtotal = function() {
      var subtotal = get(this.properties(), 'subtotal');
      var total = this.total();

      if (subtotal) return subtotal;
      if (!total) return 0;

      var n = this.tax();
      if (n) total -= n;
      n = this.shipping();
      if (n) total -= n;
      n = this.discount();
      if (n) total += n;

      return total;
    };

    /**
     * Get products.
     *
     * @return {Array}
     */
    Track.prototype.products = function() {
      var props = this.properties();
      var products = get(props, 'products');
      return type(products) === 'array' ? products : [];
    };

    /**
     * Get quantity.
     *
     * @return {number}
     */
    Track.prototype.quantity = function() {
      var props = this.obj.properties || {};
      return props.quantity || 1;
    };

    /**
     * Get currency.
     *
     * @return {string}
     */
    Track.prototype.currency = function() {
      var props = this.obj.properties || {};
      return props.currency || 'USD';
    };

    /**
     * BACKWARDS COMPATIBILITY: should probably re-examine where these come from.
     */

    Track.prototype.referrer = function() {
      return this.proxy('context.referrer.url')
        || this.proxy('context.page.referrer')
        || this.proxy('properties.referrer');
    };

    Track.prototype.query = Facade.proxy('options.query');

    /**
     * Get the call's properties.
     *
     * @param {Object} aliases
     * @return {Object}
     */
    Track.prototype.properties = function(aliases) {
      var ret = this.field('properties') || {};
      aliases = aliases || {};

      for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy('properties.' + alias) : this[alias]();
        if (value == null) continue;
        ret[aliases[alias]] = value;
        delete ret[alias];
      }

      return ret;
    };

    /**
     * Get the call's username.
     *
     * @return {string|undefined}
     */
    Track.prototype.username = function() {
      return this.proxy('traits.username')
        || this.proxy('properties.username')
        || this.userId()
        || this.sessionId();
    };

    /**
     * Get the call's email, using an the user ID if it's a valid email.
     *
     * @return {string|undefined}
     */
    Track.prototype.email = function() {
      var email = this.proxy('traits.email')
        || this.proxy('properties.email')
        || this.proxy('options.traits.email');
      if (email) return email;

      var userId = this.userId();
      if (isEmail(userId)) return userId;
    };

    /**
     * Get the call's revenue, parsing it from a string with an optional leading
     * dollar sign.
     *
     * For products/services that don't have shipping and are not directly taxed,
     * they only care about tracking `revenue`. These are things like
     * SaaS companies, who sell monthly subscriptions. The subscriptions aren't
     * taxed directly, and since it's a digital product, it has no shipping.
     *
     * The only case where there's a difference between `revenue` and `total`
     * (in the context of analytics) is on ecommerce platforms, where they want
     * the `revenue` function to actually return the `total` (which includes
     * tax and shipping, total = subtotal + tax + shipping). This is probably
     * because on their backend they assume tax and shipping has been applied to
     * the value, and so can get the revenue on their own.
     *
     * @return {number}
     */
    Track.prototype.revenue = function() {
      var revenue = this.proxy('properties.revenue');
      var event = this.event();

      // it's always revenue, unless it's called during an order completion.
      if (!revenue && event && event.match(/completed ?order/i)) {
        revenue = this.proxy('properties.total');
      }

      return currency(revenue);
    };

    /**
     * Get cents.
     *
     * @return {number}
     */
    Track.prototype.cents = function() {
      var revenue = this.revenue();
      return typeof revenue !== 'number' ? this.value() || 0 : revenue * 100;
    };

    /**
     * A utility to turn the pieces of a track call into an identify. Used for
     * integrations with super properties or rate limits.
     *
     * TODO: remove me.
     *
     * @return {Facade}
     */
    Track.prototype.identify = function() {
      var json = this.json();
      json.traits = this.traits();
      return new Identify(json, this.opts);
    };

    /**
     * Get float from currency value.
     *
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

    /**
     * Exports.
     */

    module.exports = Track;
    });

    var require$$1$7 = (track$1 && typeof track$1 === 'object' && 'default' in track$1 ? track$1['default'] : track$1);

    var page$1 = createCommonjsModule(function (module) {
    'use strict';

    var inherit = require$$1$8.inherit;
    var Facade = require$$0$24;
    var Track = require$$1$7;
    var isEmail = require$$2$9;

    /**
     * Initialize new `Page` facade with `dictionary`.
     *
     * @param {Object} dictionary
     *   @param {string} category
     *   @param {string} name
     *   @param {Object} traits
     *   @param {Object} options
     * @param {Object} opts
     *   @property {Boolean|Undefined} clone
     */

    function Page(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    /**
     * Inherit from `Facade`
     */

    inherit(Page, Facade);

    /**
     * Get the facade's action.
     *
     * @return {string}
     */
    Page.prototype.action = function() {
      return 'page';
    };

    Page.prototype.type = Page.prototype.action;

    /**
     * Fields
     */

    Page.prototype.category = Facade.field('category');
    Page.prototype.name = Facade.field('name');

    /**
     * Proxies.
     */

    Page.prototype.title = Facade.proxy('properties.title');
    Page.prototype.path = Facade.proxy('properties.path');
    Page.prototype.url = Facade.proxy('properties.url');

    /**
     * Referrer.
     */
    Page.prototype.referrer = function() {
      return this.proxy('context.referrer.url')
        || this.proxy('context.page.referrer')
        || this.proxy('properties.referrer');
    };

    /**
     * Get the page properties mixing `category` and `name`.
     *
     * @param {Object} aliases
     * @return {Object}
     */
    Page.prototype.properties = function(aliases) {
      var props = this.field('properties') || {};
      var category = this.category();
      var name = this.name();
      aliases = aliases || {};

      if (category) props.category = category;
      if (name) props.name = name;

      for (var alias in aliases) {
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
     * Get the user's email, falling back to their user ID if it's a valid email.
     *
     * @return {string}
     */
    Page.prototype.email = function() {
      var email = this.proxy('context.traits.email') || this.proxy('properties.email');
      if (email) return email;

      var userId = this.userId();
      if (isEmail(userId)) return userId;
    };

    /**
     * Get the page fullName.
     *
     * @return {string}
     */
    Page.prototype.fullName = function() {
      var category = this.category();
      var name = this.name();
      return name && category
        ? category + ' ' + name
        : name;
    };

    /**
     * Get event with `name`.
     *
     * @return {string}
     */
    Page.prototype.event = function(name) {
      return name
        ? 'Viewed ' + name + ' Page'
        : 'Loaded a Page';
    };

    /**
     * Convert this Page to a Track facade with `name`.
     *
     * @param {string} name
     * @return {Track}
     */
    Page.prototype.track = function(name) {
      var json = this.json();
      json.event = this.event(name);
      json.timestamp = this.timestamp();
      json.properties = this.properties();
      return new Track(json, this.opts);
    };

    /**
     * Exports.
     */

    module.exports = Page;
    });

    var require$$1$15 = (page$1 && typeof page$1 === 'object' && 'default' in page$1 ? page$1['default'] : page$1);

    var screen = createCommonjsModule(function (module) {
    'use strict';

    var inherit = require$$1$8.inherit;
    var Page = require$$1$15;
    var Track = require$$1$7;

    /**
     * Initialize new `Screen` facade with `dictionary`.
     *
     * @param {Object} dictionary
     *   @param {string} category
     *   @param {string} name
     *   @param {Object} traits
     *   @param {Object} options
     * @param {Object} opts
     *   @property {boolean|undefined} clone
     */
    function Screen(dictionary, opts) {
      Page.call(this, dictionary, opts);
    }

    /**
     * Inherit from `Page`
     */

    inherit(Screen, Page);

    /**
     * Get the facade's action.
     *
     * @api public
     * @return {string}
     */
    Screen.prototype.action = function() {
      return 'screen';
    };

    Screen.prototype.type = Screen.prototype.action;

    /**
     * Get event with `name`.
     *
     * @api public
     * @param {string} name
     * @return {string}
     */
    Screen.prototype.event = function(name) {
      return name ? 'Viewed ' + name + ' Screen' : 'Loaded a Screen';
    };

    /**
     * Convert this Screen.
     *
     * @api public
     * @param {string} name
     * @return {Track}
     */
    Screen.prototype.track = function(name) {
      var json = this.json();
      json.event = this.event(name);
      json.timestamp = this.timestamp();
      json.properties = this.properties();
      return new Track(json, this.opts);
    };

    /**
     * Exports.
     */

    module.exports = Screen;
    });

    var require$$0$19 = (screen && typeof screen === 'object' && 'default' in screen ? screen['default'] : screen);

    var group = createCommonjsModule(function (module) {
    'use strict';

    /**
     * Module dependencies.
     */

    var inherit = require$$1$8.inherit;
    var isEmail = require$$2$9;
    var newDate = require$$1$10;
    var Facade = require$$0$24;

    /**
     * Initialize a new `Group` facade with a `dictionary` of arguments.
     *
     * @param {Object} dictionary
     *   @param {string} userId
     *   @param {string} groupId
     *   @param {Object} properties
     *   @param {Object} options
     * @param {Object} opts
     *   @property {boolean|undefined} clone
     */
    function Group(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    /**
     * Inherit from `Facade`
     */

    inherit(Group, Facade);

    /**
     * Get the facade's action.
     */
    Group.prototype.action = function() {
      return 'group';
    };

    Group.prototype.type = Group.prototype.action;

    /**
     * Setup some basic proxies.
     */
    Group.prototype.groupId = Facade.field('groupId');

    /**
     * Get created or createdAt.
     *
     * @return {Date}
     */
    Group.prototype.created = function() {
      var created = this.proxy('traits.createdAt')
        || this.proxy('traits.created')
        || this.proxy('properties.createdAt')
        || this.proxy('properties.created');

      if (created) return newDate(created);
    };

    /**
     * Get the group's email, falling back to the group ID if it's a valid email.
     *
     * @return {string}
     */
    Group.prototype.email = function() {
      var email = this.proxy('traits.email');
      if (email) return email;
      var groupId = this.groupId();
      if (isEmail(groupId)) return groupId;
    };

    /**
     * Get the group's traits.
     *
     * @param {Object} aliases
     * @return {Object}
     */
    Group.prototype.traits = function(aliases) {
      var ret = this.properties();
      var id = this.groupId();
      aliases = aliases || {};

      if (id) ret.id = id;

      for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy('traits.' + alias) : this[alias]();
        if (value == null) continue;
        ret[aliases[alias]] = value;
        delete ret[alias];
      }

      return ret;
    };

    /**
     * Special traits.
     */

    Group.prototype.name = Facade.proxy('traits.name');
    Group.prototype.industry = Facade.proxy('traits.industry');
    Group.prototype.employees = Facade.proxy('traits.employees');

    /**
     * Get traits or properties.
     *
     * TODO: remove me
     *
     * @return {Object}
     */
    Group.prototype.properties = function() {
      return this.field('traits') || this.field('properties') || {};
    };

    /**
     * Exports.
     */

    module.exports = Group;
    });

    var require$$4$5 = (group && typeof group === 'object' && 'default' in group ? group['default'] : group);

    var alias = createCommonjsModule(function (module) {
    'use strict';

    /**
     * Module dependencies.
     */

    var inherit = require$$1$8.inherit;
    var Facade = require$$0$24;

    /**
     * Initialize a new `Alias` facade with a `dictionary` of arguments.
     *
     * @param {Object} dictionary
     *   @property {string} from
     *   @property {string} to
     *   @property {Object} options
     * @param {Object} opts
     *   @property {boolean|undefined} clone
     */
    function Alias(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    /**
     * Inherit from `Facade`.
     */

    inherit(Alias, Facade);

    /**
     * Return type of facade.
     *
     * @return {string}
     */
    Alias.prototype.action = function() {
      return 'alias';
    };

    Alias.prototype.type = Alias.prototype.action;

    /**
     * Get `previousId`.
     *
     * @api public
     * @return {*}
     */
    Alias.prototype.previousId = function() {
      return this.field('previousId') || this.field('from');
    };

    Alias.prototype.from = Alias.prototype.previousId;

    /**
     * Get `userId`.
     *
     * @api public
     * @return {string}
     */
    Alias.prototype.userId = function() {
      return this.field('userId') || this.field('to');
    };

    Alias.prototype.to = Alias.prototype.userId;

    /**
     * Exports.
     */

    module.exports = Alias;
    });

    var require$$5$5 = (alias && typeof alias === 'object' && 'default' in alias ? alias['default'] : alias);

    var index$35 = createCommonjsModule(function (module) {
    'use strict';

    var Facade = require$$0$24;

    /**
     * Expose specific-method facades.
     */

    Facade.Alias = require$$5$5;
    Facade.Group = require$$4$5;
    Facade.Identify = require$$2$10;
    Facade.Track = require$$1$7;
    Facade.Page = require$$1$15;
    Facade.Screen = require$$0$19;

    /**
     * Exports.
     */

    module.exports = Facade;
    });

    var require$$14 = (index$35 && typeof index$35 === 'object' && 'default' in index$35 ? index$35['default'] : index$35);

    var analytics = createCommonjsModule(function (module) {
    // var _analytics = global.analytics;

    /*
     * Module dependencies.
     */

    // var Alias = require('segmentio-facade').Alias;
    var Emitter = require$$15;
    // var Group = require('segmentio-facade').Group;
    var Identify = require$$14.Identify;
    var Page = require$$14.Page;
    var Track = require$$14.Track;
    var after = require$$13;
    var bindAll = require$$5$2;
    var clone = require$$1$3;
    var cookie = require$$4$2;
    // var debug = require('debug');
    var defaults = require$$5;
    var each = require$$4;
    // var foldl = require('@ndhoule/foldl');
    // var group = require('./group');
    var is = require$$7;
    // var isMeta = require('@segment/is-meta');
    var keys = require$$6;
    // var memory = require('./memory');
    // var nextTick = require('next-tick');
    var normalize = require$$5$3;
    // var on = require('component-event').bind;
    var pageDefaults = require$$4$3;
    // var pick = require('@ndhoule/pick');
    // var prevent = require('@segment/prevent-default');
    // var querystring = require('component-querystring');
    var store = require$$0$15;
    var user = require$$2$6;
    var type = require$$2$2;

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
      bindAll(this);

      // var self = this;
      // this.on('initialize', function(settings, options) {
      //   if (options.initialPageview) self.page();
      //   self._parseQuery(window.location.search);
      // });
    }

    /**
     * Mix in event emitter.
     */

    Emitter(Analytics.prototype);

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
      each(function(opts, name) {
        var Integration = self.Integrations[name];
        if (!Integration) delete settings[name];
      }, settings);

      // add integrations
      each(function(opts, name) {
        var Integration = self.Integrations[name];
        var integration = new Integration(clone(opts));
        // self.log('initialize %o - %o', name, opts);
        self.add(integration);
      }, settings);

      var integrations = this._integrations;

      // load user now that options are set
      user.load();
    //   group.load();

      // make ready callback
      var integrationCount = keys(integrations).length;
      var ready = after(integrationCount, function() {
        self._readied = true;
        self.emit('ready');
      });

      // init if no integrations
      if (integrationCount <= 0) {
        ready();
      }

      // initialize integrations, passing ready
      each(function(integration) {
        if (options.initialPageview && integration.options.initialPageview === false) {
          integration.page = after(2, integration.page);
        }

        integration.analytics = self;
        integration.once('ready', ready);
        integration.initialize();
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
      if (is.fn(options)) fn = options, options = null;
      if (is.fn(traits)) fn = traits, options = null, traits = null;
      if (is.object(id)) options = traits, traits = id, id = user.id();
      /* eslint-enable no-unused-expressions, no-sequences */

      // clone traits before we manipulate so we don't do anything uncouth, and take
      // from `user` so that we carryover anonymous traits
      user.identify(id, traits);

      var msg = this.normalize({
        options: options,
        traits: user.traits(),
        userId: user.id()
      });

      this._invoke('identify', new Identify(msg));

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
      if (is.fn(options)) fn = options, options = null;
      if (is.fn(properties)) fn = properties, options = null, properties = null;
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
        if (plan.enabled === false) return this._callback(fn);
        defaults(msg.integrations, plan.integrations || {});
      }

      this._invoke('track', new Track(msg));

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
      if (is.fn(options)) fn = options, options = null;
      if (is.fn(properties)) fn = properties, options = null, properties = null;
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
        defaults(msg.integrations, plan.integrations || {});
      }

      this._invoke('exception', new Track(msg));

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
      if (is.fn(options)) fn = options, options = null;
      if (is.fn(properties)) fn = properties, options = properties = null;
      if (is.fn(name)) fn = name, options = properties = name = null;
      if (type(category) === 'object') options = name, properties = category, name = category = null;
      if (type(name) === 'object') options = properties, properties = name, name = null;
      if (type(category) === 'string' && type(name) !== 'string') name = category, category = null;
      /* eslint-enable no-unused-expressions, no-sequences */

      properties = clone(properties) || {};
      if (name) properties.name = name;
      if (category) properties.category = category;

      // Ensure properties has baseline spec properties.
      // TODO: Eventually move these entirely to `options.context.page`
      var defs = pageDefaults();
      defaults(properties, defs);

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

      this._invoke('page', new Page(msg));

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
      if (is.fn(fn)) {
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
      cookie.options(options.cookie);
      store.options(options.localStorage);
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
      if (is.fn(fn)) {
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
      this.emit('invoke', facade);

      each(function(integration, name) {
        if (!facade.enabled(name)) return;
        integration.invoke.call(integration, method, facade);
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
      msg = normalize(msg, keys(this._integrations));
      if (msg.anonymousId) user.anonymousId(msg.anonymousId);
      msg.anonymousId = user.anonymousId();

      // Ensure all outgoing requests include page data in their contexts.
      msg.context.page = defaults(msg.context.page || {}, pageDefaults());

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

    module.exports = Analytics;
    // module.exports.cookie = cookie;
    // module.exports.memory = memory;
    // module.exports.store = store;
    module.exports.uuid = require$$0$10.v4;
    });

    var require$$1$4 = (analytics && typeof analytics === 'object' && 'default' in analytics ? analytics['default'] : analytics);

    var index = createCommonjsModule(function (module) {
    /**
     * Analytics.js
     *
     * (C) 2013-2016 Segment.io Inc.
     */

    var Analytics = require$$1$4;
    var createIntegration = require$$0;

    // Create a new `analytics` singleton.
    var analytics = new Analytics();

    analytics.VERSION = '3.0.0';

    analytics.createIntegration = createIntegration;

    /*
     * Exports.
     */

    module.exports = analytics;
    });

    var index$1 = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

    return index$1;

}());
