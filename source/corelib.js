
function newWindow(url, options) {
  options = options || {width: 100, height: 100};

  // Create the browser window.
  var cw = new BrowserWindow(options);

  // and load the index.html of the app.
  cw.loadUrl(url);
  return cw;

}
var CoreLib = {
  newWindow: newWindow
};

exports.CoreLib = CoreLib;
