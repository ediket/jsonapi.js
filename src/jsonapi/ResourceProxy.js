import _ from 'lodash';
import Q from 'q';
import ResourcePool from './ResourcePool';
import { pool } from './singletons';
import uuid from 'node-uuid';


var isValidData = function (data) {
  return data && data.type && data.links;
};


class ResourceProxy {

  constructor(options) {

    this.setFromData(options);
    this.url = this.links.self;
    this.links.uuid = uuid.v4();

    this.options = _.omit(options, 'data', 'links', 'url');

  }

  getLinkage () {

    return {
      type: this.data.type,
      id: this.data.id
    };

  }

  getData () {

    return this.data;

  }

  setLink (key, resource) {

    this.links[key] = resource.links;

  }

  getLink (key) {

    return this.links[key];

  }

  setFromData (options) {

    _.extend(this, this.parseData(options));

  }

  parseData (data) {

    if (!isValidData(data)) {
      throw new Error('invalid response!');
    }

    return {
      data: _.omit(data, 'links'),
      links: data.links
    }

  }

}


export default ResourceProxy;
