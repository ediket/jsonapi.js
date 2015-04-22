import _ from 'lodash';


var _validateResponse = function (xhr) {

  var body = xhr.responseJSON;

  if (body.data === undefined && body.errors === undefined) {
    throw new Error("A document MUST contain either primary data " +
                    "or an array of error objects.");
  }

};


var _isResponseError = function (status) {

  return 400 <= status && 600 > status ;

};


var _parseData = function (xhr) {

  if (!xhr.responseJSON) {
    return null;
  }
  return xhr.responseJSON.data;

};


var _parseErrors = function (xhr) {

  if (!(xhr.responseJSON && xhr.responseJSON.errors )) {
    if (_isResponseError(xhr.status)) {
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


var _parseHeaders = function (xhr) {

  var result = [];

  var headerRegex = /^(.*?):[ \t]*([^\r\n]*)$/mg;
  var headersString = xhr.getAllResponseHeaders();
  var findResult;

  while ((findResult = headerRegex.exec(headersString)) !== null) {
    result.push(findResult.slice(1));
  }

  return _.object(result);

};


class Response {

  constructor (xhr) {

    this.responseJSON = xhr.responseJSON;
    this.data = _parseData(xhr);
    this.errors = _parseErrors(xhr);
    this.headers = _parseHeaders(xhr);
    this.nativeXHR = xhr;

  }

}

export default Response;
