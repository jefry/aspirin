var _isnode = typeof window == 'undefined';

if (!_isnode) {
  var db = remote.app.knows.getDb();
} else {
  var Datastore = require('nedb');
  var db;
  if (!db) {

    db = new Datastore({
      filename: __dirname + '/data/datafile.json', autoload: true,
      onload: function () {

        //console.log(db.getAllData())

      }
    });
  }
}

module.exports._isnode = _isnode;
module.exports.getDb = function () {
  return db;
};

module.exports.run = function (key, runOptions) {
  key = {key: key};
  function onFind(err, doc) {
    eval(doc.source)
  }

  db.findOne(key).exec(onFind);

}
module.exports.save = function (key, val) {
  k = {key: key};
  doc = {key: key, source: val};

  function onUpdate(err, doc) {
    //justShowResult(van_dump(doc.source))
  }

  db.update(k, doc, {upsert: true}, onUpdate);
};