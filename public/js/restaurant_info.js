let restaurant, reviews;
var map;

/**
 * Fetch data as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  DBHelper.registerServiceWorker();
  this._toastsView = new Toast();
  fetchRestaurantFromURL();
});

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
    DBHelper.fetchDataById('restaurants', id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (error && !restaurant) {
        showNotification(error);
        return;
      }

      DBHelper.fetchReviewsByRestaurantId(id, (error, reviews) => {
        self.reviews = reviews.reverse();
        if (error) {
          showNotification(error);
        }

        fillRestaurantHTML();
        Helper.lazyLoad();
        });
    });
  }
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
  // fill submit review form
  fillSubmitReviewFormHTML();
  // fill reviews
  fillReviewsHTML();
}

/**
 * Hadle favourite toggle
 */
 updateIsFavourite = (restaurant = self.restaurant) => {
   const is_favorite = (restaurant.is_favorite) ? 0 : 1;
   let xhr = new XMLHttpRequest();

   // Define what happens on successful data submission
   xhr.addEventListener("load", function(event) {
     showNotification(`Restaurant is ${(is_favorite) ? 'favourite now :)' : 'not favourite anymore :('}`);
     restaurant.is_favorite = (is_favorite) ? true : false;
   });

   // Define what happens in case of error
   xhr.addEventListener("error", function(event) {
     showNotification('Oops! Something went wrong. :(');
   });

   xhr.open('PUT', window.location.href, true);
   xhr.send(`is_favorite=${is_favorite}&restaurant_id=${restaurant.id}`);
 }

/**
 * Display notifications.
 */
showNotification = (msg, options = {buttons: ['dismiss']}) => {
  this._toastsView.create(msg, options);
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
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
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (reviews.length === 0) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
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
fillSubmitReviewFormHTML = (restaurant = self.restaurant) => {
  const ul = document.getElementById('reviews-list');

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
  nameLbl.innerHTML = '* Name:';
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
  commentsLbl.innerHTML = '* Comments:';
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
  DBHelper._updateDB('new', review);

  let reviewNode = createReviewHTML(review);

  return navigator.serviceWorker.ready.then(reg => {
    return reg.sync.register('send-reviews')
  }).then(() => {
    showNotification('Your review will be posted as soon as possible.');
    ul.insertBefore(reviewNode, form.parentNode);
    ul.removeChild(form.parentNode);
  }).catch(() => {
    showNotification('Error');
  });
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.setAttribute('aria-current', 'page')
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
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
