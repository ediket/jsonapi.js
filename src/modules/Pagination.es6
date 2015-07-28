import _ from 'lodash';


function obj2arr(obj) {
  return _.sortBy(obj, (val, key) => key);
}


function parsePage(pageData) {
  let startIndex = null;
  let endIndex = null;

  if (pageData.size !== undefined &&
      pageData.number !== undefined) {
    startIndex = pageData.size * (pageData.number - 1);
    endIndex = startIndex + pageData.size;
  }
  else if (pageData.start !== undefined &&
      pageData.end !== undefined) {
    startIndex = pageData.start;
    endIndex = pageData.end;
  }
  else if (pageData.offset !== undefined &&
      pageData.limit !== undefined) {
    startIndex = pageData.offset;
    endIndex = pageData.offset + pageData.limit;
  }

  if (startIndex === null || endIndex === null) {
    throw new Error('invalid pagination data!');
  }

  return { startIndex, endIndex };
}


export default class Pagination {

  constructor() {
    this.collection = {};
  }

  all() {
    return obj2arr(this.collection);
  }

  at(index) {
    return this.collection[index];
  }

  page(pageData) {
    let { startIndex, endIndex } = parsePage(pageData);

    return obj2arr(
      _.pick(this.collection, _.range(startIndex, endIndex))
    );
  }

  setPage(pageData, resources) {
    let { startIndex, endIndex } = parsePage(pageData);
    let segmentSize = endIndex - startIndex;

    if (resources.length !== segmentSize) {
      throw new Error('unmatched size!');
    }
    
    _.reduce(resources, (memo, resource, index) => {
      return _.set(memo, startIndex + index, resource);
    }, this.collection);
  }

}
