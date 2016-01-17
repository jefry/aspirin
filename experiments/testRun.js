const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const clipboard = require('electron').clipboard;


var mainWindow;


var electronScreen = electron.screen;
//window.size = electronScreen.getPrimaryDisplay().workAreaSize;
window.savedBounds = remote.getCurrentWindow().getBounds();

elseWindow = new BrowserWindow({ width: 500, height: 500 });

var str = electronScreen.getPrimaryDisplay();
str = JSON.stringify(str,'',2);
str += JSON.stringify(remote.getCurrentWebContents(),'',2);
var html = [
    "<body>",
      "<h1>It works</h1>",
      "<pre>"+str+"</pre>",  	
    "</body>",
  ].join("");


var html2 = `
<body>
<script type="text/javascript">
const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
tSize = BrowserWindow.fromId(1).getSize();
window.wcont = BrowserWindow.fromId(1).webContents;

//console.log(wcont)
BrowserWindow.fromId(1).setSize(300,300);
BrowserWindow.fromId(1).setPosition(30,20);

wcont.beginFrameSubscription(test);

function test(cont){
  
  window.Btest = cont;
  //wcont.endFrameSubscription();
	
  var canvas = document.getElementById("fbuf"); 

  var canvasWidth  = canvas.width = 300;
  var canvasHeight = canvas.height = 300;
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

  var buf = new ArrayBuffer(imageData.data.length);
  var buf8 = new Uint8ClampedArray(buf);
  var data = new Uint8Array(buf);
  
  console.log(canvasWidth, canvasHeight)
  
  //console.log(imageData.data.length)
  // Determine whether Uint32 is little- or big-endian.
  
      for (var i = 0; i < imageData.data.length; ++i) {
		debugger
        data[i] = cont[i]
      }
 

  imageData.data.set(buf8);
  console.log('aaa',imageData)

  ctx.putImageData(imageData, 0, 0);
  
}
</script>
<h1>JustDoIt</h1>
<canvas style="
		top:5%;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: aqua;
"id="fbuf" />
</body>
`;
elseWindow.loadUrl("data:text/html;charset=utf-8," + encodeURI(html2));

elseWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
  

	remote.getCurrentWebContents().endFrameSubscription();
  	remote.getCurrentWindow().setBounds(savedBounds);
  	mainWindow = null;
  });
//console.log(remote.getCurrentWebContents())

//remote.getCurrentWebContents().beginFrameSubscription(test);
