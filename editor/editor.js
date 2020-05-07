var CodeMirror = require('codemirror');

require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/comment/comment')
require('codemirror/addon/comment/continuecomment')
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/brace-fold');
require('codemirror/addon/fold/xml-fold');
require('codemirror/addon/fold/markdown-fold');
require('codemirror/addon/fold/comment-fold');

require('codemirror/addon/hint/javascript-hint');
require('codemirror/addon/hint/show-hint');


require('codemirror/mode/css/css')
require('codemirror/mode/xml/xml')
require('codemirror/mode/htmlmixed/htmlmixed')
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');


//START BLOCK: ADD DUBLICATELINE KEY COMMAND
CodeMirror.keyMap.macDefault["Cmd-D"] = function(cm){
    // get a position of a current cursor in a current cell
    var current_cursor = cm.doc.getCursor();
    // read a content from a line where is the current cursor
    var line_content = cm.doc.getLine(current_cursor.line);
    // go to the end the current line
    CodeMirror.commands.goLineEnd(cm);
    // make a break for a new line
    CodeMirror.commands.newlineAndIndent(cm);
    // filled a content of the new line content from line above it
    cm.doc.replaceSelection(line_content);
    // restore position cursor on the new line
    cm.doc.setCursor(current_cursor.line + 1, current_cursor.ch);
};
//END DUBLICATELINE

/*//START BLOCK: ADD BLOCKCOMMENT KEY COMMAND
CodeMirror.keyMap.macDefault["Cmd-/"] = function(cm){
    var sl = cm.doc.listSelections()[0];
    if (sl.anchor.line == sl.head.line)  
    cm.doc.blockComment(sl.anchor, sl.head);

    // get a position of a current cursor in a current cell
    var current_cursor = cm.doc.getCursor();
    // read a content from a line where is the current cursor
    var line_content = cm.doc.getLine(current_cursor.line);
    // go to the end the current line
    CodeMirror.commands.goLineEnd(cm);
    // make a break for a new line
    CodeMirror.commands.newlineAndIndent(cm);
    // filled a content of the new line content from line above it
    cm.doc.replaceSelection(line_content);
    // restore position cursor on the new line
    cm.doc.setCursor(current_cursor.line + 1, current_cursor.ch);
};*/
//END DUBLICATELINE
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
    createEditor();
  }
}

function handleOpenButton() {
  dialog.showOpenDialog({properties: ['openFile']}).then(function (filenames) {
    onChosenFileToOpen(filenames.filePaths[0]);
  });
}

function handleSaveButton() {
  if (fileEntry && hasWriteAccess) {
    writeEditorToFile(fileEntry);
  } else {
    dialog.showSaveDialog().then(function (result) {
      // console.log(filename);
      if(result.filePath)
        onChosenFileToSave(result.filePath, true);

    });
    // console.log(sf);
  }
}

runCodeOverride = false;
evalFN = eval;
function handleRunButton() {
  if (runCodeOverride)
    return runCodeOverride();
  runCode(editor.getValue());
  syncSizeLines();
}

var isresultHTML = false;
function runCode(code) {
  isCallShowResult = false;
  try {
    var result = evalFN(code);
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

    justShowResult(`<span class="evalerror"> ${e.name}: ${e.message} ${e.stack}</span>`, true);
  }


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

_currentEditorHeight = 0;

scrollPosLimit = function (tryPos) {
  return _.sortBy([(screen.availTop - _currentEditorHeight + 50), tryPos, 1000])[1];
}
onload = function () {

  document.getElementById("wid").innerHTML = '&nbsp;' + remote.getCurrentWindow().id;

  document.body.onmousewheel = function (me) {
    var p = cw.getPosition();
    var sp = me.wheelDeltaY / 3 | 0;
    cw.setPosition(p[0], scrollPosLimit(p[1] + sp));
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
      mode: {name: "javascript", json: true, globalVars: true},
      lineNumbers: true,
      indentWithTabs: false,
      tabSize: 2,
      theme: "lesser-dark",
      value: "\r\n\r\n\r\n",
      // viewportMargin: 5,
      // scrollbarStyle:'none',
      matchBrackets: true,
      continueComments: true,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      extraKeys: {
        "Tab": function (cm) {
          var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces, "end", "+input");
        },
        "Cmd-B": function (instance) {
          handleRunButton()
        },
        "Cmd-S": function (instance) {
          handleSaveButton()
        },
        "Ctrl-S": function (instance) {
          handleSaveButton()
        },
        "Ctrl-Space": "autocomplete"
      }
    });


  if (just.options.isBarActive) {
    justToggleBar('#just');
  }

  // onChosenFileToOpen(remote.app.getAppPath()+'/experiments/testRun3.js');
  newFile();
  editor.on("update", function () {
    // console.log(arguments)
    syncSizeLines();
  })
  syncSizeLines();

  Knows.run('editor');

};

