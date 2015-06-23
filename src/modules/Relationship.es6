import _ from 'lodash';
import Link from './Link';
import ResourceIdentifier from './ResourceIdentifier';


export default class Relationship {

  constructor(relationship) {
    this.links = {};
    this.data = _.isArray(relationship.data) ? [] : null;
    this.meta = {};
    this.deserialize(relationship);
  }

  serialize() {
    return _.chain({
      links: this.links,
      meta: this.meta
    })
    .omit(_.isEmpty)
    .extend({
      data: this.data
    })
    .value();
  }

  deserialize(relationship) {
    this.links = _.mapValues(relationship.links, link => {
      return new Link(link);
    });
    if (_.isArray(relationship.data)) {
      this.data = _.map(relationship.data, data => new ResourceIdentifier(data));
    }
    else {
      if (_.isNull(relationship.data)) {
        this.data = null;
      }
      else {
        this.data = new ResourceIdentifier(relationship.data);
      }
    }
    this.meta = relationship.meta;
  }

}
