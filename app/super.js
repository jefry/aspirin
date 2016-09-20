const {remote,clipboard,BrowserWindow} = require('electron');
const {Menu, MenuItem,dialog} = remote;
const Util = require('util');
const path = require('path');
var fs = require("fs");
var cw = remote.getCurrentWindow();
var appPath = remote.app.aspirinRoot;
var utils = remote.require(appPath + '/experiments/utils');
var windowManager = remote.require('electron-window-manager');
var md5 = require('md5');
var _ = require('underscore');
var jetpack = require('fs-jetpack');
var coffee = require('coffee-script/register');
var appRoot = remote.app.getAppPath();
var Database = require(appRoot + '/system/database');
var Knows = require(appRoot + '/system/knows');
var Matrix = require(appRoot + '/matrix/matrix');
var jade = require('jade');

//UTILS

function van_dump(sval) {
  //arguments
  return JSON.stringify(sval, null, 2);
}

var textMode = false;

function setData(value) {
  textMode ? setText(value) : setContent(value);
}

function setText(value) {
  setContent(`<pre id="context"></pre>`);
  document.getElementById('context').innerText = value;
}

function setContent(value) {
  document.getElementById('content').innerHTML = value;
}
function getContent(value) {
  return document.getElementById('content').innerHTML;
}

//onload = function () {
//  setContent('ss'+cw.id);
//
//}
//




var runed = {};

function once(name, func) {
  if (!runed[name]) {
    func();
  }
  runed[name] = true;
}


var _wpaths = {
  bozon: 'file://' + appRoot + '/bozon/index.html',
  min: 'file://' + appRoot + '/bozon/min.html',
  editor: 'file://' + appRoot + '/editor/index.html'

};


function genPath(part) {
  return 'file://' + appRoot + part;
}

function getWin(name) {
  return windowManager.get(name);
}

function giveWin(name) {
  return getWin(name) || createMin(name);
}
function giveWindow(name) {
  return getWin(name) || createMin(name);
}

function createBozon() {
  windowManager.createNew('bozon', 'Bozon', _wpaths.bozon).open();
}

var n = 0;
function createBrowser(url, name) {
  name = name || 'bro_' + nm++;
  var w = !!(windowManager.windows.hasOwnProperty(name))
    ? windowManager.get(name)
    : windowManager.createNew(name, 'Bro', url, 'bro');
  w.open();
  return w;
}


var nm = 0;
function createMin(name) {
  name = name || 'min_' + nm++;
  var w = !!(windowManager.windows.hasOwnProperty(name))
    ? windowManager.get(name)
    : windowManager.createNew(name, 'Min', _wpaths.min, 'min');
  w.open();
  w.execute(`document.querySelector('.boz-header .param').innerText = '${name}'`);
  return w;
}


function createEditor(name, command, opt) {
  name = name || 'editor_' + remote.app._enm++;
  var w = !!(windowManager.windows.hasOwnProperty(name))
    ? windowManager.get(name)
    : windowManager.createNew(name, 'Editor', _wpaths.editor, 'editor');
  w.open();
  if (command)
    w.execute(`Knows.run('${command}', '${opt}')`);
  return w;
}

function createWindow(name, url) {

  var win = !!(windowManager.windows.hasOwnProperty(name))
    ? windowManager.get(name)
    : windowManager.createNew(name, 'Wnd', url);

  win.open();

  return win;
}

function createWindowNoNode(name, url) {

  var win = !!(windowManager.windows.hasOwnProperty(name))
    ? windowManager.get(name)
    : windowManager.createNew(name, 'Wnd', url, 'nonode');

  win.open();

  return win;
}


//var events = require('events');
//var fs = require('fs');
//var path = require('path');
//// var jade = require('jade');
//var util = require('util');
//// var mime = require('mime');
//
//util.inherits(newTransparentWindow, events.EventEmitter);
//exports.newTransparentWindow = newTransparentWindow;