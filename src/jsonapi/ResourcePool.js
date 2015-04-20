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

  add (resource) {

    var { type, id, url } = resource;
    this.pool.set(url, resource);

  }

  get (url) {

    return Q.when(
      this._getFromMemory(url) || this._getFromServer(url)
    );

  }

  _getFromMemory (url) {

    return this.pool.get(url);

  }

  _getFromServer (url) {

    return Q.when(this.syncronizer.get(url), function (res) {
      return this.create(res);
    }.bind(this));

  }

  _fetch (url) {

    return Q.when(this.syncronizer.get(url), function (res) {
      var resource = this.pool.get(url);
      if (!resource) {
        resource = this.create(res);
      }
      else {
        resource.replaceFromResponse(res);
      }
      return resource;
    }.bind(this));

  }

}


export default ResourcePool;
