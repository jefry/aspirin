var newButton, openButton, saveButton, runButton;

var menu;
var fileEntry;
var hasWriteAccess;

window.un$ = window.$

window.$ = require('jquery');
localStorage.Knows = localStorage.Knows || "[null, null]"


//todo: setup install script!
if (!JSON.parse(localStorage.Knows)[1] || !JSON.parse(localStorage.Knows)[1].sourceText) {

  dob = {
    "sourceText":"// click yellow |^| button for run code\nvar message = 'Hello world!!'\n\nfunction try_aspirine(msg){\n alert(msg)\n // cw - is a current window\n cw.setPosition(400,400)\n return cw.getBounds()\n}\n\ntry_aspirine(message)\n//see result below\n\n"
  }
  currentKnows(dob, 1)
}
var windowQueryParams = Object.fromEntries([...(new URL(document.location).searchParams)]);
var _forceJKid = windowQueryParams?.asLocalKnows || null;

//console.log(window.location.href, windowQueryParams, _forceJKid)

var _forceJKrender = () => setTimeout(()=>(document.querySelector('#update span').innerText = _forceJKid), 10);
if (_forceJKid)
  _forceJKrender();
var jGoKid = (id)=>window.location = document.location.origin+document.location.pathname+(id?'?asLocalKnows='+id:'');

if (windowQueryParams.asMatrixFn) {
  setTimeout(
    () => DNO.open('dno').run('openMatrixInEditor', { key: windowQueryParams.asMatrixFn }),
    50);
}

var justData = currentKnows();

function just_getKnowById(id) {
  const dk = JSON.parse(localStorage.Knows);
  id = id || _forceJKid || cw.id;
  return dk[id];
}

function currentKnows(data, id, clear=false) {
  id = id || _forceJKid || cw.id;

  var dk = JSON.parse(localStorage.Knows);
  if(clear){
    delete dk[id];
    localStorage.Knows = JSON.stringify(dk);

  }else if (data && data.sourceText ) {
    dk[id] = data;
    localStorage.Knows = JSON.stringify(dk);
  }

  let obj = dk[id];
  if (!obj || typeof obj !== "object")
    obj = {};
  return obj;
}


//-----------

just = {};
just.funcs = {};
just.name = false;

just.setName = function (name) {
  just.name = name;
  $('.justName').html(just.name);
};

//just.setName('#@%');
localStorage.justOptions = localStorage.justOptions || "[]";
just.syncOptions = function (data) {
  var dk = JSON.parse(localStorage.justOptions);
  if (data) {
    dk[cw.id] = data;
    localStorage.justOptions = JSON.stringify(dk);
  }
  return dk[cw.id] || {};
};

just.options = just.syncOptions();
just.options.isLocalSaveActive = false;

just.set = function (name, func) {
  just.compile(func, name);
  just.render()
};


just.makeBtn = function (name) {
  var tpl = `
<button class="btn btn-mini btn-default" onclick="just.run('${name}', this)">
  <!--<span class="icon icon-star-empty"></span>-->
  <span class="icon icon-star-empty icon-text">${name}</span>
</button>`;
  return tpl;
};

just.render = function () {
  var text = '<div class="btns-group">'
    + Object.keys(just.funcs).map(just.makeBtn).join('\n')
    + '</div>';
  $('#second_toolbar').html(text);
};

just.run = function (name, runOptions) {
  $('#second_toolbar .active').removeClass('active');
  $(arguments[1]).addClass('active');
  just.funcs[name](name, runOptions);
};

just.edit = function (name, btn) {
  just.setName(name);

  editor.setValue(just.toStr(name));
  just.run = just.run2;
  $('#second_toolbar .active').removeClass('active');
  $('#second_toolbar').removeClass('act-edit');
};

just.file = appPath + '/editor/justFunc.json';


just.compile = function (rawFunc, name) {
  return just.funcs[name] = new Function('name', 'runOptions', rawFunc);
};

