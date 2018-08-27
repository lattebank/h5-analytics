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
  var REG_ANALYTICS = /(.+\/)h5a\.js$/;
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

  function Loader(name, options) {
    this.name = name;
    this.options = options;

    var init = ['init', options];
    this.q = [init];

    this.script = options.script;
    if (!this.script) {
      this.script = scriptBase + 'analytics-integration-' + name.toLocaleLowerCase().replace(/\s/ig, '-') + '.js';
    }
  }

  Loader.prototype.enqueue = function enqueue(options) {
    this.q.push(options);
  }

  Loader.prototype.send = function send(options) {
    if (this._ready) {
      var hitType = options[0];
      var action = options.slice(1, options.length);
      if (hitType === 'init') {
        analytics.init(action[0]);
      } else if (hitType === 'page') {
        analytics.page.apply(action);
      } else if (hitType === 'track') {
        analytics.track.apply(null, action);
      } else {
        console.warn('invalid command options', [].slice.call(arguments, 0));
      }
    } else {
      this.enqueue(options);
    }
  }

  Loader.prototype.ready = function ready() {
    this._ready = true;
    console.log(this.q);
    if (this.q.length > 0) {
      for (var i = 0; i < this.q.length; i += 1) {
        this.send(this.q[i]);
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
          options = options.shift();
          // analytics.init(options);
          Object.keys(options).map(function (igName) {
            var pick = {};
            pick[igName] = options[igName];
            var loader = new Loader(igName, pick);
            integrations.push(loader);

            utils.load('script', { script: loader.script }, function () {
              loader.ready();
            });
          });

          // FIXME:
          window.integrations = integrations;
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
