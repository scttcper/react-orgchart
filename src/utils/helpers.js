let _ = require('lodash');

let getName = data => _.get(data, 'entity.name');

let getTitle = data => _.get(data, 'entity.title');

let getSubTitle = data => _.get(data, 'entity.subTitle');

let getCount = data => {
  let reports = data.children?.length ?? data._children?.length;
  if (!reports) {
    return '';
  }

  // return `${count} Reports`;
  console.log(data);
  return data._children === null ? 'Collapse' : 'Expand';
};

let getCursorForNode = data =>
  data.children || data._children || data.hasChild ?
    'pointer' :
    'default';

let customOnClick = (fn, onClick, config) => data => {
  if (_.isFunction(fn)) {
    if (fn(data, d3.event)) {
      onClick(config);
    } else {
      d3.event.stopPropagation();
    }
  }
};

module.exports = {
  getName,
  getTitle,
  getSubTitle,
  getCount,
  getCursorForNode,
  customOnClick,
};
