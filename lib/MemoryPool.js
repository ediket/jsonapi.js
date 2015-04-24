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

    return Q.fcall(() => {
      return this.pool[url];
    });

  }

  getURL (type, id) {

    var resource = _.find(this.pool, function (resource) {
      var json = resource.toJSON();
      return json.type === type && json.id === id;
    });

    return resource ? resource.getLink('self') : undefined;

  }

  find (predicate) {

    return Q.fcall(() => {
      return _.find(this.pool, predicate);
    });

  }

}


export default MemoryPool;
