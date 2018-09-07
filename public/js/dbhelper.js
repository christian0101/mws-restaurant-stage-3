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

  static get offErrorMsg() {
    return 'Network requests have failed, this is expected if offline';
  }

  /* Network functions */

  static getServerData(url) {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    });
  }

  /**
   * Fetch all requested data.
   * Using Fetch API.
   * @param dataName name of the requested data
   * @param callback the callback function
   */
  static fetchData(dataName, dbPromise, callback) {

    const url = `${DBHelper.DATABASE_URL}/${dataName}/`;

    DBHelper.getLocalData(dbPromise, dataName)
      .then(offlineData => {
        if (offlineData.length) {
          callback(null, null, offlineData);
        }
        DBHelper.getServerData(url)
          .then(dataFromNetwork => {
            DBHelper._updateDB(dataName, dataFromNetwork);
            callback(null, null, dataFromNetwork);
          }).catch(err => {
            if (!offlineData.length) {
              callback(`No ${dataName} found :(`, null, null);
            } else {
              callback(null, DBHelper.offErrorMsg, offlineData);
            }
          })
      })
  }

  /**
   * Fetch a data by its ID.
   */
  static fetchDataById(dataName, id, dbPromise, callback) {
    const url = `${DBHelper.DATABASE_URL}/${dataName}/${id}`;

    DBHelper.getLocalData(dbPromise, dataName, id, false)
      .then(offlineData => {
        if (offlineData) {
          callback(null, null, offlineData);
        }
        DBHelper.getServerData(url)
          .then(dataFromNetwork => {
            DBHelper._updateDB(dataName, dataFromNetwork);
            callback(null, null, dataFromNetwork);
          }).catch(err => {
            if (!offlineData) {
              callback(`No ${dataName} found :(`, null, null);
            } else {
              callback(null, DBHelper.offErrorMsg, offlineData);
            }
          })
      })
  }

  /**
   * Fetch all requested data.
   * Using Fetch API.
   * @param id restaurant id
   * @param callback the callback function
   */
  static fetchReviewsByRestaurantId(id, dbPromise, callback) {
    const dataName = 'reviews';
    const url = `${DBHelper.DATABASE_URL}/${dataName}/?restaurant_id=${id}`;

    DBHelper.getLocalData(dbPromise, dataName, id, true, 'by-restaurant')
      .then(offlineData => {
        if (offlineData.length) {
          offlineData.reverse();
          callback(null, null, offlineData);
        }
        DBHelper.getServerData(url)
          .then(dataFromNetwork => {
            DBHelper._updateDB(dataName, dataFromNetwork);
            dataFromNetwork.reverse();
            callback(null, null, dataFromNetwork);
          }).catch(err => {
            if (!offlineData.length) {
              callback(`No ${dataName} found :(`, null, null);
            } else {
              callback(null, DBHelper.offErrorMsg, offlineData);
            }
          })
      })
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, dbPromise, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchData('restaurants', (error, msg, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(msg, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, dbPromise, callback) {
    // Fetch all restaurants
    DBHelper.fetchData('restaurants', dbPromise, (error, msg, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(msg, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, dbPromise, callback) {
    // Fetch all restaurants
    DBHelper.fetchData('restaurants', dbPromise, (error, msg, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(msg, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(dbPromise, callback) {
    // Fetch all restaurants
    DBHelper.fetchData('restaurants', dbPromise, (error, msg, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(msg, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(dbPromise, callback) {
    // Fetch all restaurants
    DBHelper.fetchData('restaurants', dbPromise, (error, msg, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(msg, uniqueCuisines);
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

  /* Storage functions */

  /**
   * Create database for restaurants.
   */
  static openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    if (!('indexedDB' in window)) {return null;}

    return idb.open('restaurantsData', 1, function(upgradeDb) {
      const stores = ['restaurants', 'reviews', 'newR', 'newIsFavourite'];
      stores.forEach(item => {
        if (!upgradeDb.objectStoreNames.contains(item)) {
          let store = upgradeDb.createObjectStore(item, {
            autoIncrement : true, keyPath: 'id'
          });

          store.createIndex('by-date', 'createdAt');

          if (item === 'reviews' || item === 'newIsFavourite') {
            store.createIndex('by-restaurant', 'restaurant_id');
          }
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

  static getLocalData(dbPromise, dataName, id, getAll = true, index) {
    if (!('indexedDB' in window)) {return null;}
    return dbPromise.then(db => {
      if(!isNaN(id)) {
        id = parseInt(id);
      }
      const tx = db.transaction(dataName, 'readonly');
      const store = tx.objectStore(dataName);
      const dbIndex = (index) ? store.index(index) : store;
      if (getAll) {
        return (id) ? dbIndex.getAll(id) : dbIndex.getAll();
      } else {
        return dbIndex.get(id);
      }
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
     const toast = this._toastsView.create("New version available", null, ['refresh', 'dismiss']);

     toast.answer.then(function(answer) {
       if (answer != 'refresh') return;
       worker.postMessage({action: 'skipWaiting'});
     });
   }

}
