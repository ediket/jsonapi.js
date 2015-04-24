import _ from 'lodash';
import Q from 'q';
import { Events } from 'backbone';
import Resource from './Resource';
import Pool from './Pool';
import Operation from './Operation';


class MemoryPool extends Pool {

  constructor(resources) {

    super(resources);

  }

  create (attributes, options) {

    options = _.defaults(options || {}, {
      byOperation: false
    });

    return Q.fcall(() => {
      return new Resource(attributes, options);
    })
    .then(resource => {
      return this.add(resource, { create: true });
    })
    .then(resource => {
      if (!options.byOperation) {
        this._triggerTransform('add', resource);
      }
      return resource;
    });

  }

  patch (resource, attributes, options) {

    options = _.defaults(options || {}, {
      byOperation: false
    });

    var setArguments = _.toArray(arguments).slice(1);

    return Q.fcall(() => {
      resource.set.apply(resource, setArguments);
      if (!options.byOperation) {
        this._triggerTransform('replace', resource);
      }
      return resource;
    });

  }

  remove (resource, options) {

    options = _.defaults(options || {}, {
      byOperation: false
    });

    return Q.fcall(() => {
      this.stopListening(resource);
      delete this.pool[resource.getLink('self')];
      if (!options.byOperation) {
        this._triggerTransform('remove', resource);
      }
      return resource;
    });

  }

  get (url) {

    var resource = this.pool[url];

    if (!resource) {
      resource = _.filter(this.pool, (resource, resourceUrl) => {
        return _.startsWith(resourceUrl, url);
      });
      if (_.isEmpty(resource)) {
        resource = undefined;
      }
    }

    return Q.fcall(() => resource);

  }

  getURL (type, id) {

    var url = `/${type}/`;

    if (id) {
      url = url + id;
    }

    return url;

  }

  find (predicate) {

    return Q.fcall(() => {
      return _.find(this.pool, predicate);
    });

  }

}


export default MemoryPool;
