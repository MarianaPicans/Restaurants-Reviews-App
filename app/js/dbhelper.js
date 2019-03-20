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
    return `http://localhost:${port}/restaurants`;
  }

  static get DATABASE_URL_REVIEWS() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/reviews`;
  }


    static fetchRestaurants(callback) {
        //console.log('fetch rest start');
        let fetchData = DBHelper.DATABASE_URL;
        fetch(fetchData, {
            method: 'GET',
            mode: 'cors'
            
        })
            .then(function (response) {
               return response.json()
                    .then(function (restaurants) {
                        console.log("restaurants:".restaurants);
                        callback(null, restaurants);
                    });
            })
            .catch(function (error) {
                callback(`Request failed. Returned status of ${fetchData.status}`, null);
            });
    }


  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);

          if (restaurant) { // Got the restaurant
              let fetchDataById = DBHelper.DATABASE_URL + '/' + restaurant.id;
              fetch(fetchDataById, { method: 'GET' })
                  .then(function (response) {
                      return response.json()
                          .then(function (restaurants) {
                              callback(null, restaurants);
                          });
                  })
                  .catch(function (error) {
                    console.log(error);
                    callback(`Request failed`, null);
                  });
              //callback(null, restaurant);
          } else { // Restaurant does not exist in the database
              console.log('no restaurant: ' ,restaurant);
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  static getReviewsForRestaurant(id, callback){
    let fetchData = DBHelper.DATABASE_URL_REVIEWS + `/?restaurant_id=${id}`;
    fetch(fetchData, {
        method: 'GET',
        mode: 'cors'
    }).then(function (response) {
           return response.json()
          .then(function (reviews) {
              console.log("rev: ", reviews);
              callback(null, reviews);
          });
        })
        .catch(function (error) {
            callback(`Request failed`, null);
        });
  }


  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
    }


  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
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
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/images/${restaurant.photograph + '.jpg'}`);
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

  static addReview(data) {
    const id = getParameterByName('id');

    let fetchDataById = DBHelper.DATABASE_URL_REVIEWS + '/create?' + `restaurant_id=${id}&name=${data.name}&rating=${data.rating}&coments=${data.comments}`;

    fetch(fetchDataById, { method: 'GET' })
        .then(function (response) {
            return response.json()
                .then(function (res) {
                    console.log(res)
                    window.location = "localhost:8000/";
                });
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  static likeUnlikeRestaurant(restaurant, value, callback){
    let url = DBHelper.DATABASE_URL + `/${restaurant.id}/?is_favorite=${value}`;
    fetch(url, {
        method: 'PUT',
        mode: 'cors'
    }).then(function (response) {
         return response.json()
              .then(function (data) {
                if(response.status == 200){
                  callback(null)
                } else {
                  callback('Error liking restaurant');
                }
              });
    }).catch(function (error) {
          callback(`Request failed`);
      });
  }

}
