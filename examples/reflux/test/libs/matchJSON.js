var _ = require('lodash');


module.exports = function (data) {

  return _.partialRight(_.isMatch, data);

};
