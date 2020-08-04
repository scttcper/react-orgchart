export function collapse(node) {
  // Check if this node has children
  if (node.children) {
    node._children = node.children;
    node._children.forEach(collapse);
    node.children = null;
  }
}
