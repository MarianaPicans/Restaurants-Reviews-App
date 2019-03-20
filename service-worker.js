'user strict'
import idb from 'idb';

const localAPI = 'http://localhost:1337/restaurants';
const dbPromise = openingDB();

function openingDB() {
    return idb.open('mws-restaurants', 1, function (upgradingDb) {
        upgradingDb.createObjectStore('restaurants', { keyPath: "id" });
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(c_version).then(function (cache) {
            return cache.addAll(files);
        })
    );
});

self.addEventListener('activate', function (event) {
});

var c_version = 'servicewk-1';
var files = [
    '/',
    '/restaurant',
    '/css/styles.css',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/reviews.js',
    '/js/dbhelper.js',
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/10.jpg',
    '/images/star_empty.svg',
    '/images/star_filled.svg'
];

self.addEventListener('fetch', function (event) {

    let request = event.request; 
    const chkUrl = new URL(event.request.url);

    if (chkUrl.port === "1337") {
        const URLstring = chkUrl.pathname;
        if (URLstring.lastIndexOf('/') > -1) {
            const lastString = URLstring.substring(URLstring.lastIndexOf('/') + 1);
            let id = -1;
            if (lastString != 'restaurants') {
                id = lastString;
            }
            APIRequestEvent(event, id);
        }
        else {
            console.log('here');
            nonAPIrequest(event, request);
        }

    } else {
        nonAPIrequest(event, request);
    }
});

const APIRequestEvent = (event, id) => {
    console.log('id ===========', id);
    
    //Make the request and cache the data on the databse
    event.waitUntil(
        fetch(event.request)
        .then(response => response.json())
        .then(function (data) {
            //Add each restaurant individaully
            dbPromise.then(function (dbRestshow) {

                var tx = dbRestshow.transaction('restaurants', 'readwrite');
                var restaurantsStore = tx.objectStore('restaurants');
            
                data.forEach(element => {
                    restaurantsStore.put(element);
                });

            }).catch(err => {
                console.log('DB ERROR', err);
            })

            
            event.respondWith(new Response(JSON.stringify(data)));

        }).catch(err => {

            dbPromise.then(function (dbRestshow) {
                if (id === -1) {
                    let data = dbRestshow
                        .transaction("restaurants")
                        .objectStore("restaurants")
                        .getAll();
                    event.respondWith(new Response(JSON.stringify(data)));
                } else {
                    let data = dbRestshow
                        .transaction("restaurants")
                        .objectStore("restaurants")
                        .get(id);
                    event.respondWith(new Response(JSON.stringify(data)));
                }
            }).catch(error => {
                console.log(error);
                event.respondWith(new Response(JSON.stringify([])));
            }); 
        })
    )
}

const nonAPIrequest = (event, Request) => {
    console.log('nonAPI');
     event.respondWith(
         caches.match(event.request)
             .then(function (response) {
                 if (response) {
                     return response;
                 }
                 var fetchRequest = event.request.clone();
                 return fetch(fetchRequest).then(
                     function (response) {
                         // Check if we received a valid response
                         if (!response || response.status !== 200 || response.type !== 'basic') {
                             return response;
                         }
                         var responseToCache = response.clone();
                         caches.open(c_version)
                             .then(function (cache) {
                                 cache.put(event.request, responseToCache);
                             });

                         return response;
                     }
                 );
             })
     );
 }   