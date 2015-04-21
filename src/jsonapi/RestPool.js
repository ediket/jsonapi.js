import $ from 'jquery';
import _ from 'lodash';
import Q from 'q';
import { Events } from 'backbone';
import Resource from './Resource';
import Pool from './Pool';
import Operation from './Operation';
import RESTful from './RESTful';


class RestPool extends Pool {

  constructor (resources, options) {

    super(resources, options);
    this.syncronizer = {};  // FIXME: implement this
    this.typeToUrl = options.typeToUrl || {};

  }

  create (attributes, options) {

    return Q.Promise((resolve, reject, notify) => {

      var resource = new Resource(attributes, options);

      this.syncronizer.post(
            this._getURL(attributes.type),
            resource.toJSONResponse())
        .then(response => {
          return this.add(resource)
        })
        .then(resource => {
          this._triggerTransform('add', resource);
          return resource;
        })
        .then(resolve);

    });

  }

  add (resource) {


  }

  remove (resource) {

    // implement this

  }

  get (url) {

    return Q.promise((resolve, reject, notify) => {

      resolve(this.pool.get(url));

    });

  }

  _getURL (type) {

    var url = this.typeToUrl[type];
    if (!url) {
      throw new Error(`type[${type}] is not supported!`);
    }
    return url;

  }

  // fetch (type, id) {

  //   var url = this.host + type + "/" + id || "";

  //   return Q.promise((resolve, reject, notify) => {

  //     // RESTful.get(url)
  //     //   .then((resource) => {

  //     //     resolve(this.add(resource));

  //     //   })
  //     //   .catch(function () {
  //     //     console.log("???");
  //     //   });

  //     // console.log($.ajax);
  //     // $.ajax({
  //     //   url: "/foo/1"
  //     // })
  //     // .done(function() {
  //     //   console.log( "success" );
  //     // })
  //     // .fail(function() {
  //     //   console.log( "error" );
  //     // })
  //     // .always(function() {
  //     //   console.log( "complete" );
  //     // });

  //   });

  // }

}


export default RestPool;
