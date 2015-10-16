import _ from 'lodash';
import querystring from 'querystring';
import parsePage from '../utils/parsePage';
import toParams from '../utils/toParams';


const NO_CONTEXT = '*';


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
      let context = querystring.stringify(toParams(
        _.omit({
          filter: this._filter,
          sort: this._sort
        }, _.isEmpty)
      )) || NO_CONTEXT;

      if (this._page) {
        query = query.filter(resource => {
          if (!resource.meta.context) {
            return false;
          }
          let { startIndex, endIndex } = parsePage(this._page);
          let index = resource.meta.context[context];
          if (!_.isNumber(index)) {
            return false;
          }
          return startIndex <= index && endIndex > index;
        });
      }
      else {
        query = query.filter(resource => {
          return _.has(resource.meta.context, context) || context === NO_CONTEXT;
        });
      }

      if (this._sort) {
        _.each(this._sort, sort => {
          let key = sort;
          let reverse = sort.charAt(0) === '-';
          if (reverse) {
            key = sort.substring(1);
          }
          query = query.sortBy(resource => {
            if (_.has(resource, key)) {
              return resource[key];
            }
            if (_.has(resource.attributes, key)) {
              return resource.attributes[key];
            }
          });
          if (reverse) {
            query = query.reverse();
          }
        });
      }
    }
    return query.value();
  }

  fetch(options={}) {
    if (this._id) {
      return this.pool.fetch(this._type, this._id, options);
    }

    let page;
    if (this._page) {
      let { startIndex, endIndex } = parsePage(this._page);
      page = {
        offset: startIndex,
        limit: endIndex - startIndex
      };
    }

    let params = _.omit({
      filter: this._filter,
      sort: this._sort,
      fields: options.fields,
      include: options.include,
      page
    }, _.isEmpty);

    let context = querystring.stringify(toParams(
      _.pick(params, 'filter', 'sort')
    )) || NO_CONTEXT;

    return this.pool.fetch(this._type, null, params)
    .then((resources) => {
      if (this._page) {
        let { startIndex } = parsePage(this._page);

        _.each(resources, (resource, index) => {
          if (!resource.meta.context) {
            resource.meta.context = {};
          }
          resource.meta.context[context] = startIndex + index;
        });
      }
      else {
        _.each(resources, (resource) => {
          if (!resource.meta.context) {
            resource.meta.context = {};
          }
          resource.meta.context[context] = true;
        });
      }
      return resources;
    });
  }

}
