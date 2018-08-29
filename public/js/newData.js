// inspired by (source)
// https://www.twilio.com/blog/2017/02/send-messages-when-youre-back-online-with-service-workers-and-background-sync.html
let newReviews = {
  db: null,

  init: function() {
    if (newReviews.db) { return Promise.resolve(newReviews.db); }
    return idb.open('restaurnatsData', 1, function(upgradeDb) {
      upgradeDb.createObjectStore('new', { autoIncrement : true, keyPath: 'id' });
    }).then(function(db) {
      return newReviews.db = db;
    });
  },

  newR: function(mode) {
    return newReviews.init().then(function(db) {
      return db.transaction('new', mode).objectStore('new');
    })
  }
}