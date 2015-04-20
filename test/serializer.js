// import { expect } from 'chai';
// import sinon from 'sinon';
// import _ from 'lodash';
// import {
//   serializer,
//   Resource,
//   ResourceCollection } from '../build/jsonapi';


// describe('serializer', function () {

//   describe('#serialize', function () {

//     it('should be able to serialize Resource', function () {

//       var res1 = new Resource({
//         id: 1,
//         type: 'foo',
//         content: 'hello'
//       });

//       expect(serializer.serialize(res1))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": {
//               id: 1,
//               type: 'foo',
//               content: 'hello'
//             }
//           })
//         );

//       expect(serializer.serialize(res1, {
//           fields: {
//             foo: []
//           }
//         }))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": {
//               id: 1,
//               type: 'foo'
//             }
//           })
//         );

//     });

//     it('should be able to serialize linked Resource', function () {

//       var res1 = new Resource({
//         id: 1,
//         type: 'foo',
//         content: 'hello'
//       });

//       var res2 = new Resource({
//         id: 2,
//         type: 'boo',
//         content: 'world'
//       });

//       var res3 = new Resource({
//         id: 3,
//         type: 'bar',
//         content: 'aa'
//       });

//       res1.addLink('barlink', res2);
//       res2.addLink('varlink', res3);

//       expect(serializer.serialize(res1))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": {
//               id: 1,
//               type: 'foo',
//               content: 'hello',
//               links: {
//                 barlink: {
//                   linkage: { type: 'boo', id: 2 }
//                 }
//               }
//             }
//           })
//         );

//       expect(serializer.serialize(res1, {
//           fields: {
//             foo: []
//           }
//         }))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": {
//               id: 1,
//               type: 'foo',
//               links: {
//                 barlink: {
//                   linkage: { type: 'boo', id: 2 }
//                 }
//               }
//             }
//           })
//         );

//       expect(serializer.serialize(res1, {
//           include: ['barlink'],
//           fields: {
//             foo: [],
//             boo: []
//           }
//         }))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": {
//               id: 1,
//               type: 'foo',
//               links: {
//                 barlink: {
//                   linkage: { type: 'boo', id: 2 }
//                 }
//               }
//             },
//             included: [{
//               id: 2,
//               type: 'boo',
//               links: {
//                 varlink: {
//                   linkage: { id: 3, type: 'bar' }
//                 }
//               }
//             }]
//           })
//         );

//       expect(serializer.serialize(res1, {
//           include: ['barlink']
//         }))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": {
//               id: 1,
//               type: 'foo',
//               content: 'hello',
//               links: {
//                 barlink: {
//                   linkage: { type: 'boo', id: 2 }
//                 }
//               }
//             },
//             included: [{
//               id: 2,
//               type: 'boo',
//               content: 'world',
//               links: {
//                 varlink: {
//                   linkage: { id: 3, type: 'bar' }
//                 }
//               }
//             }]
//           })
//         );

//       expect(serializer.serialize(res1, {
//           include: ['barlink', 'barlink.varlink']
//         }))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": {
//               id: 1,
//               type: 'foo',
//               content: 'hello',
//               links: {
//                 barlink: {
//                   linkage: { type: 'boo', id: 2 }
//                 }
//               }
//             },
//             included: [{
//               id: 2,
//               type: 'boo',
//               content: 'world',
//               links: {
//                 varlink: {
//                   linkage: { id: 3, type: 'bar' }
//                 }
//               }
//             }, {
//               id: 3,
//               type: 'bar',
//               content: 'aa'
//             }]
//           })
//         );

//     });

//     it('should be able to serialize ResourceCollection', function () {

//       var res1 = new ResourceCollection([
//         {
//           id: 1,
//           type: 'foo',
//           content: 'hello'
//         }
//       ], { type: 'foo' });

//       expect(serializer.serialize(res1))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": [{
//               id: 1,
//               type: 'foo',
//               content: 'hello'
//             }]
//           })
//         );

//     });

//     it('should be able to serialize linked ResourceCollection', function () {

//       var res = new ResourceCollection([
//         new Resource({
//             id: 1,
//             type: 'foo',
//             content: 'hello'
//           })
//           .addLink('barlink', new Resource({
//             id: 2,
//             type: 'bar',
//             content: 'world'
//           }))
//       ], { type: 'foo' });

//       expect(serializer.serialize(res))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": [{
//               id: 1,
//               type: 'foo',
//               content: 'hello',
//               links: {
//                 barlink: {
//                   linkage: { id: 2, type: 'bar' }
//                 }
//               }
//             }]
//           })
//         );

//       expect(serializer.serialize(res, { include: ['barlink'] }))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": [{
//               id: 1,
//               type: 'foo',
//               content: 'hello',
//               links: {
//                 barlink: {
//                   linkage: { id: 2, type: 'bar' }
//                 }
//               }
//             }],
//             included: [{
//               id: 2,
//               type: 'bar',
//               content: 'world'
//             }]
//           })
//         );

//     });

//     it('should be able to serialize ResourceCollection that contains R.C', function () {

//       var res = new ResourceCollection([
//         new Resource({
//             id: 1,
//             type: 'foo',
//             content: 'hello'
//           })
//           .addLink('barlink',
//             new ResourceCollection([
//               new Resource({
//                 id: 2,
//                 type: 'bar',
//                 content: 'world'
//               })
//             ], { type: 'bar' })
//           )
//       ], { type: 'foo' });

//       expect(serializer.serialize(res, { include: ['barlink'] }))
//         .to.satisfy(
//           _.partialRight(_.isMatch, {
//             "data": [{
//               id: 1,
//               type: 'foo',
//               content: 'hello',
//               links: {
//                 barlink: {
//                   linkage: [{ id: 2, type: 'bar' }]
//                 }
//               }
//             }],
//             included: [{
//               id: 2,
//               type: 'bar',
//               content: 'world'
//             }]
//           })
//         );

//     });

//   });

// });
