import _ from 'lodash';
// import { Resource, Pagination } from './';
//
//
// let pagination = new Pagination();
// pagination.page({ size: 2, number: 1 }).set([
//   new Resource({
//     type: 'draft',
//     id: 1,
//     attributes: {}
//   }),
//   new Resource({
//     type: 'draft',
//     id: 2,
//     attributes: {}
//   })
// ]);
//
// pagination.page({ size: 2, number: 2 }).set([
//   new Resource({
//     type: 'draft',
//     id: 3,
//     attributes: {}
//   }),
//   new Resource({
//     type: 'draft',
//     id: 4,
//     attributes: {}
//   })
// ]);
//
// console.log(
//   pagination.all()
// );
// console.log(
//   pagination.page({ offset: 0, limit: 10 }).get()
// );
// console.log(
//   pagination.page({ offset: 0, limit: 4 }).isFull()
// );
// console.log(
//   pagination.page({ offset: 3, limit: 4 }).isEmpty()
// );

console.log(
  _.chain({ 'a': 1, 2: 2, 3: 3})
    .pick(['a', 2, 3])
    .sortBy()
    .value()
);
