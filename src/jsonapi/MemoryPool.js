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

    return Q.fcall(() => {
      return new Resource(attributes, options);
    })
    .then(resource => {
      return this.add(resource);
    })
    .then(resource => {
      this._triggerTransform('add', resource);
      return resource;
    });

  }

  patch (resource, attributes) {

    var setArguments = _.toArray(arguments).slice(1);

    return Q.fcall(() => {
      resource.set.apply(resource, setArguments);
      this._triggerTransform('replace', resource);
      return resource;
    });

  }

  remove (resource) {

    return Q.fcall(() => {
      this.stopListening(resource);
      this._triggerTransform('remove', resource);
      this.pool.delete(resource.getLink('self'));
      return resource;
    });

  }

  get (url) {

    return Q.fcall(() => {
      return this.pool.get(url);
    });

  }

  add (resource) {

    return Q.fcall(() => {
      this.pool.set(resource.getLink('self'), resource);
      return resource;
    });

  }

}


export default MemoryPool;
