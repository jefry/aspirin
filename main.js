const app = require('app');  // Module to control application life.
const fs = require('fs');
const BrowserWindow = require('browser-window');
var windowManager = require('electron-window-manager');


app.on('window-all-closed', function () {
  // if (process.platform != 'darwin')
  app.quit();
});


app.on('before-quit', function () {
  app.quit();
});

app.on('ready', function () {
  windowManager.init({
    'appBase': __dirname,
    "onLoadFailure": function (window) {
      //window.content().loadURL('file://' + __dirname + '/loadFailure.html');
    },
    'devMode': false,
    'defaultSetup': {
      //position: 'center',
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
    }
  });

  we = windowManager.createNew('Editor', 'Editor', 'file://' + __dirname + '/editor/index.html');
  we.open();
  we.move('right');
  we.execute('justUpdate()');
  //
  //windowManager.createNew('bozon', 'Bozon', 'file://' + __dirname + '/bozon/index.html').open();
  //
  //we1 = windowManager.createNew('Editor2', 'Editor', 'file://' + __dirname + '/editor/index.html');
  //we1.open();
  //we1.move('right');
  //we1.execute('justUpdate()');

  ////wb = windowManager.get('bozon')
  //s = String(fs.readFileSync('bozon/bozon.js'))
  //cpath = 'file://' + app.getAppPath() + '/bozon/index.html';
  //
  //as = s.split('\n\n').forEach(load)
  //function load(v, i) {
  //  var w = windowManager.createNew('bozon_' + i, 'Bozon', cpath);
  //  w.open()
  //  w.set('frame', false);
  //  w.execute('bozid = ' + i + ';')
  //  w.onReady(true, function (w) {
  //
  //    w.content().send('justSource', v)
  //    w.execute('syncSizeLines()')
  //    w.content().send('justScrollAll')
  //  });
  //
  //
  //}

});
