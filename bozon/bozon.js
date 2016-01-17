var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var dialog = remote.require('dialog');
var fs = require("fs");
var clipboard = require('clipboard');
var cw = remote.getCurrentWindow();
var path = remote.app.getAppPath() + '/experiments/utils';
var utils = remote.require(path);
var windowManager = remote.require('electron-window-manager');
var CodeMirror = require('codemirror');


localStorage.Knows = localStorage.Knows || "[]";

var justData = currentKnows();

function currentKnows(data) {
  var dk = JSON.parse(localStorage.Knows)
  if (data) {
    dk[cw.id] = data;
    localStorage.Knows = JSON.stringify(dk)
  }

  return dk[cw.id] || {};
}
require('electron').ipcRenderer.on('justUpdate', justUpdate);
require('electron').ipcRenderer.on('justScrollAll', justScrollAll);
require('electron').ipcRenderer.on('justMoveUpwin', justMoveUpwin);
require('electron').ipcRenderer.on('justMoveDowin', justMoveDowin);
require('electron').ipcRenderer.on('justSource', justSource);
require('electron').ipcRenderer.on('justTest', justTest);


function justSource(e, str) {
  document.getElementById('source').innerHTML = str;
  return str
}

var bozid = false;
function justTest(vt) {


}


function justRestore(el) {
  var dk = JSON.parse(localStorage.Knows);
  cw.webContents.send('justScrollAll');
  function startKnows(know, id) {
    if (id < 2) return;

    windowManager.open(null, 'Editor', 'file://' + __dirname + '/index.html');
    var win = remote.BrowserWindow.fromId(id);

    if (win) {

      win.webContents.on("did-finish-load", function () {
        win.webContents.send('justUpdate');
        win.webContents.send('justScrollAll');
      })
    }
  }

  dk.forEach(startKnows)


}

function justUpdate(el) {

  var ed = editor.getValue();

  if (ed.trim()) {
    justData.sourceText = ed;
  }

  editor.setValue(currentKnows(justData).sourceText);
}

function justMoveUpwin(e, db) { // from down window
  var cb = cw.getBounds();
  cw.setPosition(db.x, db.y - cb.height);

  cb = cw.getBounds();
  if (bozid > 0) {
    var uw = windowManager.get('bozon_' + (bozid - 1))
    if (uw)
      uw.content().send('justMoveUpwin', cb);
  }
}

function justMoveDowin(e, ub) { // from upper window
  var cb = cw.getBounds();
  cw.setPosition(ub.x, ub.y + ub.height);

  cb = cw.getBounds();
  var dw = windowManager.get('bozon_' + (bozid + 1))
  if (dw)
    dw.content().send('justMoveDowin', cb);

}

function justScrollAll(xy) {

  document.body.onmousewheel = function (me) {
    var cb = cw.getBounds();
    cb.y += me.wheelDeltaY / 3 | 0;

    cw.setPosition(cb.x, cb.y)
    if (bozid > 0) {

      var uw = windowManager.get('bozon_' + (bozid - 1))

      if (uw)
        uw.content().send('justMoveUpwin', cb);
    }

    var dw = windowManager.get('bozon_' + (bozid + 1))
    if (dw)
      dw.content().send('justMoveDowin', cb);


  }
}


var justResultWindow = false;
function runFile(el) {
  el.classList.add('btn-warning');

  //handleSaveButton()
  if (fileEntry) {

    if (justResultWindow && !justResultWindow.closed) {
      remote.BrowserWindow.fromId(justResultWindow.guestId).reloadIgnoringCache();
    } else {
      justResultWindow = utils.newTransparentWindow('file://' + fileEntry);
    }
  } else {
    justResultWindow = utils.newTransparentWindow(utils.genDataHtmlUrl(editor.getValue()))
  }
}

onload = function () {
  document.body.onmousewheel = function (me) {
    var p = cw.getPosition();
    var sp = me.wheelDeltaY / 3 | 0;
    // console.log(sp, test+=sp)
    cw.setPosition(p[0], p[1] + sp);
    return false
  }

  syncSizeLines();
};

onresize = function () {
};

syncSizeLines = function () {
  var results = document.getElementById('source');
  var containerWidth = 680;// container.offsetWidth;
  var resultsHeight = results.offsetHeight;


  var height = 0;

  remote.getCurrentWindow().setSize(containerWidth, height + resultsHeight);

}


