
var events = require('events');
var fs = require('fs');
var path = require('path');
// var jade = require('jade');
var util = require('util');
// var mime = require('mime');

//const BrowserWindow = require('browser-window');


function newTransparentWindow (url, options) {
  options = options || {
    // useContentSize : true,
    width: 680,
    height: 240,
    x:950,y:820,
    transparent:true,
    acceptFirstMouse:true,
    enableLargerThanScreen:true,
    alwaysOnTop :false,
    webSecurity :false,
    zoomFactor:1,
    titleBarStyle:'hidden',
    //show :false,
    plugins :true,
    frame:true,
    "web-preferences": {
                "experimental-features": true,
                "experimental-canvas-features": true,
                "subpixel-font-scaling": true,
                "overlay-scrollbars": true
            }
  }
  var cw = newWindow(url, options);
  // cw.webContents.on("did-finish-load", function() {
  //   cw.webContents.executeJavaScript('document.body.style.background = "aliceblue";');
  // });
  
  cw.webContents.on('new-window',function (event, url,frameName){
    event.preventDefault();
    //
    var wb = cw.getBounds()
     cw.setSize(100,100);
     cw.setPosition(wb.x-105, wb.y+25)
    options.x = wb.x
    options.y = wb.y
    //
    var nw = newTransparentWindow(url, options);
     nw.on('move',function(){

       var nwb = nw.getBounds()
       cw.setPosition(nwb.x-105, nwb.y+25)
     })
     nw.on('closed',function(){

       cw.setBounds(wb)
     })
     cw.on('closed',function(){
       nw.off('closed')
     })


  })
/**
  cw.webContents.on("did-finish-load", function() {
    cw.webContents.executeJavaScript(`
      var me = document.createElement("div");
      document.body.insertBefore(me,document.body.firstChild);
      me.innerHTML = "<span class='move'>####</span><a class='cback'>&lt;</a>";
      me.style.zIndex = 10000000;
      // me.style.position = "fixed";
      //
      var e = me.querySelector('.move');
      e.style.background = "darkorange";
      e.style.position = "fixed";
      e.style.zIndex = 10000000;
      e.style.width = "40px";
      e.style.height = "18px";
      e.style.top = 0;
      e.style.left = 0;
      e.style.cursor = "move";
      // e.style.cursor = "move";
      e.style.webkitUserSelect = "none";
      e.style.webkitAppRegion = "drag";
      e.innerHTML = "####"
      // e.onmousedown = function(e){e.preventDefault();return false;}

      var a = me.querySelector('.cback')
      a.style.background = "aquamarine";
      a.style.position = "fixed";
      a.style.height = "18px";
      a.style.top = 0;
      a.style.left = "41px";
      a.style.cursor = "pointer";
      a.onclick = history.back
    `);
    //cw.show();
  })/**/
  return cw;
}
util.inherits(newTransparentWindow, events.EventEmitter);
exports.newTransparentWindow = newTransparentWindow;

function newWindow(url, options) {
  options = options || {width: 800, height: 600};

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





