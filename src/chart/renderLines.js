import { curveLinear, line } from 'd3-shape';

const margin = 10;

export function renderLines(config) {
  const {
    svg,
    links,
    nodeWidth,
    nodeHeight,
    borderColor,
    sourceNode,
    treeData,
    animationDuration,
  } = config;

  const parentNode = sourceNode || treeData;

  // Select all the links to render the lines
  const link = svg.selectAll('path.link').data(links, ({ source, target }) => {
    return `${source.data.id}-${target.data.id}`;
  });

  // Define the angled line function
  const angle = line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(curveLinear);

  // Enter any new links at the parent's previous position.
  const linkEnter = link
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', borderColor)
    .attr('stroke-opacity', 1)
    .attr('stroke-width', 1.25)
    .attr('d', d => {
      const linePoints = [
        {
          x: d.source.x + parseInt(nodeWidth / 2, 10),
          y: d.source.y + margin,
        },
        {
          x: d.source.x + parseInt(nodeWidth / 2, 10),
          y: d.source.y + margin,
        },
        {
          x: d.source.x + parseInt(nodeWidth / 2, 10),
          y: d.source.y + margin,
        },
        {
          x: d.source.x + parseInt(nodeWidth / 2, 10),
          y: d.source.y + margin,
        },
      ];

      return angle(linePoints);
    });

  const linkUpdate = linkEnter.merge(link);

  // Transition links to their new position.
  linkUpdate
    .transition()
    .duration(animationDuration)
    .attr('d', d => {
      const linePoints = [
        {
          x: d.source.x + parseInt(nodeWidth / 2, 10),
          y: d.source.y + nodeHeight,
        },
        {
          x: d.source.x + parseInt(nodeWidth / 2, 10),
          y: d.target.y - margin,
        },
        {
          x: d.target.x + parseInt(nodeWidth / 2, 10),
          y: d.target.y - margin,
        },
        {
          x: d.target.x + parseInt(nodeWidth / 2, 10),
          y: d.target.y,
        },
      ];

      return angle(linePoints);
    });

  // Animate the existing links to the parent's new position
  link
    .exit()
    .transition()
    .duration(animationDuration)
    .attr('d', () => {
      const lineNode = config.sourceNode ? config.sourceNode : parentNode;
      const linePoints = [
        {
          x: lineNode.x + parseInt(nodeWidth / 2, 10),
          y: lineNode.y + nodeHeight + 2,
        },
        {
          x: lineNode.x + parseInt(nodeWidth / 2, 10),
          y: lineNode.y + nodeHeight + 2,
        },
        {
          x: lineNode.x + parseInt(nodeWidth / 2, 10),
          y: lineNode.y + nodeHeight + 2,
        },
        {
          x: lineNode.x + parseInt(nodeWidth / 2, 10),
          y: lineNode.y + nodeHeight + 2,
        },
      ];

      return angle(linePoints);
    });
}
