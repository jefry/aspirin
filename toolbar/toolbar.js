var Person, Toolbar;

Toolbar = {};
function giveWindow(name) {
  return getWin(name) || createMin(name);
}


function calcPosition(bounds) {

}

Toolbar.openWindow = function () {
  createMin();

};

Toolbar.createMatrix = function () {
  createMin();
};

Toolbar.createKnows = function () {
  var w = createMin()
  w.loadURL(genPath('/bozon/blueprint.html'));
  w.object.setBounds({
    "x": 1155,
    "y": 550,
    "width": 200,
    "height": 300
  }, true);
};

Toolbar.listKnows = function () {
  var dw, name;
  name = 'listKnows';
  dw = giveWindow(name);
  dw.object.setBounds({
    "x": 1455,
    "y": 55,
    "width": 150,
    "height": 275
  }, true);
};

Toolbar.showAppDir = function () {
  var dw, name;
  name = 'dir';
  dw = giveWindow(name);
  dw.object.setBounds({
    "x": 1300,
    "y": 55,
    "width": 150,
    "height": 275
  }, true);

};

Toolbar.addtool = 1111;

Person = (function () {
  function Person(name1) {
    this.name = name1;
  }

  Person.prototype.talk = function () {
    return console.log("My name is " + this.name);
  };

  return Person;

})();

module.exports = Toolbar;