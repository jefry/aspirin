const _isnode = !(process.type == 'renderer');
var storage;

var dbs = {};

function require_as_node_storage () { 
  const { remote } = require('electron');
  return remote.require(__dirname+'/storage');
}

if(_isnode) {
  storage = require(__dirname+'/storage');
} else {
  storage = require_as_node_storage();
}

class Dno {
  static open(name) {
    if(!name)
      throw new Error('Error: Storage: name is not defined!')
    if(!dbs[name])
      dbs[name] = new Dno(name);

    return dbs[name];
  }

  constructor(name, opts = {}){
    this.name = name;
    this.opts = opts;
    this.storage = storage.open(name);
    this.db = this.storage.db;
  }

  findOne (opt) {
    return (new Promise((resolve,reject)=>{
      this.db.findOne(opt)
      .exec((err, doc)=> err ? reject(err) : resolve(doc));
    }))
  }
  
  find (opt) {
    return (new Promise((resolve,reject)=>{
      this.db.find(opt)
      .exec((err, doc)=> err ? reject(err) : resolve(doc));
    }))
  }
  
  run (key, opt) {
    return this.findOne({key})
    .then(doc=>eval(doc.source))
  }
  
  save (key, val) {
    let k = {key};
    let doc = {key, source: val};

    function onUpdate(err, doc) {
      //justShowResult(van_dump(doc.source))
    }

    this.db.update(k, doc, {upsert: true}, onUpdate);
  };
  rawData (){
    return this.db.getAllData();
  }
}

module.exports = Dno;

