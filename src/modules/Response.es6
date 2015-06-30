import _ from 'lodash';


function _isResponseError(status) {
  return status => 400 && status < 600;
}

function _parseData(xhr) {
  if (!xhr.responseJSON) {
    return null;
  }
  return xhr.responseJSON.data;
}

function _parseIncluded(xhr) {
  if (!xhr.responseJSON) {
    return null;
  }
  return xhr.responseJSON.included;
}

function _parseErrors(xhr) {
  if (!(xhr.responseJSON && xhr.responseJSON.errors )) {
    if (_isResponseError(xhr.status)) {
      return [{
        status: '' + xhr.status
      }];
    }
    return null;
  }

  let errors = xhr.responseJSON.errors;

  return _.map(errors, function(error) {
    return _.extend({
      status: '' + xhr.status
    }, error);
  });
}

function _parseHeaders(xhr) {
  let result = [];

  let headerRegex = /^(.*?):[ \t]*([^\r\n]*)$/mg;
  let headersString = xhr.getAllResponseHeaders();
  let findResult;

  while ((findResult = headerRegex.exec(headersString)) !== null) {
    result.push(findResult.slice(1));
  }

  return _.object(result);
}


export default class Response {

  constructor(xhr) {
    this.responseJSON = xhr.responseJSON;
    this.data = _parseData(xhr);
    this.included = _parseIncluded(xhr);
    this.errors = _parseErrors(xhr);
    this.headers = _parseHeaders(xhr);
    this.satus = xhr.status;
    this.nativeXHR = xhr;
  }

}
