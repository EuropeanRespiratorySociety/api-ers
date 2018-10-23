# ERS Content API

[![Greenkeeper badge](https://badges.greenkeeper.io/EuropeanRespiratorySociety/api-ers.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/EuropeanRespiratorySociety/api-ers.svg?branch=master)](https://travis-ci.org/EuropeanRespiratorySociety/api-ers)
[![codecov](https://codecov.io/gh/EuropeanRespiratorySociety/api-ers/branch/master/graph/badge.svg)](https://codecov.io/gh/EuropeanRespiratorySociety/api-ers)

This API provides access to the content of the ERS such as its calendar, news, blogs and other resources.

### Documentation

All endpoints are documented and accessible on the [ERS Content API documentation's page](https://api.ersnet.org/docs)

### Usage

Add a header to all requests:

`Content-Type application/json`

If not some end points will return html (404 etc.) instead of json.

### API
Many endpoints do not need authentication, for thoses where authentication is needed, you need to:

* [request credentials](mailto:webmaster@ersnet.org)
* use the provided credentials to get a JWT token: 
    * To use the api programmatically login with the provided credentials here: `/authentication`
    * Every request that requires authentication need to have an `Authorization` header with a value of `Bearer <your-token>`

_Note_: that authentication is intended for server to server communication, and not for __ajax__ or __app__ server conversation as the token could be spoofed. 

#### myERS
the `/ers/contacts/login` endpoint is used to get a token for a user, the other endpoints can be used with that token such as `/preferences` or `/users` etc. 

#### Example Jquery Client
Here is an example of Jquery client in order to display the news as a "Widget". This is an ERS example but of course you can change the HTML...
##### JS 
Use [jQuery REST Client](https://github.com/jpillora/jquery.rest)

```js
    <script type="text/javascript">
        $(document).ready(function(){
            var client = new $.RestClient('https://api.ersnet.org/', {
                cache: 60, //This will cache requests for 60 seconds
                cachableMethods: ["GET"] //This defines what method types can be cached (this is already set by default)
            });
            // var client = new $.RestClient('http://localhost:3030/');

            client.add('news');
            client.news.read({limit:5}).done(function (data){
                console.log(data)
                var articles = data.data;
                for( var i = 0; i < articles.length -1; i++){
                    if(articles[i].image) {
                        var image = 
                            '<div class="card-image"' 
                            +'style="background-size:cover;background-repeat: no-repeat;height:150px;' 
                            +'background-image: url(\'' + articles[i].image + '\');' 
                            +'background-position: center center;"></div>';
                    } else {
                        var image = '';
                    }
                    $(
                    '<li class="list-group-item panel panel-full-default">'
                        +'<div class="card card-default card-dashboard">'
                            +image
                            +'<div class="card-title">'
                                +'<h2 style="font-size:20px;">' + articles[i].title + '</h2>'
                            +'</div>'                 
                            +'<div class="card-content">'
                                + articles[i].leadParagraph
                            +'</div>'	                
                            +'<div class="card-action">'
                                +'<a href="' + articles[i].url + '" target="_blank"  class="btn btn-dark-primary pull-right">Read more...</a>'
                            +'</div>'
						+'</div>'
                    +'</li>'
                    ).appendTo($('#news-feed'));
                }
            });
        });    
    </script>
```

The static url is a url used to retrive assets and caching them. For example at ERS we use: `https://www.ersnet.org/assets`.

You can query different endpoints by adding them `client.add('news');`

#### Feathers/Vue Client

```js
import Feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication/client'
import rest from 'feathers-rest/client'
import axios from 'axios'

// Configure Feathers client
const restClient = rest(process.env.FEATHERS_HOST || 'http://localhost:3030')
const feathers = Feathers()
  .configure(restClient.axios(axios))
  .configure(hooks())
  .configure(authentication({storage: window.localStorage}))

import Vue from 'vue'
import VueFeathers from 'vue-feathers'
Vue.use(VueFeathers, feathers)

export default feathers

```

#### Vuex action @TODO async/await
```js
// Login user with email / password
export const login = ({commit, dispatch}, payload) => {
  return feathers.authenticate({strategy: 'local', ...payload})
    .then(res => {
      commit(types.LOGIN, res)
      return feathers.passport.verifyJWT(res.accessToken)
    })
    .then(payload => {
      return feathers.service('users').get(payload.userId)
    })
    .then(user => {
      feathers.set('user', user)
      commit(types.SET_USER, user)
      dispatch('getData')
    })
    .catch(error => {
      console.error('Error authenticating!', error)
      commit(types.SET_ERROR, error)
    })
}

```

## Cache
For performance reasons, each endpoint returning data from Cloud CMS is cached. __Normally__, the cache should not be cleared manually. When content is modified in the CMS the cache is invalidated.

But, to empty the __whole__ cache, just visit/call the following url:
`https://api.ersnet.org/cache/clear`

```js
'/cache/clear' // clears the whole cache
'/cache/clear/single/:target' // clears a single route if you want to purge a route with params just adds them target?param=1
'/cache/clear/group/:target' // clears a group
```

This will clean all routes for the different groups e.g. `news`, `respiratory-matters`, etc.

When an endpoint is cached, the API returns an object with cache informations:

```javascript
"cache": {
    "cached": true,
    "duration": 86400,
    "expiresOn": "2018-02-23T12:56:19.690Z",
    "parent": "courses",
    "group": "group-courses",
    "key": "courses"
}
```

Use the key to bust either the group or the single item cache.

or you can clean idividual routes:
* `https://api.ersnet.org/cache/clear/news/the-request-to-an-article`
* `https://api.ersnet.org/cache/clear/news?the=params&you=have&request=ed`


### Installation

1. Clone this project
2. Install dependencies:
    `npm install`
3. rename `env.txt` -> `.env` and add all the necessary key values. (all cloudcms keys from gitana.json):  
4. install databases by running `$ docker-compose up` or in detached mode: `$ docker-compose up -d` 
5. run your server:
    `$ npm start`
    or
    `$ pm2 start src/`
    `$ nodemon start src/`
    etc.
6. to run tests
    `$ npm run test`
7. Give a user admin rights:
    1. connect to mongo: `$ mongo`
    2. switch to correct db: `>>> use ers-api`
    3. find the user, i usally save the collection as a varaiable: `>>> u = db.users` then `>>> u.find({"ersId": 123456})` or `>>> u.find()` to list all users
    4. update persmissions either by replacing the whole object:
        ```
        u.update({"_id": ObjectId("5b42ed8456a353f33b9c6e1f")}, {"ersId" : 203041, "__v" : 0, "createdAt" : ISODate("2018-07-09T05:07:16.188Z"), "email" : "<the-email>", "key4Token" : "<the-token>", "password" : "<the-hashed-password>", "permissions" : [ "the-list, "of-permissions" ], "updatedAt" : ISODate("2018-07-09T05:07:16.188Z")})" ], "updatedAt" : ISODate("2018-07-09T05:07:16.188Z")})
        ```
        or by updating the permissions property
        ```
        u.update({"_id" : ObjectId("5b42ed8456a353f33b9c6e1f")}, {$addToSet:{permissions: "<the-permission-to-add>"}})
        ```
8. Redis: How to remove the password:
    1. `redis-cli`
    2. `AUTH <password>`
    3. `CONFIG SET requirepass ""` Removes the password

# Docker
Run the dev environment by:

```js
$ docker-compose up -d // -d = detached mode (no output to console)
```