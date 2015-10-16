import BaseQuery from './BaseQuery';


export default class BasePool {
  constuctor() {}

  query(type) {
    if (!type) {
      throw new Error('unenough arguments');
    }

    return new BaseQuery(this, type);
  }

  get(/* type, id = null, options = {} */) {}

  create(/* type, data */) {}

  remove(/* type, id */) {}

  update(/* type, id, data */) {}

  addLinkage(/* relationship, linkage */) {}

  removeLinkage(/* relationship, linkage */) {}

  replaceLinkage(/* relationship, linkage */) {}
}

