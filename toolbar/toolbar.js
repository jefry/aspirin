var Person, Toolbar;

Toolbar = {};


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
  name = 'listknows';
  dw = giveWindow(name);
  dw.execute(`Knows.run('${name}')`)
  dw.object.setBounds({
    "x": 1460,
    "y": 30,
    "width": 150,
    "height": 275
  }, true);
};

Toolbar.showAppDir = function () {
  Knows.run('showAppDir')
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