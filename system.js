const electron = require('electron')
const {app, BrowserWindow} = electron;

app.Database = require(__dirname + '/system/database');
app.knows = require(__dirname + '/system/knows');
app.matrix = require(__dirname + '/matrix/matrix');
app.aspirinRoot = app.getAppPath();
app._enm = 0;


const windowManager = require('electron-window-manager');

//const {app, BrowserWindow} = require('electron')
//var testcc = require('cson-config').load();


const config = global['config'] = require(__dirname + '/config.json');

//app.commandLine.appendSwitch "js-flags", "--harmony_proxies --harmony_collections"
//app.commandLine.appendSwitch "--disable-renderer-backgrounding"
app.on('window-all-closed', function () {
    // if (process.platform != 'darwin')
    app.quit();
});

app.on('before-quit', function () {
});
group_toObj = fns=>arr=>
    fns.reduce((m,f)=>({...m, [f]:arr.map(f), }), {});
group_toArr = fns=>arr=>arr.map(v=>fns.reduce((m,f)=>({...m, [f]:f(v), }), {}));

//app.quit()
app.on('ready', function () {
    var PrimaryDisplay, we, we1;
    PrimaryDisplay = electron.screen.getPrimaryDisplay();
    global.getAllWin = function () {
        return Object.keys(require('electron-window-manager').windows);
    };
    windowManager.init({
        'devMode': false,
        'appBase': __dirname,
        'onLoadFailure': function (window) {
        },
        'layouts': {
            'default': '/layouts/default.html',
            'p5': '/windows/p5test1.html'
        }
    });
    windowManager.setDefaultSetup(config.defaultWindowSetup);
    windowManager.templates.set('editor', config.editorWindowSetup);
    windowManager.templates.set('bro', config.browserWindowSetup);
    windowManager.templates.set('min', config.minWindowSetup);
    windowManager.templates.set('nonode', config.noNodeWindowSetup);
    windowManager.templates.set('toolbar', config.toolbarWindowSetup);
    we = windowManager.createNew('editor', 'Editor', 'file://' + __dirname + '/editor/index.html', 'editor');
    we.open();
    //  we.toggleDevTools()
    //we.move 'bottomRight'
    //we.execute 'justUpdate()'

    // wb = windowManager.createNew('bozon', 'Bozon', 'file://' + __dirname + '/bozon/index.html')
    // wb.open();
    // wb.move PrimaryDisplay.bounds.width - 470, PrimaryDisplay.bounds.height - 50

    we1 = windowManager.createNew('toolbar', 'Toolbar', 'file://' + __dirname + '/toolbar/toolbar.html', 'toolbar');
    we1.open();
    we1.move(PrimaryDisplay.bounds.width - 63, 25);
});

