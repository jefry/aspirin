var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var dialog = remote.require('dialog');
var fs = require("fs");
var clipboard = require('clipboard');
var cw = remote.getCurrentWindow();
var appPath = remote.app.getAppPath();
var utils = remote.require(appPath + '/experiments/utils');
var windowManager = remote.require('electron-window-manager');


var appRoot = remote.app.getAppPath();

//UTILS

function van_dump(sval) {
  //arguments
  return JSON.stringify(sval, null, 2);
}


var runed = {};

function once(name, func) {
  if (!runed[name]) {
    func();
  }
  runed[name] = true;
}


var _wpaths = {
  bozon: 'file://' + appRoot + '/bozon/index.html',
  editor: 'file://' + appRoot + '/editor/index.html'

};


function createBozon() {
  windowManager.createNew('bozon', 'Bozon', _wpaths.bozon).open();
}


function createEditor() {
  windowManager.createNew('editor', 'Bozon', _wpaths.editor).open();
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