let _ = require('lodash');


class Operation {

  constructor (op, resource) {

    this.op = op;
    this.path = resource.getLink('self');
    if (op !== 'remove') {
      this.value = resource.deserialize();
      this.value = _.omit(this.value, 'id');
      this.value = _.omit(this.value, 'links');
    }
    if (op === 'add') {
    }

  }

}

export default Operation;
