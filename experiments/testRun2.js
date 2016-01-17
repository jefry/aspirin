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
