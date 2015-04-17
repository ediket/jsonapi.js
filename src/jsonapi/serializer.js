import _ from 'lodash';
import Resource from './Resource';
import ResourceCollection from './ResourceCollection';


var filterReduceFields = function (fields, referKey) {

  return _.chain(fields)
    .map(function (field) {
      return field.split('.');
    })
    .filter(function (props) {
      return props[0] === referKey;
    })
    .map(function (props) {
      return props.slice(1).join('.');
    })
    .compact()
    .value();

};


export default {

  serialize: function serialize(resource, options) {

    if (!resource instanceof Resource ||
        !resource instanceof ResourceCollection) {
      throw new TypeError('unsupported type!');
    }

    var result = {
      data: null
    };

    if (resource instanceof ResourceCollection) {

      result = resource.chain()
        .map(function (resource) {
          return serialize(resource, options);
        })
        .reduce(function (result, serializedResource) {
          result.data.push(serializedResource.data);
          result.included = result.included.concat(
            serializedResource.included || []);
          return result;
        }, {
          data: [],
          included: []
        })
        .value();

    }
    else {

      options = _.defaults(options || {}, {
        include: [],
        fields: {}
      });

      if (!options.fields[resource.type]) {
        options.fields[resource.type] = _.keys(resource.attributes);
      }

      result.data = _.pick(resource.toJSON(),
        options.fields[resource.type], 'type', 'id');

      result.data.links = _.mapValues(resource.getLinks(), function (resource) {
        return {
          linkage: resource.toLinkage()
        };
      });

      result.included = _.chain(resource.getLinks())
        .omit(function (resource, key) {
          return !_.contains(options.include, key);
        })
        .map(function (resource, referKey) {
          return serialize(resource, _.extend({}, options, {
            include: filterReduceFields(options.include, referKey)
          }));
        })
        .reduce(function (included, serializedResource) {
          return included.concat(
            included,
            serializedResource.data,
            serializedResource.included);
        }, [])
        .value();

    }

    return result;

  },

  deserialize: function (JSONResponse) {

    if (!(JSONResponse && JSONResponse.data)) {
      return null;
    }

    var included = _.reduce(JSONResponse.included, function (memo, obj) {
      if (!memo[obj.type]) {
        memo[obj.type] = {};
      }
      memo[obj.type][obj.id] = obj;
      return memo;
    }, {});

    var collectResource = function (JSONResponse) {

      if (_.isArray(JSONResponse)) {
        return new ResourceCollection(
          _.map(JSONResponse, function (data) {
            return collectResource(data);
          })
        );
      }

      var result = new Resource(
        _.omit(JSONResponse, 'links')
      );

      if (JSONResponse.links) {
        _.chain(JSONResponse.links)
          .omit(function (link) {
            return !link.linkage;
          })
          .mapValues(function (link) {

            if (_.isArray(link.linkage)) {
              return collectResource(
                _.map(link.linkage, function (linkage) {
                  return included[linkage.type][linkage.id];
                })
              );
            } else {
              return collectResource(
                included[link.linkage.type][link.linkage.id]
              );
            }

          })
          .each(function (resource, resourceKey) {
            result.addLink(resourceKey, resource);
          });
      }

      return result;

    };

    return collectResource(JSONResponse.data);

  }

};
