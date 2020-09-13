export function onClick(config) {
  const { render } = config;

  return (event, datum) => {
    if (event.defaultPrevented) {
      return;
    }

    const link = event && event.target && event.target.closest('a');
    if (link && link.href) {
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
