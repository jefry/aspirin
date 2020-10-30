var Person, Toolbar;

Toolbar = {};




function calcPosition(bounds) {

}

Toolbar.openWindow = function () {
  // createMin();
  createEditor();
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


Toolbar.addtool = 1111;

Knows.run('toolbar_scroll_handler');


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


