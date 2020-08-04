export function onClick(config) {
  const { render } = config;

  return datum => {
    if (event.defaultPrevented) {
      return;
    }

    const link = event?.target?.closest('a');
    if (link?.href) {
      return;
    }
    // event.preventDefault();

    if (datum.children) {
      // Collapse the children
      datum._children = datum.children;
      datum.children = null;
    } else {
      // Expand the children
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
