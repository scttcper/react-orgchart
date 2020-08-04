export function onClick(config) {
  const { render } = config;

  return datum => {
    // eslint-disable-next-line no-restricted-globals
    if (event.defaultPrevented) {
      return;
    }

    // eslint-disable-next-line no-restricted-globals
    const link = event?.target?.closest('a');
    if (link?.href) {
      return;
    }

    if (!datum.children && !datum._children) {
      return;
    }

    if (datum.children) {
      // Collapse the children
      config.callerNode = datum;
      datum._children = datum.children;
      datum.children = null;
    } else {
      // Expand the children
      config.callerNode = null;
      datum.children = datum._children;
      datum._children = null;
    }

    // Pass in the clicked datum as the sourceNode which
    // tells the child nodes where to animate in from
    render({
      ...config,
      sourceNode: datum,
    });
  };
}
