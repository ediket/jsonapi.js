import _ from 'lodash';


export default function (data) {

  return _.partialRight(_.isMatch, data);

};
