/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}`;
  }

  static get errorMsg() {
    return 'Oh no! Could not refresh content :(';
  }

  /**
   * Fetch all requested data.
   * Using Fetch API.
   * @param dataName name of the requested data
   * @param callback the callback function
   */
  static fetchData(dataName, callback) {
    DBHelper.openDatabase().then(function(db) {
      if (!db) {
        return;
      }

      let dbData = db.transaction(dataName).objectStore(dataName);

      dbData.getAll().then(function(content) {
        fetch(`${DBHelper.DATABASE_URL}/${dataName}/`)
        .then(response => response.json())
        .then((data) => {
          // update IDB only if content is different
          if (JSON.stringify(data) !== JSON.stringify(content)) {
            DBHelper._updateDB(dataName, data);
            callback(null, data);
          } else {
            callback(null, content);
          }
        })
        .catch(e => callback(DBHelper.errorMsg, content));
      });
    });
  }

  /**
   * Fetch a data by its ID.
   */
  static fetchDataById(dataName, id, callback) {
    DBHelper.openDatabase().then(function(db) {
      if (!db) {
        return;
      }

      let dbData = db.transaction(dataName).objectStore(dataName);

      dbData.get(id).then(function(content) {
        fetch(`${DBHelper.DATABASE_URL}/${dataName}/${id}`)
        .then(response => response.json())
        .then((data) => {
          if (JSON.stringify(data) !== JSON.stringify(content)) {
            DBHelper._updateDB(dataName, data);
            callback(null, data);
          } else {
            callback(null, content)
          }
        })
        .catch(e => callback(DBHelper.errorMsg, content));
      });
    });
  }

  /**
   * Fetch all requested data.
   * Using Fetch API.
   * @param id restaurant id
   * @param callback the callback function
   */
  static fetchReviewsByRestaurantId(id, callback) {
    DBHelper.openDatabase().then(function(db) {
      if (!db) {
        return;
      }

      let dbData = db.transaction('reviews').objectStore('reviews');
      const restaurantReviews = dbData.index('by-restaurant');

      restaurantReviews.getAll(id).then(function(content) {
        fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${id}`)
        .then(response => response.json())
        .then((data) => {
          if (JSON.stringify(data) !== JSON.stringify(content)) {
            DBHelper._updateDB('reviews', data);
            callback(null, data);
          } else {
            callback(null, content);
          }
        })
        .catch(e => callback(DBHelper.errorMsg, content));
      });
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchData('restaurants', (error, restaurants) => {
      if (error && restaurants.length === 0) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(error, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchData('restaurants', (error, restaurants) => {
      if (error && restaurants.length === 0) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(error, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchData('restaurants', (error, restaurants) => {
      if (error && restaurants.length === 0) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(error, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchData('restaurants', (error, restaurants) => {
      if (error && restaurants.length === 0) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(error, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchData('restaurants', (error, restaurants) => {
      if (error && restaurants.length === 0) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(error, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image description.
   */
  static getPhotoDescription(restaurant) {
    return (`Photo of ${restaurant.name} in ${restaurant.neighborhood}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant, low = false) {
    if (restaurant && restaurant.photograph) {
      return (low) ? (`imgs/${restaurant.photograph}-low.jpg`) :
                    (`imgs/${restaurant.photograph}.jpg`);
    } else {
      return (`imgs/no-pictures.svg`);
    }
  }

  /**
   * Restaurant image srcset URLs.
   */
  static imageSRCSetUrlsForRestaurant(restaurant, opts) {
    let images = [];

    if (restaurant && restaurant.photograph) {
      opts.forEach(prop => {
        images.push(`imgs/${restaurant.photograph}-${prop}.jpg ${prop}`);
      });
    }

    return images.join(', ');
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

  /**
   * Create database for restaurants.
   */
  static openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open('restaurantsData', 1, function(upgradeDb) {
      const stores = ['restaurants', 'reviews', 'newR', 'newIsFavourite'];

      stores.forEach(item => {
        let store = upgradeDb.createObjectStore(item, {
          autoIncrement : true, keyPath: 'id'
        });

        store.createIndex('by-date', 'createdAt');

        if (item === 'reviews' || item === 'newIsFavourite') {
          store.createIndex('by-restaurant', 'restaurant_id');
        }
      })
    });
  }

  /**
   * Add new restaurants from network.
   */
  static _updateDB(dataName, data, callback) {
    return DBHelper.openDatabase().then(function(db) {
      if (!db) return;

      var tx = db.transaction(dataName, 'readwrite');
      var store = tx.objectStore(dataName);

      let newData = [].concat(data);

      newData.forEach(item => {
        store.put(item);
      });

      // limit store to 30 items
      store.index('by-date').openCursor(null, "prev").then(function(cursor) {
        return cursor.advance(30);
      }).then(function deleteRest(cursor) {
        if (!cursor) return;
        cursor.delete();
        return cursor.continue().then(deleteRest);
      });
    });
  }

  /**
   * Register service worker
   */
   static registerServiceWorker() {
     if (!navigator.serviceWorker) {
       return;
     }

     navigator.serviceWorker.register('sw.js').then(function(reg) {
       if (!navigator.serviceWorker.controller) {
         return;
       }

       if (reg.waiting) {
         DBHelper._updateReady(reg.waiting);
         return;
       }

       if (reg.installing) {
         DBHelper._trackInstalling(reg.installing);
         return;
       }

       reg.addEventListener('updatefound', function() {
         DBHelper._trackInstalling(reg.installing);
       });
     });

     // Ensure refresh is only called once.
     // This works around a bug in "force update on reload".
     var refreshing;
     navigator.serviceWorker.addEventListener('controllerchange', function() {
       if (refreshing) return;
       window.location.reload();
       refreshing = true;
     });
   }

   /**
    * service worker
    */
   static _trackInstalling(worker) {
     worker.addEventListener('statechange', function() {
       if (worker.state == 'installed') {
         DBHelper._updateReady(worker);
       }
     });
   }

   /**
    * service worker
    */
   static _updateReady(worker) {
     this._toastsView = new Toast();
     const toast = this._toastsView.create("New version available", {
       buttons: ['refresh', 'dismiss']
     });

     toast.answer.then(function(answer) {
       if (answer != 'refresh') return;
       worker.postMessage({action: 'skipWaiting'});
     });
   }

}
