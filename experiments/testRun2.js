const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const clipboard = require('electron').clipboard;


var mainWindow;


var electronScreen = electron.screen;
var size = electronScreen.getPrimaryDisplay().workAreaSize;

var url = '/Users/rainerg/lab/_exp/electron/electron-sample-apps/file-explorer/test.js';

mainWindow = new BrowserWindow({ 
  width: size.width, 
  height: size.height,
  x:0, 
  y:0,
  transparent:true,
  webSecurity: false
});

var html = `
<script type="text/javascript" src="${url}"></script>
<h1>${url}</h1>` ;
html += '<pre>'+JSON.stringify(size)+'<pre/>';

//mainWindow.openDevTools();

//mainWindow.loadURL("data:text/html;charset=utf-8," + encodeURI(html)); 

mainWindow.loadUrl('file://' + __dirname + '/exec.html');
mainWindow.webContents.on("did-finish-load", function() {
	mainWindow.webContents.executeJavaScript(`setScript("${url}");`);
});



//grid width and height
var bw = 400;
var bh = 400;
//padding around grid
var p = 10;
//size of canvas
var cw = bw + (p*2) + 1;
var ch = bh + (p*2) + 1;

var canvas = $('<canvas/>').attr({width: cw, height: ch}).appendTo('body');

var context = canvas.get(0).getContext("2d");

function drawBoard(){
  for (var x = 0; x <= bw; x += 40) {
    context.moveTo(0.5 + x + p, p);
    context.lineTo(0.5 + x + p, bh + p);
  }


  for (var x = 0; x <= bh; x += 40) {
    context.moveTo(p, 0.5 + x + p);
    context.lineTo(bw + p, 0.5 + x + p);
  }

  context.strokeStyle = "black";
  context.stroke();
}

drawBoard();
