import $ from 'jquery';
import _ from 'lodash';
import Q from 'q';
import { Events } from 'backbone';
import Resource from './Resource';
import Pool from './Pool';
import Operation from './Operation';
import RESTful from './RESTful';


class RestPool extends Pool {

  constructor (resources, options) {

    super(resources, options);
    this.syncronizer = {};  // FIXME: implement this
    this.typeToUrl = options.typeToUrl || {};

  }

  create (attributes, options) {

    return Q.fcall(() => {
      return this.syncronizer.post(this._getURL(attributes.type),
        {
          data: attributes
        });
    })
    .then(response => {
      return new Resource(response.data, options);
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
      return resource;
    })
    .then(resource => {
      return this.syncronizer.patch(
        resource.getLink('self'),
        this._toResponse(resource))
    })
    .then(response => {
      resource.set.apply(resource, response.data);
      return resource;
    })
    .then(() => {
      this._triggerTransform('replace', resource);
      return resource;
    });

  }

  remove (resource) {

    return Q.fcall(() => {
      return this.syncronizer.delete(
        resource.getLink('self'));
    })
    .then(response => {
      this.stopListening(resource);
      this._triggerTransform('remove', resource);
      this.pool.delete(resource.getLink('self'));
      return resource;
    });

  }

  add (resource) {

    this.pool.set(resource.getLink('self'), resource);

    return Q.fcall(() => resource);

  }

  get (url) {

    var resource = this.pool.get(url);

    return Q.fcall(() => {
      return this.syncronizer.get(url);
    })
    .then(response => {
      if (resource) {
        resource.set(response.data, { parse: true })
      }
      else {
        resource = new Resource(response.data)
      }
      return resource;
    });

  }

  _getURL (type, id) {

    var url = this.typeToUrl[type];

    if (!url) {
      throw new Error(`type[${type}] is not supported!`);
    }

    if (id) {
      url = url + id;
    }

    return url;

  }

  _toResponse (resource) {

    var result = {};
    result.data = resource.toJSON();
    result.data.links = resource.links;
    return _.clone(result, true);

  }

}


export default RestPool;