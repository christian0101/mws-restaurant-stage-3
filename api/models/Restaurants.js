/**
 * Restaurants.js
 *
 * @description :: Specifies datatypes for database.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    is_favorite: {type: 'boolean'},
    createdAt: {type: 'date'},
    updatedAt: {type: 'date'}
  }
};
