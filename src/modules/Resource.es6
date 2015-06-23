import _ from 'lodash';
import Link from './Link';
import Relationship from './Relationship';
import ResourceIdentifier from './ResourceIdentifier';


export default class Resource extends ResourceIdentifier {

  constructor(data) {
    super(data);
    this.attributes = {};
    this.relationships = {};
    this.links = {};
    this.deserialize(data);
  }

  getIdentifier() {
    return super.serialize();
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
