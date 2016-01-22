var events = require('events');
var fs = require('fs');
var path = require('path');
// var jade = require('jade');
var util = require('util');
window.require = require;
var remote = window.remote = require('remote');

const BrowserWindow = remote.require('browser-window');


function someTest() {
  alert(15462)
}
function someInjectedFunk() {
  var cw = remote.getCurrentWindow();
  document.body.onmousewheel = function (me) {
    var p = cw.getPosition();
    var sp = me.wheelDeltaY / 3 | 0;
    // console.log(sp, test+=sp)
    cw.setPosition(p[0], p[1] + sp)
  }


}

util.inherits(someInjectedFunk, events.EventEmitter);
exports.someInjectedFunk = someInjectedFunk;

function syncSizeLines() {
  var container = document.body;
  var containerWidth = 1000; //container.offsetWidth;
  var containerHeight = container.offsetHeight;
  remote.getCurrentWindow().setSize(containerWidth, containerHeight);

}
util.inherits(syncSizeLines, events.EventEmitter);
exports.syncSizeLines = syncSizeLines;
