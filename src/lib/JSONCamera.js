
'use strict';


var _ = require('lodash');
var addUnderscoreCollectionMethods = require('./addUnderscoreCollectionMethods');


var JSONCamera = function (target, transform) {

  this.target = target;
  this.snapshots = [];
  this.transform = transform;

};


_.extend(JSONCamera.prototype, {

  capture: function (options) {

    var object = this.target;
    if (this.transform) {
      object = this.transform(object);
    }

    this.snapshots.push(
      _.clone(_.extend(object, options), true)
    );

  }

});


addUnderscoreCollectionMethods(JSONCamera, 'snapshots');


module.exports = JSONCamera;
