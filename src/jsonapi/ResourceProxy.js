import _ from 'lodash';
import Q from 'q';
import ResourcePool from './ResourcePool';
import { pool } from './singletons';


var isValidResponse = function (res) {
  return res && res.data && (res.links || res.data.links);
};


class ResourceProxy {

  constructor(options) {

    this.replaceFromResponse(options);
    this.url = this.links.self;

    this.options = _.omit(options, 'data', 'links', 'url');

  }

  getData () {

    return this.data;

  }

  setLink (key, resource) {

    this.links[key] = {
      related: resource.url
    };

  }

  getLink (key) {

    return this.links[key];

  }

  getRelatedURL (key) {

    return this.getLink(key).related;

  }

  replaceFromResponse (options) {

    _.extend(this, this.parseResponse(options));

  }

  parseResponse (res) {

    if (!isValidResponse(res)) {
      throw new Error('invalid response!');
    }

    return {
      data: _.omit(res.data, 'links'),
      links: res.links || res.data.links
    }

  }

}


export default ResourceProxy;
