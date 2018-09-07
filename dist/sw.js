importScripts('idb.js');
importScripts('/js/newData.js');

importScripts('/third_party/workbox/workbox-sw.js');

workbox.setConfig({
  modulePathPrefix: '/third_party/workbox/'
});

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([]);

  const showNotification = () => {
    self.registration.showNotification('Background sync success!', {
      body: '🎉`🎉`🎉`'
    });
  };

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const staticCacheName = 'mws-static-v1';
const contentImgsCache = 'mws-content-imgs';

var allCaches = [
  staticCacheName,
  contentImgsCache
];


/**
* Install service worker.
*/
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      cache.addAll([
        './index.html',
        './restaurant.html',
        './css/styles.css',
        './js/main.js',
        './js/restaurant_info.js',
        './js/Helper.js',
        './js/Toast.js',
        './idb.js',
        './js/dbhelper.js',
        './favicon.ico',
        './manifest.json'
      ]);
    }),
    caches.open(contentImgsCache).then(function(cache) {
      cache.addAll([
        './imgs/1.jpg',
        './imgs/2.jpg',
        './imgs/3.jpg',
        './imgs/4.jpg',
        './imgs/5.jpg',
        './imgs/6.jpg',
        './imgs/7.jpg',
        './imgs/8.jpg',
        './imgs/9.jpg',
        './imgs/10.jpg',
        './imgs/logo.svg',
        './imgs/no-pictures.svg',
        './imgs/star0.svg',
        './imgs/star1.svg'
      ]);
    })
  );
});

/**
* Clean unwanted cache.
*/
self.addEventListener('activate', function(event) {
event.waitUntil(
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.filter(function(cacheName) {
        return cacheName.startsWith('mws-') &&
               !allCaches.includes(cacheName);
      }).map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  })
);
});

/**
 * Sync data.
 */
self.addEventListener('sync', function(event) {
  if (event.tag == 'send-isFavourite') {
    event.waitUntil(
      newData.data('newIsFavourite', 'readwrite').then(function(data) {
        var tx = newData.db.transaction('newIsFavourite', 'readwrite');
        var store = tx.objectStore('newIsFavourite');

        store.index('by-date').openCursor(null, "prev").then(function(cursor) {
          return cursor.advance(1);
        }).then(function deleteRest(cursor) {
          if (!cursor) return;
          cursor.delete();
          return cursor.continue().then(deleteRest);
        });

        return store.index('by-date').getAll().then((data) => {
          if (data.length == 1) {
            submitFavourite(data[0]);
          } else {
            submitFavourite(data[1]);
          }
        })
      })
    );
  }

  if (event.tag == 'send-reviews') {
    event.waitUntil(
      newData.data('newR', 'readonly').then(function(data) {
        return data.getAll();
      }).then(function(items) {
        return Promise.all(items.map((item) => {
          return submitReview(item).then((response) => {
            return response.status
          }).then((status) => {
            if (status == '201') {
              newData.data('reviews', 'readwrite').then(function(dbData) {
                dbData.delete(item.id);
              })
              return newData.data('newR', 'readwrite').then(function(dbData) {
                return dbData.delete(item.id);
              })
            }
          })
        }))
      }).catch(function(err) {
         console.error(err);
      })
    );
  }
});

/**
 * Submit review to live database
 */
function submitReview(review) {
  const restaurant_id = review.restaurant_id;
  const name = review.name;
  const rating = review.rating;
  const comments = review.comments;

  return fetch('', {
    method: 'POST',
    body: `restaurant_id=${restaurant_id}&name=${name}&rating=${rating}&comments=${comments}`
  });
}

/**
 * Submit is_favorite status to live database
 */
function submitFavourite(item) {
  const restaurant_id = item.restaurant_id;
  const is_favorite = parseInt(item.is_favorite);

  return fetch('', {
    method: 'PUT',
    body: `is_favorite=${is_favorite}&restaurant_id=${restaurant_id}`
  });
}

/**
 * Intercept requests and respond with cache or make a request to the server.
 */
self.addEventListener('fetch', function(event) {
  /*
    DevTools opening will trigger these o-i-c requests,
    which this SW can't handle.
    https://github.com/paulirish/caltrainschedule.io/pull/51
  */
  if ((event.request.cache === 'only-if-cached')
      && (event.request.mode !== 'same-origin')) {
    return;
  }

  var requestUrl = new URL(event.request.url);
  const index = event.request.url + "index.html";

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(servePage(event.request, index));
      return;
    }
    if (requestUrl.pathname.endsWith('restaurant.html')) {
      event.respondWith(serveRestuarantPage(event.request));
      return;
    }
    if (requestUrl.pathname.startsWith('/imgs/')) {
      event.respondWith(servePhoto(event.request));
      return;
    }
  }

  event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
  );
});

/**
* Return the retuarant html template, ignoring id.
*/
function serveRestuarantPage(request, url) {
  var storageUrl = request.url.replace(/\?\id=[a-zA-Z0-9]*$/i, '');
  return servePage(request, storageUrl);
}

/**
* Serve a page with custom url that should match an existing cache url, fetch
* from network oherwise.
*/
function servePage(request, customUrl) {
 return caches.open(staticCacheName).then(function(cache) {
   return cache.match(customUrl).then(function(response) {
     var networkFetch = fetch(request).then(function(networkResponse) {
       cache.put(customUrl, networkResponse.clone());
       return networkResponse;
     });
     return response || networkFetch;
   });
 });
}

/**
 * Serve a photo with custom url that should match an existing cached photo,
 * fetch from network oherwise.
 */
function servePhoto(request) {
  var storageUrl = request.url.replace(/-\dx/, '');

  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

/**
*  Respond to messages.
*/
self.addEventListener('message', function(event) {
 if (event.data.action === 'skipWaiting') {
   self.skipWaiting();
 }
});
