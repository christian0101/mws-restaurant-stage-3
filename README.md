# Cloud Development API Server
## Usage
#### Get Restaurants
```
curl "https://api-restaurant-reviews.herokuapp.com/restaurants/"
```
#### Get Restaurants by id
````
curl "https://api-restaurant-reviews.herokuapp.com/restaurants/{3}"
````

## Architecture
Local server
- Node.js
- Sails.js

## Contributors

- [Brandy Lee Camacho - Technical Project Manager](mailto:brandy.camacho@udacity.com)
- [David Harris - Web Services Lead](mailto:david.harris@udacity.com)
- [Omar Albeik - Frontend engineer](mailto:omaralbeik@gmail.com)
- [Cristian Sorescu - Student](https://github.com/christian0101)

## Endpoints

### GET Endpoints

#### Get all restaurants
```
https://api-restaurant-reviews.herokuapp.com/restaurants/
```

#### Get favorite restaurants
```
https://api-restaurant-reviews.herokuapp.com/restaurants/?is_favorite=true
```

#### Get a restaurant by id
```
https://api-restaurant-reviews.herokuapp.com/restaurants/<restaurant_id>
```

#### Get all reviews for a restaurant
```
https://api-restaurant-reviews.herokuapp.com/reviews/?restaurant_id=<restaurant_id>
```

#### Get all restaurant reviews
```
https://api-restaurant-reviews.herokuapp.com/reviews/
```

#### Get a restaurant review by id
```
https://api-restaurant-reviews.herokuapp.com/reviews/<review_id>
```

#### Get all reviews for a restaurant
```
https://api-restaurant-reviews.herokuapp.com/reviews/?restaurant_id=<restaurant_id>
```

If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting an issue here. Even better you can submit a Pull Request with a fix :)
