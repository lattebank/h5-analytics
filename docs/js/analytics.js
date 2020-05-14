/* analytics.js-core 3.4.1-1 */
// -> analytics-core.js
/* h5a-adapter 0.4.0  */
(function () {
  var win = window;
  var doc = document;
  // TODO: noConflict
  var analytics = win.analytics;

  function noop() { }

  function trim(a) {
    return a ? a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '') : '';
  }

  var isArray = Array.isArray || function (a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

  function isString(a) {
    return (typeof a === 'string') || a instanceof String;
  }

  var libName = trim(window.H5AnalyticsObject) || 'h5a';
  var lib = window[libName];

  var timingStart = lib.l || +new Date();

  // ** script base
  var scriptBase = '/';
  var scripts = [].slice.call(doc.scripts, 0);
  var REG_ANALYTICS = /(.+\/)analytics\.js$/;
  for (var si = 0; si < scripts.length; si += 1) {
    var simatches = scripts[si].src.match(REG_ANALYTICS);
    if (simatches) {
      scriptBase = simatches[1];
      break;
    }
  }

  /**
   * @param {Date} now
   * @return {Integer}
   */
  analytics.timing = function (now) {
    return (now || new Date()) - timingStart;
  }

  function sendError(message, tracker) {
    // FIXME:
    console.log(message, tracker);
  }

  var REG_COMMAND = /^(?:(\w+)\.)?(?:(\w+):)?(\w+)$/; // [trackerName.][pluginName:]methodName

  var integrations = [];

  // FIXME:
  var Utils = analytics.createIntegration('utils').tag('script', '<script src="{{ script }}">');
  var utils = new Utils();

  var REG_ALIAS = /[A-Z]/g;

  function Loader(name, options) {
    this.name = name;
    this.alias = name.match(REG_ALIAS).join('');
    this.REG_NAME = new RegExp('(' + this.name + ')|(' + this.alias + ')');

    var analyticsInterface = {};
    analyticsInterface[name] = options;

    var init = ['init', analyticsInterface];
    this.q = [init];

    this.script = options.script;
    if (!this.script) {
      this.script = scriptBase + 'analytics-integration-' + name.toLocaleLowerCase().replace(/\s/ig, '-') + '.js';
    }
  }

  Loader.prototype.enqueue = function enqueue(options) {
    this.q.push(options);
  }

  Loader.prototype.padding = function padding(args, min) {
    var len = args.length;
    var properties = {};
    var options = { $$intg: this.name };
    if (len < min) {
      console.warn('invalid args', args, min);
    } else if (len === min) {
      return args.concat([properties, options]);
    } else if (len === min + 1) {
      return args.concat([options]);
    } else if (len === min + 2) {
      var opts = args.pop();
      if (!this.REG_NAME.test(opts.$exclude)) {
        opts.$$intg = options.$$intg;
      }
      delete opts.$exclude;
      return args.concat([opts]);
    } else {
      console.warn('invalid args', args, min);
    }
  }

  Loader.prototype.send = function send(options) {
    if (this._ready) {
      // console.log(JSON.stringify(options));
      var hitType = options[0];
      var action = options.slice(1, options.length);
      if (hitType === 'init') {
        analytics.init(action[0]);
      } else if (hitType === 'page') {
        action = this.padding(action, 0);
        // console.log(this.name, JSON.stringify(options));
        // console.log(this.name, JSON.stringify(action));
        analytics.page.apply(null, action);
      } else if (hitType === 'track') {
        action = this.padding(action, 1);
        // console.log(this.name, JSON.stringify(options));
        // console.log(this.name, JSON.stringify(action));
        analytics.track.apply(null, action);
      } else if (hitType === 'exception') {
        console.warn('NotImplemented send exception');
      } else {
        var ig = hitType;
        if (ig === this.name) {
          this.send(action);
        }
      }
    } else {
      this.enqueue(options);
    }
  }

  Loader.prototype.ready = function ready() {
    this._ready = true;
    // console.log(this.q);
    if (this.q.length > 0) {
      var q = this.q.shift();
      while (q) {
        this.send([this.name].concat(q));
        q = this.q.shift();
      }
    }
  }

  function h5a() {
    var args = [].slice.call(arguments);
    var command = args[0];
    var options = args.slice(1);

    var c = REG_COMMAND.exec(command);
    var trackerName = c[1] || '';
    var pluginName = c[2] || '';
    var methodName = c[3];
    console.assert(methodName, 'methodName is required');

    switch (methodName) {
      case 'init':
        if (options.length === 1) {
          var only = options[0];
          var onlykey = Object.keys(only)[0];
          options = [onlykey, only[onlykey]];
        }
        if (options.length === 2) {
          var intg = options[0];
          var options = options[1];

          var loader = new Loader(intg, options);
          integrations.push(loader);
          utils.load('script', { script: loader.script }, function () {
            loader.ready();
          });
        } else {
          sendError('invalid init options');
        }
        break;
      case 'send':
        integrations.forEach(function (ig) {
          ig.send(JSON.parse(JSON.stringify(options)));
        });
        break;
      default:
        console.warn('invalid command');
        break;
    }
  }

  /**
   * @param {String} trackingId    The unique id of the tracked app
   * @param {String} cookieDomain  TODO
   * @param {String} trackerName   Each tracker can have its own gif, defaults, etc.
   */

  var queue = [];
  var q = lib && lib.q;
  if (isArray(q)) {
    for (var i = 0; i < q.length; i++) {
      h5a.apply(h5a, q[i]);
    }

    window[libName] = h5a;
  } else {
    console.warn('invalid lib.q');
  }
}(window));

/* h5a-profile example  */
(function () {
  var win = window;
  var doc = document;
  // TODO: noConflict
  var analytics = win.analytics;

  var uid = location.search.substring(5) // ?uid=albert
  if (uid) {
    analytics.identify(uid);
  }
}(window));

