const _isnode = !(process.type == 'renderer');
const nedb = require('nedb');

var dbs = {};

class Storage {
  static test() {
    return _isnode;
  }
  static open(name, path) {
    if(!name)
      throw new Error('Error: Storage: name is not defined!')
    if(!dbs[name])
      dbs[name] = new Storage(name, {path});

    return dbs[name];
  }

  constructor(name, opts = {}){
    this.name = name;
    this.opts = opts;
    this.filename = __dirname + '/data/' + this.name + '.json';
    this.load();
  }

  load(){
    this.db = new nedb({
      filename: this.filename, 
      autoload: true,

      onload: function () {
        //console.log(db.getAllData())
      }
    });
    
  }

   getDb() {
    return this.db;
  }
}

module.exports = Storage;


