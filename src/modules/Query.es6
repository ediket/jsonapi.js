import _ from 'lodash';
import querystring from 'querystring';
import parsePage from 'utils/parsePage';


export default class Query {

  constructor(pool, type) {
    this.pool = pool;
    this.resources = pool.get(type);
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

  get() {
    let query = _.chain(this.resources);

    if (this._id) {
      query = query.find(resource => {
        return this._id === resource.getIdentifier().id;
      });
    }
    else {
      let context = querystring.stringify(
        _.omit({
          filter: this._filter,
          sort: this._sort
        }, _.isEmpty)
      ) || null;

      if (this._page) {
        query = query.filter(resource => {
          let { startIndex, endIndex } = parsePage(this._page);
          let index = resource.meta.context[context];
          return startIndex <= index && endIndex > index;
        });
      }
      else {
        query = query.filter(resource => {
          return _.has(resource.meta.context, context);
        });
      }

      if (this._sort) {
        query = query.sortBy(resource => {
          return resource.meta.context[context];
        });
      }
    }
    return query.value();
  }

  fetch(fields) {
    if (this._id) {
      return this.pool.fetch(this._type, this._id, { fields });
    }

    let params = _.omit({
      filter: this._filter,
      sort: this._sort,
      page: this._page,
      fields: fields
    }, _.isEmpty);

    let context = querystring.stringify(_.pick(params, 'filter', 'sort')) || null;

    return this.pool.fetch(this._type, null, params)
    .then((resources) => {
      if (this._page) {
        _.each(resources, (resource, index) => {
          if (!resource.meta.context) {
            resource.meta.context = {};
          }

          let { startIndex } = parsePage(this._page);
          resource.meta.context[context] = startIndex + index;
        });
      }
      return resources;
    });
  }

}
