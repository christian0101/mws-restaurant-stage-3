let restaurant, reviews;
var map;

/**
 * Fetch data as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  DBHelper.registerServiceWorker();
  this._dbPromise = DBHelper.openDatabase();
  this._toastsView = new Toast();
  fetchRestaurantFromURL();
});

/**
 * Display notifications.
 */
showNotification = (msg, duration, options) => {
   this._toastsView.create(msg, duration, options);
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  if (self.restaurant) {
    self.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: self.restaurant.latlng,
      scrollwheel: false
    });
    DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
  }
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = () => {
  if (self.restaurant) { // restaurant already fetched!
    //callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    showNotification('No restaurant id in URL');
    return;
  } else {
    DBHelper.fetchDataById('restaurants', id, this._dbPromise, (error, msg, restaurant) => {
      self.restaurant = restaurant;
      if (error) {
        showNotification(error);
        return;
      } else if(msg) {
        showNotification(msg);
      }

      fillRestaurantHTML();
      Helper.lazyLoad();
    });

    DBHelper.fetchReviewsByRestaurantId(id, this._dbPromise, (error, msg, reviews) => {
      if (error) {
        showNotification(error);
        fillReviewsHTML();
      } else if(msg) {
        showNotification(msg);
      }

      resetReviews(reviews);
      // fill reviews
      fillReviewsHTML();
    });
  }
}

/**
 * Clear current reviews and their HTML.
 */
resetReviews = (reviews) => {
  // Remove all restaurants
  self.reviews = [];
  const ul = document.getElementById('reviews-list');
  ul.innerHTML = '';
  self.reviews = reviews;
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  fillBreadcrumb();

  const head = document.getElementsByTagName('head')[0];
  const description = document.createElement('meta');
  description.setAttribute('name', 'description');
  description.setAttribute('content', `Detailed information about ${restaurant.name}`);
  head.append(description);

  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  name.title = 'restaurant name';
  const favouriteToggle = document.createElement('input');
  favouriteToggle.type = 'checkbox';
  favouriteToggle.name = 'favourite';
  favouriteToggle.value = 'favourite';
  favouriteToggle.id = 'favourite';
  favouriteToggle.checked = restaurant.is_favorite;
  favouriteToggle.setAttribute('onchange', 'updateIsFavourite()');
  const toggleLbl = document.createElement('label');
  toggleLbl.setAttribute('for', 'favourite');
  name.appendChild(favouriteToggle);
  name.appendChild(toggleLbl);

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.title = 'restaurant address';

  const imgSrc = DBHelper.imageUrlForRestaurant(restaurant, true);
  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.classList.add('lazy');
  image.src = imgSrc;
  image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant));
  image.setAttribute('data-srcset', DBHelper.imageSRCSetUrlsForRestaurant(restaurant, ['1x', '2x']));
  image.alt = (restaurant.photograph) ? DBHelper.getPhotoDescription(restaurant) :
  'no picture found';

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.title = 'restaurant cuisine type';

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
}

/**
 * Hadle favourite toggle
 */
 updateIsFavourite = (restaurant = self.restaurant) => {
   const is_favorite = (restaurant.is_favorite) ? 0 : 1;

   const options = {month: 'long', day: 'numeric', year: 'numeric'};
   const now = new Date().toLocaleDateString('en-us', options);
   const isFavourite = {
     "restaurant_id": restaurant.id,
     "is_favorite": parseInt(is_favorite),
     "createdAt": now
   }

   return fetch('api/alter', {
     method: 'PUT',
     body: `is_favorite=${is_favorite}&restaurant_id=${restaurant.id}`
   }).then(response => {
     saveLocally();
     showNotification(`Restaurant is ${(is_favorite) ? 'favourite now :)' : 'not favourite anymore :('}`, 1.5);
   }).catch(err => {
     showNotification('Offline! Will update state as soon as possible.', 2);
     saveLocally();
   });

   // sendData(isFavourite).then((a) => {
   //   saveLocally()
   // });
 }

/**
 * Send data
 */
 sendData = (data) => {
  return DBHelper._updateDB('newIsFavourite', data).then(() => {
    // Wait for the scoped service worker registration to get a
    // service worker with an active state
    return navigator.serviceWorker.ready;
  }).then(reg => {
    return reg.sync.register('send-isFavourite');
  }).then(() => {
    showNotification(`Restaurant is ${(data.is_favorite) ? 'favourite now :)' : 'not favourite anymore :('}`, 1.5);
  }).catch(() => {
    showNotification('Oops! Something went wrong.', 3);
  });
}

saveLocally = (restaurant = self.restaurant) => {
  restaurant.is_favorite = !restaurant.is_favorite;
  return DBHelper._updateDB('restaurants', restaurant).then(() => {
    //console.log('updated local copy');
  });
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  hours.innerHTML = '';
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    day.className = 'openhours-day';
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    time.className = 'openhours-time';
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {
  const container = document.getElementById('reviews-container');
  const ul = document.getElementById('reviews-list');
  fillSubmitReviewFormHTML(ul);

  if (reviews.length === 0) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }

  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.className = 'review-name';
  name.title = "reviewer's name";
  li.appendChild(name);

  const date = document.createElement('p');
  const options = {month: 'long', day: 'numeric', year: 'numeric'};
  const createdAt = new Date(review.createdAt).toLocaleDateString('en-us', options);
  date.innerHTML = createdAt;
  date.className = 'review-date';
  date.title = 'date when review was posted';
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.className = 'review-rating';
  rating.title = 'given rating';
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.className = 'review-comments';
  comments.title = 'comments from the reviewer';
  li.appendChild(comments);

  return li;
}