just.toStr = function (name) {
  if (!name || !just.funcs[name]) return false;
  return just.raw(just.funcs[name]);
}
just.raw = function (func) {
  var fb = String(func);
  return fb.slice(39, -2);
};

just.load = function () {
  var _rawFuncs = jetpack.read(just.file, 'json');
  _(_rawFuncs).mapObject(just.compile)
};

just.save = function () {
  var raw = _(just.funcs).mapObject(just.raw);
  jetpack.write(just.file, raw)
};

just.load();


//-----------
var isBarActive = false;
function justToggleBar(elButton) {
  isBarActive = !isBarActive;
  just.options.isBarActive = isBarActive;
  just.syncOptions(just.options);

  $(elButton).toggleClass('active', isBarActive)
  $(elButton).toggleClass('btn-default', !isBarActive)
  $(elButton).toggleClass('btn-primary', isBarActive)

  $('#second_toolbar').toggleClass('hide', !isBarActive)
  if (isBarActive) {
    just.render()
  }

  syncSizeLines();
}

//-----------


meta = {};
meta.render = function () {
  DNO
    .open('zerolist')
    .run('zero')
};

//-----------
var isMetaActive = false;
function justToggleMeta(elButton) {
  isMetaActive = !isMetaActive;

  $(elButton).toggleClass('active', isMetaActive)
  //$('#main .pane-meta').toggleClass('hide', !isMetaActive)
  $('#meta_toolbar').toggleClass('hide', !isMetaActive)

  if (isMetaActive) {
    meta.render()
  }

  syncSizeLines();
}


function justOnceFocus() {


  remote.app.once('browser-window-focus', function (e, w) {
    justShowResult(w.id + '' + van_dump(w))

  })

}


require('electron').ipcRenderer.on('justUpdate', justUpdate);
require('electron').ipcRenderer.on('justScrollAll', justScrollAll);
require('electron').ipcRenderer.on('justMoveUpwin', justMoveUpwin);
require('electron').ipcRenderer.on('justMoveDowin', justMoveDowin);
require('electron').ipcRenderer.on('justSource', justSource);
require('electron').ipcRenderer.on('justSendVal', justSendVal);
require('electron').ipcRenderer.on('justReceiveVal', justReceiveVal);


function justSource(e, str) {
  editor.setValue(str);
  return str
}

var bozid = false;

function justSendVal(e, to) {
  var cwid = cw.id;
  var thisWindow = _(windowManager.windows)
    .find(function (v, k) {
      return v.object.id == cwid;
    })
    .name;

  var src = editor.getValue();
  getWin(to).content().send('justReceiveVal', thisWindow, src)

}

