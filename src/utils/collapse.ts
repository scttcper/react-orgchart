import type { ChartNode } from '../chart/types';

export function collapse(d: ChartNode): void {
  // Check if this node has children
  if (d.children) {
    d._children = d.children;
    d.children = undefined;
  }
}
