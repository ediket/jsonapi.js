# jsonapi.js

__jsonapi.js__ is a Javascript implement of [jsonapi](http://jsonapi.org/) 1.0 version.

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
var jsonapi = require('jsonapi.js');
var Pool = jsonapi.Pool;
var Resource = jsonapi.Resource;
var Relationship = jsonapi.Relationship;

var pool = new Pool();
pool.addRemote('foo', '/api/foo');


/*=============================
  Fetching Data
  http://jsonapi.org/format/#fetching
  =============================*/

/*
  GET /api/foo HTTP/1.1
  Accept: application/vnd.api+json
*/
pool.fetch('foo');

/*
  GET /api/foo/1 HTTP/1.1
  Accept: application/vnd.api+json
*/
pool.fetch('foo', 1);


/*=============================
  Creating, Updating and Deleting Resources
  http://jsonapi.org/format/#crud
  =============================*/

/*
  POST /api/foo HTTP/1.1
  Content-Type: application/vnd.api+json
  Accept: application/vnd.api+json

  {
    "data": {
      "type": "foo",
      "attributes": {
        "content": "foo"
      }
    }
  }
*/
pool.create('foo', {
  attributes: {
    content: 'foo'
  }
});

/*
  PATCH /api/foo/1 HTTP/1.1
  Content-Type: application/vnd.api+json
  Accept: application/vnd.api+json

  {
    "data": {
      "type": "foo",
      "id": 1,
      "attributes": {
        "content": "bar"
      }
    }
  }
*/
pool.update('foo', 1, {
  attributes: {
    'content': 'bar'
  }
});

/*
  DELETE /api/foo/1 HTTP/1.1
  Accept: application/vnd.api+json
*/
pool.remove('foo', 1);

/*=============================
  Update To-One Relationships
  http://jsonapi.org/format/#crud-updating-to-one-relationships
  =============================*/

var toOneRelationship = new Relationship({
  data: null
});

/*
  PATCH /api/foo/1/relationships/baz HTTP/1.1
  Content-Type: application/vnd.api+json
  Accept: application/vnd.api+json

  {
    "data": {
      type: 'baz',
      id: 1
    }
  }
*/
pool.replaceLinkage(toOneRelationship, {
  type: 'baz',
  id: 1
});

/*
  PATCH /api/foo/1/relationships/baz HTTP/1.1
  Content-Type: application/vnd.api+json
  Accept: application/vnd.api+json

  {
    "data": null
  }
*/
pool.replaceLinkage(toOneRelationship, null);


/*=============================
  Update To-Many Relationships
  http://jsonapi.org/format/#crud-updating-to-many-relationships
  =============================*/

var toManyRelationship = new Relationship({
  data: []
});

/*
  PATCH /api/foo/1/relationships/bar HTTP/1.1
  Content-Type: application/vnd.api+json
  Accept: application/vnd.api+json

  {
    "data": [{
      type: 'bar',
      id: 1
    }]
  }
*/
pool.replaceLinkage(toManyRelationship, [{
  type: 'bar',
  id: 1
}]);

/*
  POST /api/foo/1/relationships/bar HTTP/1.1
  Content-Type: application/vnd.api+json
  Accept: application/vnd.api+json

  {
    "data": [{
      type: 'bar',
      id: 1
    }]
  }
*/
pool.addLinkage(toManyRelationship, [{
  type: 'bar',
  id: 1
}]);

/*
  DELETE /api/foo/1/relationships/bar HTTP/1.1
  Content-Type: application/vnd.api+json
  Accept: application/vnd.api+json

  {
    "data": [{
      type: 'bar',
      id: 1
    }]
  }
*/
pool.removeLinkage(toManyRelationship, [{
  type: 'bar',
  id: 1
}]);
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
