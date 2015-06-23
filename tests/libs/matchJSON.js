import _ from 'lodash';


export default function matchJSON(data) {
  return _.partialRight(_.isMatch, data);
}
