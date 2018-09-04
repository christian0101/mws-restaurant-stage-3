let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

/**
 * Fetch data as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  DBHelper.registerServiceWorker();
  this._toastsView = new Toast();
  fetchNeighborhoods();
  fetchCuisines();
  updateRestaurants();
});

/**
 * Display notifications.
 */
 showNotification = (msg, options = {buttons: ['dismiss']}) => {
   this._toastsView.create(msg, options);
 }

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      showNotification(error);
      if (!neighborhoods) {
        return;
      }
    }
    self.neighborhoods = neighborhoods;
    fillNeighborhoodsHTML();
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      showNotification(error);
      if (!cuisines) {
        return;
      }
    }
    self.cuisines = cuisines;
    fillCuisinesHTML();
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });

  if (self.restaurants) {
    addMarkersToMap();
  }
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      showNotification(error);
      if (!restaurants) {
        return;
      }
    }

    resetRestaurants(restaurants);
    fillRestaurantsHTML();
    Helper.lazyLoad();
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');

  if (restaurants.length === 0) {
    const noRestaurants = document.createElement('p');
    noRestaurants.innerHTML = `Could not find any restaurants :(`;
    ul.appendChild(noRestaurants);
    return;
  }

  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  //addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const imgSrc = DBHelper.imageUrlForRestaurant(restaurant, true);
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.classList.add('lazy');
  image.src = imgSrc;
  image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant));
  image.setAttribute('data-srcset', DBHelper.imageSRCSetUrlsForRestaurant(restaurant, ['1x', '2x']));
  image.alt = (restaurant.photograph) ? DBHelper.getPhotoDescription(restaurant) :
  'no picture found';
  li.append(image);

  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  name.title = 'restaurant name';
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.title = 'restaurant neighborhood';
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.title = 'restaurant address';
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = `View More about ${restaurant.name}`;
  more.title = `More details about the resturant ${restaurant.name}`;
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });

    self.markers.push(marker);
  });
}