import _ from 'lodash';
import parsePage from '../utils/parsePage';


export default class BaseQuery {

  constructor(engine, type) {
    this.engine = engine;
    this._type = type;
    this._sort = null;
    this._filter = null;
    this._page = null;
    this._id = null;
  }

  sort(_sort) {
    this._sort = _sort;
    return this;
  }

  filter(_filter) {
    this._filter = _filter;
    return this;
  }

  page(_page) {
    this._page = _page;
    return this;
  }

  id(_id) {
    this._id = _id;
    return this;
  }

  get(options = {}) {
    if (this._id) {
      return this.engine.get(this._type, this._id, options);
    }

    let page;
    if (this._page) {
      const { startIndex, endIndex } = parsePage(this._page);
      page = {
        offset: startIndex,
        limit: endIndex - startIndex,
      };
    }

    const params = _.omit({
      filter: this._filter,
      sort: this._sort,
      fields: options.fields,
      include: options.include,
      page,
    }, _.isEmpty);

    return this.engine.get(this._type, null, params);
  }

}
