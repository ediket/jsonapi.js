import _ from 'lodash';


let _validateResponse = function (xhr) {

  let body = xhr.responseJSON;

  if (body.data === undefined && body.errors === undefined) {
    throw new Error("A document MUST contain either primary data " +
                    "or an array of error objects.");
  }

};


let _isResponseError = function (status) {

  return 400 <= status && 600 > status ;

};


let _parseData = function (xhr) {

  if (!xhr.responseJSON) {
    return null;
  }
  return xhr.responseJSON.data;

};


let _parseErrors = function (xhr) {

  if (!(xhr.responseJSON && xhr.responseJSON.errors )) {
    if (_isResponseError(xhr.status)) {
      return [{
        status: "" + xhr.status
      }];
    }
    return null;
  }

  let errors = xhr.responseJSON.errors;

  return _.map(errors, function (error) {
    return _.extend({
      status: "" + xhr.status
    }, error);
  });

};


let _parseHeaders = function (xhr) {

  let result = [];

  let headerRegex = /^(.*?):[ \t]*([^\r\n]*)$/mg;
  let headersString = xhr.getAllResponseHeaders();
  let findResult;

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
