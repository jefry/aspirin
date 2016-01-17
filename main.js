const app = require('app');  // Module to control application life.
const BrowserWindow = require('browser-window');
var windowManager = require('electron-window-manager');


//
//app.on('window-all-closed', function () {
//  // if (process.platform != 'darwin')
//  app.quit();
//});

app.on('ready', function () {
  windowManager.init({
    //'layouts': {
    //  'default': '/layouts/default.html',  // The "/" at the start will be replaced with the 'appBase' value
    //  'secondary': '/layouts/secondary.html'
    //},

    'devMode': false
  });

  windowManager.setDefaultSetup({
    position: 'center',
    width: 680,
    height: 240,
    //x:650,y:420,
    transparent: true,
    acceptFirstMouse: true,
    enableLargerThanScreen: true,
    alwaysOnTop: false,
    webSecurity: false,
    zoomFactor: 1,
    titleBarStyle: 'hidden',
    show: true,
    resizable: true,
    plugins: true,
    frame: true,
    "web-preferences": {
      "experimental-features": true,
      "experimental-canvas-features": true,
      "subpixel-font-scaling": true,
      "overlay-scrollbars": true
    }
  });

  windowManager.open('editor', 'Editor', 'file://' + __dirname + '/editor/index.html');
  windowManager.open('bozon', 'Bozon', 'file://' + __dirname + '/bozon/index.html');

});
