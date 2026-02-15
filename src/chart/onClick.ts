import type { ChartConfig, ChartNode } from './types';

export function onClick(config: ChartConfig): (event: Event, datum: ChartNode) => void {
  const { render } = config;

  return (event: Event, datum: ChartNode): void => {
    if (event.defaultPrevented) {
      return;
    }

    const target = event.target;
    const link = target instanceof Element ? target.closest('a') : null;
    if (link instanceof HTMLAnchorElement && link.href) {
      return;
    }

    if (!datum.children && !datum._children) {
      return;
    }

    if (datum.children) {
      // Collapse the children
      config.callerNode = datum;
      datum._children = datum.children;
      datum.children = undefined;
    } else {
      // Expand the children
      config.callerNode = undefined;
      datum.children = datum._children;
      datum._children = undefined;
    }

    // Pass in the clicked datum as the sourceNode which
    // tells the child nodes where to animate in from
    render({
      ...config,
      sourceNode: datum,
    });
  };
}
