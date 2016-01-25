app = require('app')
# Module to control application life.
fs = require('fs')

BrowserWindow = require('browser-window')
windowManager = require('electron-window-manager')
#const {app, BrowserWindow} = require('electron')
#var testcc = require('cson-config').load();

require('cson-config').load('config.cson')

config = global['config'] = require('config.cson')


Datastore = require('nedb')
app.db = new Datastore filename: 'data/datafile.json', autoload: true


app.on 'window-all-closed', ->
# if (process.platform != 'darwin')
  app.quit()
  return

app.on 'before-quit', ->
  app.quit()
  return

app.on 'ready', ->
  PrimaryDisplay = require('screen').getPrimaryDisplay()


  windowManager.init
    'devMode': false
    'appBase': __dirname
    'onLoadFailure': (window) ->
    'layouts':
      'default': '/layouts/default.html'
      'p5': '/windows/p5test1.html'

  windowManager.setDefaultSetup config.defaultWindowSetup
  windowManager.templates.set 'bro', config.browserWindowSetup
  windowManager.templates.set 'min', config.minWindowSetup
  windowManager.templates.set 'nonode', config.noNodeWindowSetup
  windowManager.templates.set 'toolbar', config.toolbarWindowSetup


  we = windowManager.createNew('Editor', 'Editor', 'file://' + __dirname + '/editor/index.html')
  we.open()
  we.move 'bottomRight'
  we.execute 'justUpdate()'
  #
  wb = windowManager.createNew('bozon', 'Bozon', 'file://' + __dirname + '/bozon/index.html')
  wb.open();
  wb.move PrimaryDisplay.bounds.width - 470, PrimaryDisplay.bounds.height - 50
  #
  we1 = windowManager.createNew('toolbar', 'Toolbar', 'file://' + __dirname + '/toolbar/toolbar.html', 'toolbar');
  we1.open();
  we1.move(PrimaryDisplay.bounds.width - 70, 50);


  #  we1.execute('justUpdate()');
  #
  #  we2 = windowManager.createNew('Editor3', 'Editor', 'file://' + __dirname + '/editor/index.html');
  #  we2.open();
  #  we2.move('right');
  #  we2.execute('justUpdate()');
  #//wb = windowManager.get('bozon')
  #s = String(fs.readFileSync('bozon/bozon.js'))
  #cpath = 'file://' + app.getAppPath() + '/bozon/index.html';
  #
  #as = s.split('\n\n').forEach(load)
  #function load(v, i) {
  #  var w = windowManager.createNew('bozon_' + i, 'Bozon', cpath);
  #  w.open()
  #  w.set('frame', false);
  #  w.execute('bozid = ' + i + ';')
  #  w.onReady(true, function (w) {
  #
  #    w.content().send('justSource', v)
  #    w.execute('syncSizeLines()')
  #    w.content().send('justScrollAll')
  #  });
  #
  #
  #}
  return

# ---
# generated by js2coffee 2.1.0