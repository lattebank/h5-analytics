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
