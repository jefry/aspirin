var newButton, openButton, saveButton, runButton;
var editor;
var menu;
var fileEntry;
var hasWriteAccess;

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


var runed = {};

function once(name, func) {
  if (!runed[name]) {
    func();
  }
  runed[name] = true;
}


localStorage.Knows = localStorage.Knows || "[]";

var justData = currentKnows();

function currentKnows(data) {
  var dk = JSON.parse(localStorage.Knows);
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
//require('electron').ipcRenderer.on('justTest', justTest);


function justSource(e, str) {
  editor.setValue(str);
  return str
}

var bozid = false;

function justSendSource(vt) {
  document.getElementById('source').innerText;

}


function justInfo() {
  windowManager.getCurrent()
}

function justAutoRestore() {

}

function justRestore(el) {
  var dk = JSON.parse(localStorage.Knows);
  //.filter(filt)
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

  function filt(v) {
    return v || false;
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
  var uw = remote.BrowserWindow.fromId(cw.id + 1)
  if (uw)
    uw.webContents.send('justMoveUpwin', cb);
}

function justMoveDowin(e, ub) { // from upper window
  var cb = cw.getBounds();
  cw.setPosition(ub.x, ub.y + ub.height);

  cb = cw.getBounds();
  var dw = remote.BrowserWindow.fromId(cw.id - 1)
  if (dw)
    dw.webContents.send('justMoveDowin', cb);

}

function justScrollAll(xy) {

  document.body.onmousewheel = function (me) {
    var cb = cw.getBounds();
    cb.y += me.wheelDeltaY / 3 | 0;

    cw.setPosition(cb.x, cb.y)

    var uw = remote.BrowserWindow.fromId(cw.id + 1)
    if (uw)
      uw.webContents.send('justMoveUpwin', cb);

    var dw = remote.BrowserWindow.fromId(cw.id - 1)
    if (dw)
      dw.webContents.send('justMoveDowin', cb);


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

//
// cw.webContents.on('new-window',function (event, url, frameName){
//     //event.preventDefault();
//     //
//
//     var wb = cw.getBounds()
//
//     // cw.setSize(100,100);
//     // cw.setPosition(wb.x-105, wb.y+25)
//     options.x = wb.x
//     options.y = wb.y
//     //
//     var nw = newTransparentWindow(url, options);
//     // nw.on('move',function(){
//     //
//     //   var nwb = nw.getBounds()
//     //   cw.setPosition(nwb.x-105, nwb.y+25)
//     // })
//     // nw.on('closed',function(){
//     //
//     //   cw.setBounds(wb)
//     // })
//     // cw.on('closed',function(){
//     //   nw.off('closed')
//     // })
//
//
//   })


function handleDocumentChange(title) {
  var mode = "javascript";
  var modeName = "JavaScript";
  if (title) {
    title = title.match(/[^/]+$/)[0];
    document.getElementById("title").innerHTML = title;
    document.title = title;
    if (title.match(/.json$/)) {
      mode = {name: "javascript", json: true};
      modeName = "JavaScript (JSON)";
    } else if (title.match(/.html$/)) {
      mode = "htmlmixed";
      modeName = "HTML";
    } else if (title.match(/.css$/)) {
      mode = "css";
      modeName = "CSS";
    }
  } else {
    document.getElementById("title").innerHTML = "[no document loaded]";
  }
  editor.setOption("mode", mode);
  document.getElementById("mode").innerHTML = modeName;
}

function newFile() {
  fileEntry = null;
  hasWriteAccess = false;
  handleDocumentChange(null);
}

function setFile(theFileEntry, isWritable) {
  fileEntry = theFileEntry;
  hasWriteAccess = isWritable;
}

function readFileIntoEditor(theFileEntry) {
  fs.readFile(theFileEntry.toString(), function (err, data) {
    if (err) {
      console.log("Read failed: " + err);
    }

    handleDocumentChange(theFileEntry);
    editor.setValue(String(data));
    onresize();
  });
}

function writeEditorToFile(theFileEntry) {
  var str = editor.getValue();
  fs.writeFile(theFileEntry, editor.getValue(), function (err) {
    if (err) {
      console.log("Write failed: " + err);
      return;
    }

    handleDocumentChange(theFileEntry);
    console.log("Write completed.");
  });
}

var onChosenFileToOpen = function (theFileEntry) {
  console.log(theFileEntry);
  setFile(theFileEntry, true);
  readFileIntoEditor(theFileEntry);
};

var onChosenFileToSave = function (theFileEntry) {
  setFile(theFileEntry, true);
  writeEditorToFile(theFileEntry);
};

function handleNewButton() {
  if (false) {
    newFile();
    editor.setValue("");
  } else {
    windowManager.open(null, 'Editor', 'file://' + __dirname + '/index.html');
  }
}

function handleOpenButton() {
  dialog.showOpenDialog({properties: ['openFile']}, function (filename) {
    onChosenFileToOpen(filename.toString());
  });
}

function handleSaveButton() {
  if (fileEntry && hasWriteAccess) {
    writeEditorToFile(fileEntry);
  } else {
    dialog.showSaveDialog(null, null, function (filename) {
      // console.log(filename);
      onChosenFileToSave(filename.toString(), true);

    });
    // console.log(sf);
  }
}

function justShowResult(result, isHTML) {
  var resEl = document.getElementById('result');
  isHTML
    ? resEl.innerHTML = result
    : resEl.innerText = result;
}


function handleRunButton() {
  var code = editor.getValue();

  try {
    var result = eval(code);
    //document.querySelector('header').style.background = 'rgba(41, 120, 177, 0.5)';
    document.querySelector('header').style.background = 'rgba(84, 193, 23, 0.7)';
    if (result && typeof result == "object") {
      justShowResult(JSON.stringify(result, null, 2));
    } else {
      justShowResult(result);
    }

  } catch (e) {
    document.querySelector('header').style.background = 'rgba(225, 60, 47, 1)';

    justShowResult(`<span class="evalerror"> ${e.name}: ${e.message}</span>`, true);
  }


  syncSizeLines();


}

function initContextMenu() {
  menu = new Menu();
  menu.append(new MenuItem({
    label: 'Copy',
    click: function () {
      clipboard.writeText(editor.getSelection(), 'copy');
    }
  }));
  menu.append(new MenuItem({
    label: 'Cut',
    click: function () {
      clipboard.writeText(editor.getSelection(), 'copy');
      editor.replaceSelection('');
    }
  }));
  menu.append(new MenuItem({
    label: 'Paste',
    click: function () {
      editor.replaceSelection(clipboard.readText('copy'));
    }
  }));

  window.addEventListener('contextmenu', function (ev) {
    ev.preventDefault();
    menu.popup(remote.getCurrentWindow(), ev.x, ev.y);
  }, false);
}


onload = function () {

  document.getElementById("wid").innerHTML = '&nbsp;' + remote.getCurrentWindow().id;

  var test = 0;
  document.body.onmousewheel = function (me) {
    var p = cw.getPosition();
    var sp = me.wheelDeltaY / 3 | 0;
    // console.log(sp, test+=sp)
    cw.setPosition(p[0], p[1] + sp)
  }


  initContextMenu();

  newButton = document.getElementById("new");
  openButton = document.getElementById("open");
  saveButton = document.getElementById("save");
  runButton = document.getElementById("run");
  wsxButton = document.getElementById("wsx");

  newButton.addEventListener("click", handleNewButton);
  openButton.addEventListener("click", handleOpenButton);
  saveButton.addEventListener("click", handleSaveButton);
  runButton.addEventListener("click", handleRunButton);
  // wsxButton.addEventListener("click", handleRunButton);

  editor = CodeMirror(
    document.getElementById("editor"),
    {
      mode: {name: "javascript", json: true},
      lineNumbers: true,
      tabSize: 2,
      theme: "lesser-dark",
      value: "\r\n\r\n\r\n",
      // viewportMargin: 5,
      // scrollbarStyle:'none',
      extraKeys: {
        "Cmd-B": function (instance) {
          handleRunButton()
        },
        "Cmd-S": function (instance) {
          handleSaveButton()
        },
        "Ctrl-S": function (instance) {
          handleSaveButton()
        },
      }
    });


  // onChosenFileToOpen(remote.app.getAppPath()+'/experiments/testRun3.js');
  newFile();
  editor.on("change", function () {
    // console.log(arguments)
    syncSizeLines();
  })
  syncSizeLines();
};

onresize = function () {
};

onResultsScroll = function (e) {
  e.stopImmediatePropagation();

}

syncSizeLines = function () {
  var container = document.getElementById('editor');
  var results = document.getElementById('result');
  var containerWidth = 680;// container.offsetWidth;
  var containerHeight = container.offsetHeight;
  var resultsHeight = results.offsetHeight;

  if (resultsHeight >= 2000) {
    resultsHeight = 2000;
    results.onmousewheel = onResultsScroll;

  } else {
    results.onmousewheel = false;


  }
  // console.log(containerHeight, editor.lineCount())

  var height = 16 * editor.lineCount();


  remote.getCurrentWindow().setSize(containerWidth, height + 32 + resultsHeight);
  editor.setSize(containerWidth, height + 10);

  // var scrollerElement = editor.getScrollerElement();
  // scrollerElement.style.width = containerWidth + 'px';
  // scrollerElement.style.height = containerHeight + 'px';

  editor.refresh();
}
