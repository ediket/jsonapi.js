class Operation {

  constructor (op, resource) {

    this.op = op;
    this.path = `/api/${resource.get('type')}/${resource.getUUID()}`;
    if (op !== 'remove') {
      this.value = resource.toJSON();
    }

  }

}

export default Operation;
