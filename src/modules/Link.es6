import _ from 'lodash';


export default class Link {

  constructor(link) {
    this.deserialize(link);
  }

  serialize() {
    return _.omit({
      href: this.href,
      meta: this.meta
    }, _.isEmpty);
  }

  deserialize(link) {
    if (_.isString(link)) {
      this.href = link;
      this.meta = {};
    }
    else {
      this.href = link.href;
      this.meta = link.meta;
    }
  }

}
