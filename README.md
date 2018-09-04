# Cloud Production API Server
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

## Getting Started

### Development local API Server
_Location of server = /server_
Server depends on [node.js LTS Version: v6.11.2 ](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/get-npm), and [sails.js](http://sailsjs.com/)
Please make sure you have these installed before proceeding forward.

Great, you are ready to proceed forward; awesome!

Let's start with running commands in your terminal, known as command line interface (CLI)

###### Install project dependancies
```Install project dependancies
# npm i
```
###### Install Sails.js globally
```Install sails global
# npm i sails@0.12.14 -g
```
###### Start the server
```Start server
# node server
```
### You should now have access to your API server environment
debug: Environment : development
debug: Port        : 1337


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
