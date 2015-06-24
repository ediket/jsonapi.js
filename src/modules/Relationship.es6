import _ from 'lodash';
import Link from './Link';
import ResourceIdentifier from './ResourceIdentifier';


export default class Relationship {

  constructor(relationship) {
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
    .omit(_.isUndefined)
    .value();
  }

  deserialize(relationship) {
    this.links = _.mapValues(relationship.links, link => {
      return new Link(link);
    });
    if (!_.isUndefined(this.data)) {
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
    }
    else {
      this.data = undefined;
    }
    this.meta = relationship.meta;
  }

}
