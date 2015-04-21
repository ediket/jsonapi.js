import _ from 'lodash';
import Q from 'q';
import { Events } from 'backbone';
import Resource from './Resource';
import Pool from './Pool';
import Operation from './Operation';

class PoolConnector {

  constructor(source, target, options) {

    _.extend(this, Events);

    this.source = source;
    this.target = target;
    this.sourceToTarget = {};

    this.listenTo(this.source, "transform", this.onTrasnform);
    // this.stopListening(source, "transform");

  }

  onTrasnform (operation) {

    var op = operation.op;
    var value = operation.value;
    var path = operation.path;

    var tartgetResource = this.sourceToTarget[path];
    console.log(operation);

    if (op === "add") {

      this.target.create(value)
        .then(resource => {
          this.sourceToTarget[path] = resource.getLink('self')
        })

    } else if (op === "replace") {

      this.target.patch(tartgetResource, value);

    } else if (op === "remove") {

      this.target.remove(tartgetResource);

    }

  }

}


export default PoolConnector;
