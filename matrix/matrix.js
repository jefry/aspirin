var _isnode = typeof window == 'undefined';
var mdb;
if (!_isnode) {
  mdb = remote.app.matrix.getDb();
} else {
  var Datastore = require('nedb');

  if (!mdb) {

    mdb = new Datastore({
      filename: __dirname + '/data/matrix.json', autoload: true,
      onload: function () {

        //console.log(db.getAllData())

      }
    });
  }
}

module.exports._isnode = _isnode;
module.exports.getDb = function () {
  return mdb;
};

module.exports.run = function (key, opt) {
  key = {key: key};
  function onFind(err, doc) {
    eval(doc.source)
  }

  mdb.findOne(key).exec(onFind);

}
module.exports.save = function (key, val) {
  k = {key: key};
  doc = {key: key, source: val};

  function onUpdate(err, doc) {
    //justShowResult(van_dump(doc.source))
  }

  mdb.update(k, doc, {upsert: true}, onUpdate);
};