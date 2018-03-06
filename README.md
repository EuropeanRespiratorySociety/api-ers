# ERS Content API
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
3. add a `.env` file with the following keys (all cloudcms keys from gitana.json):
```
    NODE_ENV=local|production|test
    CACHE_DEBUG=true|false
    CACHE_ENABLED=true|false
    MONGODB=<path-to-your-db>/<name-of-your-db>
    API_URL=<domain-of-api>
    clientKey=<your-key>
    clientSecret=<your-coloud-cms-secret>
    username=<your-cloud-cms-username>
    password=<your-cloud-cms-password>
    baseURL=https://api.cloudcms.com
    application=<your-cloud-cms-application>
```    
4. run your server:
    `npm start`
    or
    `pm2 start src/`
    `nodemon start src/`
    etc.
5. to run tests
    `npm run test`
6. to send coverage results to coveralls (add a .coveralls.yml with your key)
    `npm run coveralls`