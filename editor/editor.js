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

runCodeOverride = false;

function handleRunButton() {
if (runCodeOverride)
return runCodeOverride();
  try{
    window.first_name = windowManager.getCurrent().name;
    windowManager.sharedData.set('ask_first_name',windowManager.getCurrent().name)
    window.ask_buffer = [];
  }catch(err){
  }
runCode(editor.getValue());
syncSizeLines();
}

var isresultHTML = false;
////////////////////////////////////////////////////////////
function reverse(s){
      return s.split("").reverse().join("");
  }
////////////////////////////////////////////////////////////

function runCode(code) {
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
    try{
      window.last_name = window.last_name.reverse()
      window.last_name.map((v)=>{getWin(v).object.focus()})
      getWin(window.first_name).object.focus();
      let buffer = window.ask_buffer
      windowManager.sharedData.set('ask_buffer_window',buffer)
     }catch(err){
     }
  }
}

} catch (e) {
document.querySelector('header').style.background = 'rgba(225, 60, 47, 1)';
justShowResult(`<span class="evalerror"> ${e.name}: ${e.stack}</span>`, true);
//////////////////////////////////////////////////////////////////////////////////////
auto_fix_undefined_code = function(name,value){

function open_wind(name,i){
  let win = createEditor('editor_aska_'+name, 'open_aska_4d',name);
  var id_win = win.object.id
 // var tert = '';
  //if(i == 1){
  //  tert = `document.body.style.opacity = 0.9`;
  //}
  //  var gyw = BrowserWindow.fromId(id_win)
  //  gyw.webContents.executeJavaScript(tert);
  let ii = i*44;

  getWin('editor_aska_'+name).object.setPosition(...cw.getPosition().map((v)=>v-ii))
  if(window.last_name == undefined){
     window.last_name = [];
    }
  window.last_name.push('editor_aska_'+name)


}

  function get_from_4d(name){
    let base_4d = jetpack.read('G:/Games/aska.json','json')

    var code_x = 0;
    base_4d.map((v, index)=>{return v.map((v)=>{if(v == name){code_x = index}return v})})
    if(code_x != 0){

      var code_name = base_4d[code_x][0]
      code_x = base_4d[code_x][1]

      if(window.ask_buffer == undefined){window.ask_buffer = [];}
      var ask_buffer = window.ask_buffer
      if(ask_buffer == ''){
        let code_do = editor.getValue();

        ask_buffer.splice(ask_buffer.length,0,code_x+'\n'+code_do)
        window.counts = 1
        open_wind(code_name,window.counts);
        window.ask_buffer = ask_buffer
      }else{
        let code_do = ask_buffer[ask_buffer.length-1]
        window.counts += 1
        open_wind(code_name,window.counts);
        ask_buffer.splice(ask_buffer.length,0,code_x+'\n'+code_do)
        window.ask_buffer = ask_buffer
      }


      ask_buffer = window.ask_buffer
      //window.ask_buffer_window = ask_buffer
      let code_posle = ask_buffer[ask_buffer.length-1]

      runCode(code_posle)
  }
}
  if(name == 'ReferenceError'){
    value = value.substring(name.length+2,value.length)
    let knows_name = value.substring(0,value.search(' is'))
    get_from_4d(knows_name);

  }else if(name == 'TypeError'){
    let text_x = 'TypeError: Cannot set property -'
    value = value.substring(text_x.length,value.length)
    value = value.substring(0,value.search("of")-2)
    let ask_buffer = jetpack.read('G:/Games/ask_buffer.json','json')
    if(ask_buffer ==''){
      var arr_search1 = editor.getValue();
    }else{
      var arr_search1 = ask_buffer[0]
    }

    arr_search1 = arr_search1.substring(0,arr_search1.search(value)-1)
    arr_search1 = reverse(arr_search1);
    arr_search1 = arr_search1.substring(0,arr_search1.search(' '))
    arr_search1 = reverse(arr_search1);
    get_from_4d(arr_search1);
  }

};
auto_fix_undefined_code(e.name,e.stack);
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
return _.sortBy([(-_currentEditorHeight + 50), tryPos, 1000])[1];
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
  mode: {name: "javascript", json: true},
  lineNumbers: true,
  indentWithTabs: false,
  tabSize: 1,
  theme: "lesser-dark",
  value: "\r\n\r\n\r\n",
  // viewportMargin: 5,
  // scrollbarStyle:'none',
  extraKeys: {
    "Tab": function (cm) {
      var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
      cm.replaceSelection(spaces, "end", "+input");
    },
    "Ctrl-Enter": function (instance) {
      handleRunButton()
    },
    "Ctrl-S": function (instance) {
      handleSaveButton()
    },
    "Ctrl-D": function (instance) {
      just.run('New_4D_Save', this)
      //handleSaveButton()
    },
    "Ctrl-Q": function (instance) {
      just.run('Reload_win', this)
      //handleSaveButton()
    },
    "PageUp": function (instance) {
      just.run('next_target_4', this)
      //handleSaveButton()
    },
    "PageDown": function (instance) {
      just.run('next_target_6', this)
      //handleSaveButton()
    },
  }
});


if (just.options.isBarActive) {
justToggleBar('#just');
}

//onChosenFileToOpen(remote.app.getAppPath()+'/experiments/testRun3.js');
//newFile();
editor.on("change", function () {
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


var el = e.currentTarget;
//console.log((e.wheelDeltaY < 0) && ((el.offsetTop + window.screenTop)<60))
//console.log((el.scrollHeight - el.scrollTop - el.offsetHeight))
//console.log([composite.scrollHeight, composite.scrollTop, composite.offsetHeight , composite.offsetTop ,screenTop, document.body.offsetHeight])
//console.log(composite.offsetHeight + composite.offsetTop + screenTop - screen.height)


if (e.wheelDeltaY == 0) {
e.stopImmediatePropagation();
return false;
} else if ((e.wheelDeltaY < 0)
&& ((el.offsetTop + window.screenTop) < 60)
&& (el.scrollHeight - el.scrollTop - el.offsetHeight) > 0) { //up

//         console.log('up')
e.stopImmediatePropagation();
return true;
} else if ((e.wheelDeltaY >= 0)
&& (screen.height - (el.offsetHeight + el.offsetTop + window.screenTop)) < 60
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


_sy =function () {
//--------------?
display = remote.screen.getPrimaryDisplay().bounds;
//--------------?
var container = document.getElementById('editor');
var results = document.getElementById('result');
var composite = document.getElementById('composite');
var composite_wrap = document.getElementById('composite_wrap');
var totalWidth = container.offsetWidth;
var resultsHeight = results.offsetHeight;

if (resultsHeight >= 2000) {
resultsHeight = 2000;
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
var editorHeight = 8 + 16 * editor.lineCount();

var totalHeight = editorHeight + upHeight + resultsHeight;

editor.setSize(totalWidth, editorHeight);
//editor.refresh();
_currentEditorHeight = totalHeight;
remote.getCurrentWindow().setSize(totalWidth, totalHeight);

// var scrollerElement = editor.getScrollerElement();
// scrollerElement.style.width = containerWidth + 'px';
// scrollerElement.style.height = containerHeight + 'px';

}

var _syd = _.debounce(_sy, 100);
