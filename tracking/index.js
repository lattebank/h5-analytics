/**
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference#tracking-snippet-unminified
 *
 * Creates a temporary global h5a object and loads analytics.js.
 * Parameters `lib`, `script`, and `tag` are all used internally. They could have been
 * declared using 'var', instead they are declared as parameters to save
 * 4 bytes ('var ').
 *
 * @param {Window}        win     The global context object.
 * @param {HTMLDocument}  doc     The DOM document object.
 * @param {string}        s       Must be 'script'.
 * @param {string}        src     Protocol relative URL of the analytics.js script.
 * @param {string}        lib     Global name of analytics object. Defaults to 'h5a'.
 * @param {HTMLElement}   script  Async script tag.
 * @param {HTMLElement}   tag     First script tag in document.
 */
(function(win, doc, s, src, lib, script, tag){
  win['H5AnalyticsObject'] = lib; // Acts as a pointer to support renaming.

  // Creates an initial h5a() function.
  // The queued commands will be executed once analytics.js loads.
  win[lib] = win[lib] || function () {
    win[lib].q.push([].slice.call(arguments));
  };

  // Always
  win[lib].q = win[lib].q || [];

  // Sets the time (as an integer) this tag was executed.
  // Used for timing hits.
  win[lib].l = 1 * new Date();

  // Insert the script tag asynchronously.
  // Inserts above current tag to prevent blocking in addition to using the
  // async attribute.
  script = doc.createElement(s),
  tag = doc.getElementsByTagName(s)[0];
  script.async = 1;
  script.src = src;
  tag.parentNode.insertBefore(script, tag)
})(window, document, 'script', '/path/to/analytics.js', 'h5a');
