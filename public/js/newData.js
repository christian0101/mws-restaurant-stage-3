// inspired by (source)
// https://www.twilio.com/blog/2017/02/send-messages-when-youre-back-online-with-service-workers-and-background-sync.html
let newData = {
  db: null,

  init: function(name) {
    if (newData.db) {
      return Promise.resolve(newData.db);
    }

    return idb.open('restaurantsData', 1, function(upgradeDb) {
      upgradeDb.createObjectStore(name, { autoIncrement : true, keyPath: 'id' });
    }).then(function(db) {
      return newData.db = db;
    });
  },

  data: function(name, mode) {
    return newData.init(name).then(function(db) {
      return db.transaction(name, mode).objectStore(name);
    })
  }
}
