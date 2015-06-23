import _ from 'lodash';


export default class ResourceIdentifier {

  constructor(resourceIdentifier) {
    this.deserialize(resourceIdentifier);
  }

  serialize() {
    return _.omit({
      type: this.type,
      id: this.id
    }, _.isUndefined);
  }

  deserialize(resourceIdentifier) {
    if (!(resourceIdentifier && resourceIdentifier.type)) {
      throw new Error('invalid data!');
    }
    this.type = resourceIdentifier.type;
    this.id = resourceIdentifier.id;
  }

}
