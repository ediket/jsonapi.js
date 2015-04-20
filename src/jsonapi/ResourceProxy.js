import _ from 'lodash';
import Q from 'q';
import { Model } from 'backbone';
import ResourcePool from './ResourcePool';
import { pool } from './singletons';
import uuid from 'node-uuid';


var isValidData = function (data) {
  return data && data.type;
};


class ResourceProxy extends Model {

  constructor(attributes, options) {

    options = options || {};
    _.defaults(options, { parse: true });

    super(attributes, options);
    this.links.uuid = uuid.v4();

  }

  getLinkage () {

    return {
      type: this.get('type'),
      id: this.get('id')
    };

  }

  setLink (key, resource) {

    this.links[key] = resource.links;
    this.trigger('add:link', key, this.links[key]);

  }

  removeLink (key) {

    var removedLink = this.links[key];
    delete this.links[key];
    this.trigger('remove:link', key, removedLink);

  }

  getLink (key) {

    return this.links[key];

  }

  parse (data) {

    if (!isValidData(data)) {
      throw new Error('invalid response!');
    }
    this.links = data.links || {};
    return _.omit(data, 'links');

  }

}


export default ResourceProxy;
