import _ from 'lodash';
import { Event, Model } from 'backbone';
import uuid from 'node-uuid';


class Resource {

  constructor(attributes) {

    this.attributes = {};
    this.links = {};
    this.uuid = uuid.v4();

    this.deserialize(attributes);

  }

  get (key) {

    return this.attributes[key];

  }

  set (attributes) {

    _.extend(this.attributes, attributes);

  }

  unset (key) {

    delete this.attributes[key];

  }

  getLink (key) {

    key = key || 'self';
    return this.links[key];

  }

  setLink (links) {

    _.extend(this.links, links);

  }

  unsetLink (key) {

    delete this.links[key];

  }

  getLinkage () {

    return {
      type: this.attributes.type,
      id: this.attributes.id
    }

  }

  serialize () {

    let result = this.attributes;
    result.links = this.links;

    if (_.isEmpty(result.links)) {
      delete result.links;
    }

    return _.clone(result, true);

  }

  deserialize (serialized) {

    if (!this._validateSerialized(serialized)) {
      throw new Error('invalid data! type should be provided');
    }

    this.set(_.clone(_.omit(serialized, 'links'), true));
    this.setLink(serialized.links);

  }

  clone () {

    let resource = new Resource(this.serialize());
    resource.uuid = this.uuid;
    return resource;

  }

  _validateSerialized (serialized) {

    return serialized && serialized.type;

  }

}


_.extend(Resource.prototype, Event);


export default Resource;
