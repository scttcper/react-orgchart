export const getName = data => data.data.entity && data.data.entity.name;

export const getTitle = data => data.data.entity && data.data.entity.title;

export const getCount = data => {
  let children = (data.children || []).length || (data._children || []).length;
  if (!children) {
    return '';
  }

  return `Team (${children})`;
};

export const getCursorForNode = data =>
  data.data.children || data.data._children ? 'pointer' : 'default';

export const customOnClick = (fn, onClick, config) => data => {
  if (typeof fn === 'function') {
    // eslint-disable-next-line no-restricted-globals
    if (fn(data, event)) {
      onClick(config);
    } else {
      // eslint-disable-next-line no-restricted-globals
      event.stopPropagation();
    }
  }
};
