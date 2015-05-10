# jsonapi.js

__jsonapi.js__ is a Javascript implement of [jsonapi](http://jsonapi.org/).
It has simple interface like [Git](http://www.git-scm.com/).

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

```javascript 
var pool = new JSONAPI.Pool();
pool.addRemote('foo', '/api/foo/');

var resource = new Resource({
  type: 'foo',
  content: 'foo'
});

pool.add(resource);
pool.commit();
// it will make POST request.
pool.push()
.then(function () {
  // it will make GET request.
  return pool.pull('foo', resource.get('id'));
});
.then(function (fooResource) {
  var isSame = pool.get(
    fooResource.get('type'), 
    fooResource.get('id')
  ) === fooResource; // true
  
  fooResource.set({
    'content': 'bar'
  });
  pool.add(fooResource);
  pool.commit();
  // it will make PATCH request.
  return pool.push();
})
.then(function () {
  var fooResource = pool.get('foo', 2);
  
  pool.rm(fooResource);
  pool.commit()
  // it will make DELETE request.
  return pool.push();
});


var resource1 = new Resource({
  type: 'foo',
  id: 1,
  content: 'wow'
});

pool.addLinkage(resource1, 'bar', {
  type: 'bar',
  id: 1
}, {
  hasMany: true
});
pool.commit();
// it will make POST request to /api/foo/1/links/bar
pool.push();
```

# Contributing

Install Dependencies: __mocha__ & __gulp__ & __babel__
```bash
npm install -g mocha
npm install -g gulp
npm install -g webpack
```  

watch test
```bash
npm run test
```

build
```bash
npm run build
```
