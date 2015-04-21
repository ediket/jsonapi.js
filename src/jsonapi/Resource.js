import _ from 'lodash';
import { Model } from 'backbone';
import uuid from 'node-uuid';


var isValidAttrs = function (data) {
  return data && data.type;
};


class Resource extends Model {

  constructor(attributes, options) {

    options = options || {};
    _.defaults(options, { parse: true });

    super(attributes, options);

    if (!this.getLink('self')) {
      this.setLink('self', '/' + uuid.v4());
    }

  }

  setLink (key, resource) {

    var url = _.isString(resource) ? resource : resource.getLink('self');
    this.links[key] = url;
    this.trigger('add:link', key, this.links[key]);

  }

  removeLink (key) {

    if (key === 'self') {
      throw new Error('self link is not able to removed!');
    }
    var removedLink = this.links[key];
    delete this.links[key];
    this.trigger('remove:link', key, removedLink);

  }

  getLink (key) {

    return this.links[key];

  }

  parse (data) {

    if (!isValidAttrs(data)) {
      throw new Error('invalid data! type should be provided');
    }
    this.links = data.links || {};
    return _.omit(data, 'links');

  }

}


export default Resource;
