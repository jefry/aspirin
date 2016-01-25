//const {app, BrowserWindow} = require('electron');

function openWindow() {
  createMin()

}

function showAppDir() {
  name = 'dir';
  dw = createMin(name);
  dw.execute(`document.querySelector('.boz-header').innerText = '${name}'`);
  dw.resize(100, 275);
}