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


var appRoot = remote.app.getAppPath();


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

}



function createBozon() {
  windowManager.createNew('bozon', 'Bozon', _wpaths.bozon).open();
}


function createEditor() {
  windowManager.createNew('editor', 'Bozon', _wpaths.editor).open();
}

function createWindow(url) {
  windowManager.createNew('wnd', 'Bozon', url).open();
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