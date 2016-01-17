var app = require('app');  // Module to control application life.
var windowManager = require('electron-window-manager');
var BrowserWindow = require('browser-window');  // Module to create native browser window.

var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // if (process.platform != 'darwin')
  app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
  // Create the browser window.

  windowManager.setDefaultSetup({
    position: 'right',
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

  windowManager.open('main', 'Main', 'file://' + __dirname + '/index.html');

});
