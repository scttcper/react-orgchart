export function collapse(d) {
  // Check if this node has children
  console.log('coll', d);
  if (d.children) {
    d._children = d.children;
    d.children = null;
  }
}
