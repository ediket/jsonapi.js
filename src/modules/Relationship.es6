import _ from 'lodash';
import Link from './Link';
import ResourceIdentifier from './ResourceIdentifier';


export default class Relationship {

  constructor(relationship) {
    this.deserialize(relationship);
  }

  serialize() {
    return _.chain({
      links: _.mapValues(this.links, link => link.serialize()),
      meta: this.meta
    })
    .omit(_.isEmpty)
    .extend({
      data: _.isArray(this.data) ?
        _.map(this.data, identifier => identifier.serialize()) :
        this.data && this.data.serialize()
    })
    .omit(_.isUndefined)
    .value();
  }

  deserialize(relationship) {
    this.links = _.mapValues(relationship.links, link => {
      return new Link(link);
    });
    if (!_.isUndefined(relationship.data)) {
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