var customFunk = function (from, code) {
  isCallShowResult = false;
  try {
    var result = eval(code);
    //document.querySelector('header').style.background = 'rgba(41, 120, 177, 0.5)';
    document.querySelector('header').style.background = 'rgba(84, 193, 23, 0.7)';
    if (!isCallShowResult) {
      if (result && typeof result == "object") {
        justShowResult(JSON.stringify(result, null, 2), isresultHTML);
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

function justReceiveVal(e, from, val) {
  customFunk(from, val)
}

var isCallShowResult = false;

function justShowResult(result, isHTML) {
  isCallShowResult = true;
  var resEl = document.getElementById('result');
  if (isHTML)
    resEl.innerHTML = result;
  else
    resEl.textContent = result;

  syncSizeLines();
  return result;
}

function jLog(result){
  return justShowResult(van_dump(result))
}

function jColf(result,opt){
    let co = colf(result,opt).split('\n')
    co[0] = co[0].fixed()
    isresultHTML = true;
    return co.join('\n')
}

function justInfo() {
  var sinf = Object
    .keys(Screen.prototype)
    .reduce((m,v)=>{m[v]=screen[v];return m},{})

  sinf.orientation = Object
    .keys(ScreenOrientation.prototype)
    .reduce((m,v)=>{m[v]=screen.orientation[v];return m},{})  

  var re = [
    `id: ${cw.id}, name: ${windowManager.getCurrent().name}`,
    'bounds = '+van_dump(cw.getBounds()),
    'screen = '+van_dump(sinf)
  ].join('\n');

  justShowResult(re);
  syncSizeLines()
}

function justAutoRestore() {

}

var isAutoRuned = false;
var timeout = 100;
function justAutoRun() {
  if (!isAutoRuned) {
    isAutoRuned = setInterval(handleRunButton, timeout);
  } else {
    clearInterval(isAutoRuned);
    isAutoRuned = false;
  }

  document.getElementById('autorun').classList.toggle('active', isAutoRuned);
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

function just_storeCode(id) {
  id = id || _forceJKid || cw.id;
  var ed = editor.getValue();
  const jD = just_getKnowById(id) || {};
  if (ed.trim()) {
    jD.sourceText = ed;
    currentKnows(jD, id);
  }
}

function handleLocalSaveBtn(el, {isInConflict} = {}) {
  if (isInConflict) {
    el.classList.toggle('btn-default', false)
    el.classList.toggle('btn-primary', false)
    el.classList.toggle('btn-negative', true)
  } else {
    let lsa = just.options.isLocalSaveActive;
    el.classList.toggle('btn-default', !lsa)
    el.classList.toggle('btn-primary', lsa)
    el.classList.toggle('btn-negative', false)
  }
}

let inConflict = 0;

function setInConflict(isInConflict = 0) {
  inConflict = isInConflict;
  handleLocalSaveBtn(document.getElementById('update'), {isInConflict});


}

function justUpdate(el, isManual) {
  _forceJKrender();
  if (isManual) {
    if(inConflict){
      if(inConflict === 1){
        alert('Last alert! You have code collision! Make sure that it fixed and Press one more time to apply changes!');
        inConflict = 2;
      }else if(inConflict === 2) {
        setInConflict(0);
        just_storeCode();
        alert('Local Code updated')
      }
      return;
    }

    if (!just.options.isLocalSaveActive) {
      const knw = just_getKnowById() || {};
      let lc = knw && knw.sourceText || '';
      let cc = editor.getValue();

      jlc = lc;
      jcc = cc;

      just.options.isLocalSaveActive = !just.options.isLocalSaveActive;
      handleLocalSaveBtn(el);
      just.syncOptions(just.options);

      //no current
      if (lc.trim() && !cc.trim()) {
        editor.setValue(lc);
        return;
      }
      //no local
      if (!lc.trim() && cc.trim()) {
        just_storeCode()
        return;
      }

      if (cc === lc) return;

      if (lc.trim()) {
        alert('Merge conflict: codes will be concatenated, local first, editor second');
        console.log('MERGE CODES', cc, '----', lc)
        setInConflict(1);
        const text = '//LOCAL CODE\n/*\n' + lc + '\n/**/\n//CURRENT CODE\n\n' + cc;
        editor.setValue(text);
        return;
      }

      return;
    }

    just.options.isLocalSaveActive = !just.options.isLocalSaveActive;
    handleLocalSaveBtn(el);
    just.syncOptions(just.options);
  }

  if (!just.options.isLocalSaveActive)
    return;

  var ed = editor.getValue();

  if (ed.trim()) {
    justData.sourceText = ed;
  }
  const jd = currentKnows(justData);

  const text = jd.sourceText && jd.sourceText;
  console.log('aaaaa', _forceJKid)
  if (text)
    editor.setValue(text);
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
  var cb;

  function updPos() {
    var uw = remote.BrowserWindow.fromId(cw.id + 1)
    if (uw)
      uw.webContents.send('justMoveUpwin', cb);

    var dw = remote.BrowserWindow.fromId(cw.id - 1)
    if (dw)
      dw.webContents.send('justMoveDowin', cb);
  }

  var throttled = _.throttle(updPos, 50);

  document.body.onmousewheel = function (me) {
    cb = cw.getBounds();
    cb.y += me.wheelDeltaY / 3 | 0;

    cw.setPosition(cb.x, cb.y)
    throttled()
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
