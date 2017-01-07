var events = require('events');
var fs = require('fs');
var path = require('path');
// var jade = require('jade');
var util = require('util');
// var mime = require('mime');

const BrowserWindow = require('browser-window');


function newTransparentWindow (url, options) {
  options = options || {
    useContentSize : true,
     width: 450,
		 height: 150,
		x:-475,y:175,
		transparent:true,
		acceptFirstMouse:true,
		alwaysOnTop :false,
		webPreferences: {
        zoomFactor: 2.0,
        nodeIntegration: false
      },
		plugins :true,
		frame:false,
    
  };
  var cw = newWindow(url, options);
  cw.webContents.on('new-window',function (event, url,frameName){
    event.preventDefault();
    //
    var wb = cw.getBounds()
    // cw.setSize(100,100);
    // cw.setPosition(wb.x-105, wb.y+25)
    options.x = wb.x
    options.y = wb.y
    options.zoomFactor = 2
    //
    var nw = newTransparentWindow(url, options);
    // nw.on('move',function(){
    //
    //   var nwb = nw.getBounds()
    //   cw.setPosition(nwb.x-105, nwb.y+25)
    // })
    // nw.on('closed',function(){
    //
    //   cw.setBounds(wb)
    // })
    // cw.on('closed',function(){
    //   nw.off('closed')
    // })


  })

  cw.webContents.on("did-finish-load", function() {
    cw.webContents.executeJavaScript(`
      document.body.style.overflow = "hidden";
    `);
    //cw.show();
  })/**/
  return cw;
}
util.inherits(newTransparentWindow, events.EventEmitter);
exports.newTransparentWindow = newTransparentWindow;

function newWindow(url, options) {
  options = options || {width: 70, height: 70};

  // Create the browser window.
  var cw = new BrowserWindow(options);

  // and load the index.html of the app.
  cw.loadUrl(url);
  return cw;

}

util.inherits(newWindow, events.EventEmitter);
exports.newWindow = newWindow;

function genDataHtmlUrl(content){
  return "data:text/html;charset=utf-8," + encodeURI(content);
}

util.inherits(genDataHtmlUrl, events.EventEmitter);
exports.genDataHtmlUrl = genDataHtmlUrl;
