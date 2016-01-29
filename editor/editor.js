var editor;
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
    document.getElementById("title").innerHTML = "[x]";
  }
  editor.setOption("mode", mode);
  //document.getElementById("mode").innerHTML = modeName;
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

var isresultHTML = false;
function handleRunButton() {
  var code = editor.getValue();
  isCallShowResult = false;
  try {
    var result = eval(code);
    //document.querySelector('header').style.background = 'rgba(41, 120, 177, 0.5)';
    document.querySelector('header').style.background = 'rgba(84, 193, 23, 0.7)';
    if (!isCallShowResult) {
      if (result && typeof result == "object") {
        justShowResult(JSON.stringify(result, null, 2));
      } else {
        justShowResult(result, isresultHTML);
      }
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


  if (just.options.isBarActive) {
    justToggleBar('#just');
  }

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

var display;

var sign = function (x) {
  return 1 / x === 1 / Math.abs(x);
}

var _scrl = function (e) {
  //var el = e.currentTarget;
  //
  //if (((el.scrollHeight - el.scrollTop - el.offsetHeight) == 0)
  //  || (el.scrollTop == 0)) {
  //  return false;
  //}

  e.stopImmediatePropagation();

}
var ss_scrl = function (e) {

  if (!e.currentTarget) {
    //
    return false;
  }

  var el = e.currentTarget;
  //console.log(e.deltaY,e.wheelDeltaY)
  //if (e.wheelDeltaY == 0) {
  //  e.stopImmediatePropagation();
  //  return false;
  //} else
  if (sign(e.deltaY)
    && ((el.offsetTop + window.screenTop) < 60)
    && (el.scrollHeight - el.scrollTop - el.offsetHeight) == 0) { //up

    e.stopImmediatePropagation();
    return true;
  } else if (!sign(e.deltaY)
    && (screen.height - (el.offsetHeight + el.offsetTop + window.screenTop)) < 60
    && (el.scrollTop > 0)) { //down

    e.stopImmediatePropagation();
    return true;
  }
  return false;

}

//_scrl = _.throttle(_scrl, 100);


syncSizeLines = function () {
  //--------------?
  display = remote.screen.getPrimaryDisplay().bounds;
  //--------------?
  var container = document.getElementById('editor');
  var results = document.getElementById('result');
  var composite = document.getElementById('composite');
  var totalWidth = 680;// container.offsetWidth;
  var upHeight = results.offsetTop - container.offsetHeight;
  var resultsHeight = results.offsetHeight;

  if (resultsHeight >= 2000) {
    resultsHeight = 2000;
    results.onmousewheel = _scrl;

  } else {
    results.onmousewheel = false;
  }


  if (composite.offsetHeight >= 2000) {
    composite.style.maxHeight = '2000px';
    //resultsHeight = 200;
    composite.onmousewheel = _scrl;
  } else {
    composite.onmousewheel = false;
  }


  var editorHeight = 10 + 16 * editor.lineCount();

  var totalHeight = editorHeight + upHeight + resultsHeight;

  editor.setSize(totalWidth, editorHeight);

  remote.getCurrentWindow().setSize(totalWidth, totalHeight);

  // var scrollerElement = editor.getScrollerElement();
  // scrollerElement.style.width = containerWidth + 'px';
  // scrollerElement.style.height = containerHeight + 'px';

  editor.refresh();
}
