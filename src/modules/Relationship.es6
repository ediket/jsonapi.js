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

  replaceLinkage(linkage) {
    if (_.isArray(linkage)) {
      this.data = _.map(linkage,
        linkage => new ResourceIdentifier(linkage));
    }
    else {
      if (_.isNull(linkage)) {
        this.data = null;
      }
      else {
        this.data = new ResourceIdentifier(linkage);
      }
    }
  }

  addLinkage(linkage) {
    if (!_.isArray(this.data)) {
      throw new Error('relationship should be array');
    }

    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    this.removeLinkage(linkage);
    this.data = this.data.concat(
      _.map(linkage, linkage => new ResourceIdentifier(linkage))
    );
  }

  removeLinkage(linkage) {
    if (!_.isArray(this.data)) {
      throw new Error('relationship should be array');
    }

    if (!_.isArray(linkage)) {
      throw new Error('linkage should be array!');
    }

    _.remove(this.data, identifier => {
      return _.findWhere(linkage, identifier);
    });
  }

  deserialize(relationship) {
    this.links = _.mapValues(relationship.links, link => {
      return new Link(link);
    });
    if (!_.isUndefined(relationship.data)) {
      this.replaceLinkage(relationship.data);
    }
    else {
      this.data = undefined;
    }
    this.meta = relationship.meta;
  }

}
