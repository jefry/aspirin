var Person, Toolbar;

Toolbar = {};

Toolbar.openWindow = function () {
  return createMin();
};

Toolbar.showAppDir = function () {
  var dw, name;
  name = 'dir';
  dw = getWin(name) || createMin(name);
  dw.object.setBounds({
    "x": 1505,
    "y": 60,
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