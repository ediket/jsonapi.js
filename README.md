# jsonapi.js

__jsonapi.js__ is a Javascript implement of [jsonapi](http://jsonapi.org/).

inspired by [Orbit.js](https://github.com/orbitjs/orbit.js). 

## Installation

Install __jsonapi.js__ by [NPM](https://www.npmjs.com/)
```
npm install jsonapi.js
```

Install __jsonapi.js__ by [Bower](http://bower.io/)
```
bower install jsonapi.js
```

## Usage

if you want to use client side feature, use like this.
```javascript 
var memoryPool = new JSONAPI.MemoryPool();

memoryPool.create({
  type: 'foo',
  content: 'hello'
})
.then(function (resource) {
  return memoryPool.patch(resource, {
    content: 'wow'
  })
})
.then(function (resource) {
  return memoryPool.remove(resource);
});

memoryPool.create({
  type: 'bar',
  content: 'wow'
})
.then(function (resource) {
  return memoryPool.find(function (findedResource) {
    return findedResource.toJSON().content === resource.content;
  });
})
.then(function (resource) {
  // do something
});
```

if you want to use HTTP RESTful feature, just use like this.
```javascript 
var restPool = new JSONAPI.RestPool([], {
  typeToUrl: {
    "foo": "/foo/"
  }
});

/* 
    POST /foo/
    Content-Type: application/vnd.api+json
    Accept: application/vnd.api+json

    { 
        "data": { 
            "type": "foo", 
            "content": "hello"  
        }
    }
*/
restPool.create({  
  type: 'foo',
  content: 'hello'
})
/* 
    PATCH /foo/1
    Content-Type: application/vnd.api+json
    Accept: application/vnd.api+json

    { 
        "data": { 
            "type": "foo", 
            "id": "some-id"
            "content": "wow",
            "links": {
                "self": "/foo/some-id"
            }
        }
    }
*/
.then(function (resource) {  
  return restPool.patch(resource, {
    content: 'wow'
  })
})
/* 
    DELETE /foo/1
*/
.then(function (resource) {
  return restPool.remove(resource);
});

/* 
    GET /foo/1
*/
restPool.get('/resource/1')
.then(function (resource) {
  // do something
});
```

if you want to collaborate them, use like this.
```javascript 
var memoryPool = new JSONAPI.MemoryPool();
var restPool = new JSONAPI.RestPool([], {
  typeToUrl: {
    'foo': '/foo/'
  }
});
var memory2RestConnector = new JSONAPI.PoolConnector(pools.memory, pools.rest);

// fetch resource by GET request
restPool.get(url)
// and add to memoryPool
.then(function (resource) {
  return memoryPool.add(resource);
});

// create resource
memoryPool.create({
  type: 'foo',
  content: 'bar'
})
// and make POST request
.then(function (resource) {
  return memory2RestConnector.flush()
    .then(function () {
      return resource;
    });
})
// patch resource
.then(function (resource) {
  return memoryPool.patch(resource, {
    type: 'foo',
    content: 'bar'
  });
});
// and make PATCH request
.then(function (resource) {
  return memory2RestConnector.flush()
    .then(function () {
      return resource;
    });
});
// remove resource
.then(function (resource) {
  return memoryPool.remove(resource);
});
// and make DELETE request
.then(function (resource) {
  return memory2RestConnector.flush();
});



```

# Contributing

Install Dependencies: __mocha__ & __gulp__ & __babel__
```bash
npm install -g mocha
npm install -g gulp
npm install -g babel
```  

watch test
```bash
npm run test
```

build
```bash
npm run build
```
