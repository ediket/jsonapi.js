import _ from 'lodash';
import Q from 'q';
import ResourceProxy from './ResourceProxy';


class ResourcePool {

  constructor(resources) {

    this.pool = new Map();
    this.syncronizer = {};
    _.each(resources, this.add, this);

  }

  create (res) {

    var resource = new ResourceProxy(res)
    this.add(resource);
    return resource;

  }

  fetch (url) {

    return Q.when(this.syncronizer.get(url), function (res) {
      var resource = this.pool.get(url);
      if (!resource) {
        resource = new ResourceProxy(res);
        this.add(resource);
      }
      else {
        resource.replaceFromResponse(res);
      }
      return resource;
    }.bind(this));

  }

  add (resource) {

    var { type, id } = resource;
    this.pool.set(resource.url, resource);

  }

  get (url) {

    return Q.when(this.pool.get(url) || this.fetch(url), function (res) {
      return res;
    }.bind(this));

  }

}


export default ResourcePool;
