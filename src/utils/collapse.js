export function collapse(d) {
  // Check if this node has children
  if (d.children) {
    d._children = d.children;
    d.children = null;
  }
}
