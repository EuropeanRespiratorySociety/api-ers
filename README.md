# ERS Content API

This API provides access to the content of the ERS such as its calendar, news, blogs and other resources.

### Documentation

All endpoints are documented and accessible on the [ERS Content API documentation's page](https://api.ersnet.org/docs)

### Usage

Add a header to all requests:

`Content-Type application/json`

If not some end points will return html (404 etc.) instead of json.

Many endpoints do not need authentication, for thoses where authentication is needed, you need to:

* [request credentials](mailto:webmaster@ersnet.org)
* use the provided credentials to get a JWT token: 
    * To use the api programmatically login with the provided credentials here: `/authentication`
    * Every request that requires authentication need to have an `Authorization` header with a value of `Bearer <your-token>`


#### Example Jquery Client
Here is an example of Jquery client in order to display the news as a "Widget". This is an ERS example but of course you can change the HTML...
##### JS 
Use [jQuery REST Client](https://github.com/jpillora/jquery.rest)

```
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

### Feathers Client

```
    const express = require('express');
    const app = express();
    const feathers = require('feathers/client')
    const hooks = require('feathers-hooks');
    const rest = require('feathers-rest/client');
    const auth = require('feathers-authentication-client');
    const axios = require('axios');
    const host = 'http://localhost:3030';

    const f = feathers()
    .configure(hooks())
        .configure(auth({path: 'auth/token'}))
        .configure(rest(host).axios(axios));

    f.authenticate({
        strategy: 'local',
        'email': '', //The email you sent ERS for your API account
        'password': '' //The password provided
    }).then(function(result){
        console.log('Authenticated! Token:', result.token);
    }).catch(function(error){
        console.error('Error authenticating!', error);
    });

    app.get('/news', (req,res) => {
        axios.get('http://localhost:3030/news').then(response => {
        //console.log(response.data);
        res.json(response.data);
        }).catch(e => {
        res.json(e);
        })
    });

```

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

## Cache
For performance reasons, each endpoint returning data from cloudcms is cached.
To empty the cache, just visit/call the following url:
`https://api.ersnet.org/cache/clear`

Available routes
```
/cache/index // returns an array with all the keys
/cache/clear // clears the whole cache
/cache/clear/single/:target // clears a single route if you want to purge a route with params just adds them target?param=1
/cache/clear/group/:target // clears a group
```

This will clean all routes for the different groups e.g. `news`, `respiratory-matters`, etc.

or you can clean idividual routes:
* `https://api.ersnet.org/cache/clear/news/the-request-to-an-article`
* `https://api.ersnet.org/cache/clear/news?the=params&you=have&request=ed`