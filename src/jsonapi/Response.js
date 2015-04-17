import $ from 'jquery';
import _ from 'lodash';
import Q from 'q';
import Resource from './Resource';
import CollectionResource from './CollectionResource';
import Serializer from './Serializer';


var isResponseError = function (status) {

  return 400 <= status && 600 > status ;

};


var isValid = function (xhr) {
  return xhr.responseJSON &&
    (xhr.responseJSON.data || xhr.responseJSON.errors);
};


var validateResponse = function (xhr) {

  var body = xhr.responseJSON;

  if (!body.data && !body.errors) {
    throw new Error("A document MUST contain either primary data" +
                    "or an array of error objects.");
  }

  if (body.data) {
  }

};


var parseErrors = function (xhr) {

  if (!(xhr.responseJSON && xhr.responseJSON.errors )) {
    if (isResponseError(xhr.status)) {
      return [{
        status: "" + xhr.status
      }];
    }
    return null;
  }

  var errors = xhr.responseJSON.errors;

  return _.map(errors, function (error) {
    return _.extend({
      status: "" + xhr.status
    }, error);
  });

};


var parseHeaders = function (xhr) {

  var result = [];

  var headerRegex = /^(.*?):[ \t]*([^\r\n]*)$/mg;
  var headersString = xhr.getAllResponseHeaders();
  var findResult;

  while ((findResult = headerRegex.exec(headersString)) !== null) {
    result.push(findResult.slice(1));
  }

  return _.object(result);

};


var Response = function (xhr) {

  // validateResponse(xhr);
  this.responseJSON = xhr.responseJSON;
  _.extend(this, xhr.responseJSON);
  this.resource = Serializer(xhr);
  this.data = this.resource ? this.resource.toJSON() : null;
  this.errors = parseErrors(xhr);
  this.headers = parseHeaders(xhr);

  this.nativeXHR = xhr;

};


_.extend(Response.prototype, {

});


export default Response;
