class Operation {

  constructor (options) {

    this.op = options.op;
    this.path = options.path;
    if (options.op !== 'remove') {
      this.value = options.value;
    }

  }

}

export default Operation;
