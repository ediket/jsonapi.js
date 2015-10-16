import _ from 'lodash';


export default function toParams(params) {
  let result = {};

  if (params.sort) {
    result.sort = params.sort.join(',');
  }

  if (params.include) {
    result.include = params.include.join(',');
  }

  if (params.page) {
    if (params.page.number !== undefined &&
        params.page.size !== undefined) {
      result = _.extend(result, {
        'page[number]': params.page.number,
        'page[size]': params.page.size,
      });
    }
    else if (params.page.offset !== undefined &&
        params.page.limit !== undefined) {
      result = _.extend(result, {
        'page[offset]': params.page.offset,
        'page[limit]': params.page.limit,
      });
    }
  }

  if (params.fields) {
    _.reduce(params.fields, (memo, fields, type) => {
      memo[`fields[${type}]`] = fields.join(',');
      return memo;
    }, result);
  }

  if (params.filter) {
    _.reduce(params.filter, (memo, filter, type) => {
      memo[`filter[${type}]`] = filter.join(',');
      return memo;
    }, result);
  }

  return _.omit(result, _.isUndefined);
}
