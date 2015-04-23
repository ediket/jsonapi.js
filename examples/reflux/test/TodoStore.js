// var Q = require('q');
// var expect = require('chai').expect;
// var TodoStore = require('../src/TodoStore');
// var pools = require('../src/pools');
// var sinon = require('sinon');


// var stubPromise = function () {

//   var stub = sinon.stub.apply(sinon, arguments);

//   var deferred = Q.defer();

//   deferred.resolve();

//   stub.returns(deferred.promise);

//   return stub;

// };


// var promiseValue = function (value) {

//   var deferred = Q.defer();

//   deferred.resolve(value);

//   return deferred.promise;

// };


// describe('TodoStore', function () {

//   var restPool;
//   var syncronizer;
//   var originSyncronizer;

//   before(function () {

//     syncronizer = {
//       post: stubPromise(),
//       get: stubPromise(),
//       delete: stubPromise(),
//       patch: stubPromise()
//     };
//     originSyncronizer = pools.rest.syncronizer;
//     pools.rest.syncronizer = syncronizer;

//   });

//   beforeEach(function () {

//     syncronizer.post.reset();
//     syncronizer.get.reset();
//     syncronizer.delete.reset();
//     syncronizer.patch.reset();

//   });

//   after(function () {

//     pools.rest.syncronizer = originSyncronizer;

//   });

//   describe('#fetch', function () {

//     it('resource by GET request and add to Store', function () {

//       syncronizer.get.withArgs('/api/todo/1').returns(
//         promiseValue({
//           data: {
//             type: 'todo',
//             id: 1,
//             content: 'hello world',
//             links: {
//               self: '/api/todo/1'
//             }
//           }
//         })
//       );

//       return Q.fcall(function () {
//         return TodoStore.fetch(1);
//       })
//       .then(function (fetchedResource) {
//         expect(fetchedResource).to.be.ok;
//         return TodoStore.findById(1)
//           .then(function (storeResource) {
//             expect(storeResource).to.equal(fetchedResource);
//             expect(storeResource.toJSON()).to.deep.equal({
//               type: 'todo',
//               id: 1,
//               content: 'hello world'
//             });
//           });
//       });

//     })

//   });

// });
