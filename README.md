# jsonapi.js

__jsonapi.js__ is a Javascript implement of [jsonapi](http://jsonapi.org/).

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

// it will make POST request.
pool.create({
  type: 'foo',
  content: 'foo'
});
.then(function () {
  // it will make GET request.
  return pool.fetch('foo', resource.get('id'));
});
.then(function (fooResource) {
  var isSame = pool.get(
    fooResource.get('type'),
    fooResource.get('id')
  ) === fooResource; // true

  // it will make PATCH request.
  return fooResource.update({
    'content': 'bar'
  });
})
.then(function () {
  var fooResource = pool.get('foo', 2);

  // it will make DELETE request.
  return pool.remove(fooResource);
});


var resource1 = new Resource({
  type: 'foo',
  id: 1,
  content: 'wow'
});

// it will make POST request to /api/foo/1/links/bar
pool.createLinkage('foo', 1, 'bar', {
  type: 'bar',
  id: 1
}, {
  hasMany: true
});
```

# Contributing

Install Dependencies: __gulp__
```bash
npm install -g gulp
```  

watch
```bash
gulp watch
```

build
```bash
gulp build
```

test
```bash
gulp test
```