/**
 *  Create a HTML submit form and add it to the webpage.
 */
fillSubmitReviewFormHTML = (ul, restaurant = self.restaurant) => {
  const li = document.createElement('li');
  const form = document.createElement('form');
  form.id = 'form-review';
  form.method = 'POST';
  form.setAttribute('aria-label', 'Add review for restaurant');

  const restaurantID = document.createElement('input');
  restaurantID.id = 'restaurant_id';
  restaurantID.name = 'restaurant_id';
  restaurantID.type = 'hidden';
  restaurantID.value = restaurant.id;
  form.appendChild(restaurantID);

  const nameShell = document.createElement('p');
  nameShell.className = 'review-name';
  const nameLbl = document.createElement('label');
  nameLbl.innerHTML = '*Name:';
  nameLbl.for = 'uName';
  nameLbl.title = "reviewer's name";
  nameShell.appendChild(nameLbl);

  const nameInput = document.createElement('input');
  nameInput.id = 'uName';
  nameInput.name = 'name'
  nameInput.placeholder = 'Your Name';
  nameInput.setAttribute('aria-required', 'true')
  nameInput.setAttribute('aria-label', 'Your name');
  nameLbl.appendChild(nameInput);
  form.appendChild(nameShell);

  const date = document.createElement('p');
  const options = {month: 'long', day: 'numeric', year: 'numeric'};
  const now = new Date().toLocaleDateString('en-us', options);
  date.innerHTML = now;
  date.className = 'review-date';
  date.title = 'date when review is posted';
  form.appendChild(date);

  const ratingShell = document.createElement('p');
  ratingShell.className = 'review-rating';
  const ratingLbl = document.createElement('label');
  ratingLbl.innerHTML = 'Rating:';
  const ratingOptions = document.createElement('select');
  ratingOptions.name = 'rating';
  for (var i = 1; i <= 5; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    ratingOptions.appendChild(option);
  }
  ratingLbl.appendChild(ratingOptions);
  ratingShell.appendChild(ratingLbl);
  form.appendChild(ratingShell);

  const commentsShell = document.createElement('p');
  commentsShell.className = 'review-comments';
  const commentsLbl = document.createElement('label');
  commentsLbl.innerHTML = '*Comments:';
  const commentsText = document.createElement('textarea');
  commentsText.name = 'comments';
  commentsText.id = 'commentsText';
  commentsText.setAttribute('aria-required', 'true')
  commentsText.setAttribute('aria-label', 'Additional comments for the review');
  commentsShell.appendChild(commentsLbl);
  commentsShell.appendChild(commentsText);
  form.appendChild(commentsShell);

  const submitShell = document.createElement('p');
  const submitBtn = document.createElement('button');
  submitBtn.id = 'submitBtn';
  submitBtn.type = 'submit';
  submitBtn.innerHTML = 'Submit Review!';
  submitBtn.value = 'Submit';
  submitBtn.setAttribute('aria-label', 'Submit review');
  submitShell.appendChild(submitBtn);
  form.appendChild(submitShell);

  li.appendChild(form);
  ul.appendChild(li);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    submitReview(form);
  });
}

/**
* Submit reviews though javascript.
*/
submitReview = (form) => {
  // Bind the FormData object and the form element
  const FD = new FormData(form);

  const review = {};
  let badData = false;
  FD.forEach(function(value, key) {
    const safeStr = escape(value);
    if (safeStr === '') {
      showNotification(`Oh no! Something went wrong, please check ${key} field`);
      badData = true;
    }
    review[key] = safeStr;
  });

  // don't post badly formed reviews
  if (badData) {
    return;
  }

  let ul = form.parentNode.parentNode;

  const options = {month: 'long', day: 'numeric', year: 'numeric'};
  const now = new Date().toLocaleDateString('en-us', options);
  review['createdAt'] = now;
  DBHelper._updateDB('reviews', review);

  review.name = unescape(review.name);
  review.comments = unescape(review.comments);
  let reviewNode = createReviewHTML(review);

  return fetch('api/add', {
    method: 'POST',
    body: `restaurant_id=${review.restaurant_id}&name=${review.name}&rating=${review.rating}&comments=${review.comments}`
  }).then(response => {
    ul.insertBefore(reviewNode, form.parentNode);
    ul.removeChild(form.parentNode);
    showNotification('Your review has been posted.', 3);
  }).catch(err => {
    ul.insertBefore(reviewNode, form.parentNode);
    ul.removeChild(form.parentNode);
    showNotification('Offline! Your review will be posted as soon as possible.', 3);
  });
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  resetBreadcrumb(breadcrumb);
  const li = document.createElement('li');
  li.setAttribute('aria-current', 'page')
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Clear breadcrumb, removes all entities except first, Home.
 */
resetBreadcrumb = (breadcrumb) => {
  const length = breadcrumb.children.length;
  for (let i = 1; i < length; i++) {
    breadcrumb.removeChild(breadcrumb.children.item(i));
  }
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
