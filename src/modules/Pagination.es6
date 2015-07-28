import _ from 'lodash';


class CollectionSegment {

  constructor(collection, startIndex, endIndex) {
    this.collection = collection;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.indexList = _.range(this.startIndex, this.endIndex);
    this.segmentSize = this.endIndex - this.startIndex;
  }

  get() {
    return _.sortBy(_.pick(this.collection, this.indexList),
      (val, key) => key);
  }

  set(resources) {
    if (resources.length !== this.segmentSize) {
      throw new Error('unmatched size!');
    }
    _.reduce(resources, (memo, resource, index) => {
      return _.set(memo, this.startIndex + index, resource);
    }, this.collection);
  }

  isFull() {
    return _.values(this.get()).length === this.segmentSize;
  }

  isEmpty() {
    return _.values(this.get()).length === 0;
  }

}


export default class Pagination {

  constructor() {
    this.collection = {};
  }

  all() {
    return _.sortBy(this.collection, (val, key) => key);
  }

  at(index) {
    return this.collection[index];
  }

  page(pageData) {
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

    return new CollectionSegment(
      this.collection,
      startIndex,
      endIndex
    );
  }

}
