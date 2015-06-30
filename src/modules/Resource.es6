import _ from 'lodash';
import Link from './Link';
import Relationship from './Relationship';
import ResourceIdentifier from './ResourceIdentifier';


export default class Resource extends ResourceIdentifier {

  constructor(data) {
    super(data);
    this.deserialize(data);
  }

  getIdentifier() {
    return super.serialize();
  }

  setRelationship(key, resource) {
    if (_.isArray(resource)) {
      this.relationships[key] = new Relationship({
        data: _.map(resource, resource =>
          resource instanceof Resource ?
            resource.getIdentifier() :
            resource
        )
      });
    }
    else {
      this.relationships[key] = new Relationship({
        links: resource.links,
        data: resource instanceof Resource ?
          resource.getIdentifier() :
          resource
      });
    }
  }

  unsetRelationship(key) {
    delete this.relationships[key];
  }

  setRelationships(relationships) {
    _.each(relationships, (relationship, key) => {
      this.setRelationship(key, relationship);
    });
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  unsetAttribute(key) {
    delete this.attributes[key];
  }

  setAttributes(attributes) {
    _.extend(this.attributes, attributes);
  }

  flatten() {
    return _.chain({})
    .extend(this.getIdentifier())
    .extend(this.attributes)
    .extend(_.mapValues(this.relationships, relationship => relationship.serialize()))
    .value();
  }

  serialize() {
    return _.chain({
      attributes: this.attributes,
      links: _.mapValues(this.links, link => link.serialize()),
      relationships: _.mapValues(this.relationships, relationship => relationship.serialize())
    })
    .extend(this.getIdentifier())
    .omit(attribute => _.isObject(attribute) ?
      _.isEmpty(attribute) : _.isUndefined(attribute))
    .value();
  }

  deserialize(data) {
    super.deserialize(data);
    this.attributes = data.attributes;
    this.relationships = _.mapValues(data.relationships,
      relationship => new Relationship(relationship));
    this.links = _.mapValues(data.links,
      link => new Link(link));
  }

}
