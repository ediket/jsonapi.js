import _ from 'lodash';


class ResourcePool {

  constructor(resources) {

    this.pool = {};
    _.each(resources, this.add, this);

  }

  add (resource) {

    this.pool[resource.url] = resource;

  }

  get (url) {

    return this.pool[url];

  }

}


export default ResourcePool;