onresize = function () {
};

var display;

var sign = function (x) {
  return 1 / x === 1 / Math.abs(x);
}

_scrl1 = function (e) {
  var el = e.currentTarget;

  if (((el.scrollHeight - el.scrollTop - el.offsetHeight) == 0)
    || (el.scrollTop == 0)) {
    console.log('asasa', el.scrollHeight - el.scrollTop - el.offsetHeight)
    e.stopImmediatePropagation();
    return true;

  }
  return false;


}
wheelBuffer = 0;

_scrl = function (e) {
  let TOP = 37+screen.availTop;

  var el = e.currentTarget;
  //console.log((e.wheelDeltaY < 0) && ((el.offsetTop + window.screenTop)<60))
  //console.log((el.scrollHeight - el.scrollTop - el.offsetHeight))
  //console.log([composite.scrollHeight, composite.scrollTop, composite.offsetHeight , composite.offsetTop ,screenTop, document.body.offsetHeight])
  //console.log(composite.offsetHeight + composite.offsetTop + screenTop - screen.height)
  

  if (e.wheelDeltaY == 0) {
    e.stopImmediatePropagation();
    return false;
  } else if ((e.wheelDeltaY < 0)
    && ((el.offsetTop + window.screenTop) < TOP)
    && (el.scrollHeight - el.scrollTop - el.offsetHeight) > 0) { //up

//         console.log('up')
    e.stopImmediatePropagation();
    return true;
  } else if ((e.wheelDeltaY >= 0)
    && (screen.height - (el.offsetHeight + el.offsetTop + 23+window.screenTop-screen.availTop)) < 60
    && (el.scrollTop > 0)) { //down

//         console.log('down')
    e.stopImmediatePropagation();
    return true;
  }
  return false;

}

//_scrl = _.throttle(_scrl, 100);


syncSizeLines = function () {
  //console.log('origin', document.body.offsetHeight);
  _syd()
}
totalWidth = 680;
greatScale = 1;

justScale = (s=1,ws=1)=>{
  greatScale = s;
  totalWidth *= ws;
  cw.webContents.setZoomFactor(greatScale);
}

_sy =function () {
  //--------------?
  display = remote.screen.getPrimaryDisplay().bounds;
  //--------------?
  var container = document.getElementById('editor');
  var results = document.getElementById('result');
  var composite = document.getElementById('composite');
  var composite_wrap = document.getElementById('composite_wrap');
  // container.offsetWidth;
  var resultsHeight = results.offsetHeight;

  if (resultsHeight >= 1000) {
    resultsHeight = 1000;
    results.onmousewheel = _scrl;

  } else {
    results.onmousewheel = false;
  }

  //console.log('si senior', composite.offsetHeight)

  if (composite.offsetHeight >= 2500) {
    composite_wrap.style.maxHeight = '900px';
    //resultsHeight = 200;
    composite_wrap.onmousewheel = _scrl;

  } else {
    composite_wrap.style.maxHeight = 'none';
    composite_wrap.onmousewheel = false;
  }

  var upHeight = results.offsetTop - container.offsetHeight + 22;
  //console.log(editor)
  // var editorHeight = 8 + 16 * editor.lineCount();
  var editorHeight = editor.getScrollInfo().height;

  var totalHeight = editorHeight + upHeight + resultsHeight;

  //editor.setSize(totalWidth, editorHeight);
  //editor.refresh();
  _currentEditorHeight = totalHeight;
  remote.getCurrentWindow().setSize(totalWidth*greatScale|0, totalHeight*greatScale|0);

  // var scrollerElement = editor.getScrollerElement();
  // scrollerElement.style.width = containerWidth + 'px';
  // scrollerElement.style.height = containerHeight + 'px';

}

var _syd = _.debounce(_sy, 100);
