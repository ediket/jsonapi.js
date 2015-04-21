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

    return Q.Promise((resolve, reject, notify) => {

      var resource = new Resource(attributes, options);
      this.add(resource)
        .then(resource => {
          this._triggerTransform('add', resource);
          return resource;
        })
        .then(resolve);

    });

  }

  patch (resource, attributes) {

    var setArguments = _.toArray(arguments).slice(1);

    return Q.Promise((resolve, reject, notify) => {

      resource.set.apply(resource, setArguments);
      this._triggerTransform('replace', resource);
      resolve(resource);

    });

  }

  remove (resource) {

    return Q.Promise((resolve, reject, notify) => {

      this.stopListening(resource);
      this._triggerTransform('remove', resource);
      this.pool.delete(resource.getLink('self'));
      resolve(resource);

    });

  }

  get (url) {

    return Q.promise((resolve, reject, notify) => {

      resolve(this.pool.get(url));

    });

  }

  add (resource) {

    return Q.promise((resolve, reject, notify) => {

      this.pool.set(resource.getLink('self'), resource);
      resolve(resource);

    });

  }

  _triggerTransform (op, resource) {

    this.trigger('transform', new Operation({
      op: op,
      path: resource.getLink('self'),
      value: resource.toJSON()
    }));

  }

}


export default MemoryPool;
