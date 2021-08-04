import * as helpers from '../utils/index';

import { iconLink } from './components/iconLink';
import { onClick } from './onClick';
import { renderLines } from './renderLines';

const CHART_NODE_CLASS = 'org-chart-node';
const ENTITY_LINK_CLASS = 'org-chart-entity-link';
const ENTITY_NAME_CLASS = 'org-chart-entity-name';
const ENTITY_TITLE_CLASS = 'org-chart-entity-title';
const COUNTS_CLASS = 'org-chart-counts';

export function render(config) {
  const {
    svg,
    tree,
    animationDuration,
    nodeWidth,
    nodeHeight,
    nodePaddingY,
    nodeBorderRadius,
    backgroundColor,
    nameColor,
    titleColor,
    reportsColor,
    borderColor,
    avatarWidth,
    lineDepthY,
    sourceNode,
    onEntityLinkClick,
    nameFontSize = 14,
    titleFontSize = 13,
    titleYTopDistance = 25,
    countFontSize = 14,
    countYTopDistance = 72,
    maxNameWordLength = 16,
    maxTitleWordLength = 17,
    maxCountWordLength = 17,
    getName,
    getTitle,
    getCount,
    onNameClick,
    onCountClick,
    treeMap,
  } = config;

  // Compute the new tree layout.
  const data = treeMap(tree);
  const nodes = data.descendants();
  const links = data.links();

  // Collapse all of the children on initial load
  // nodes.forEach(collapse);

  config.links = links;
  config.nodes = nodes;

  // Normalize for fixed-depth.
  nodes.forEach(function (d) {
    d.y = d.depth * lineDepthY;
  });

  // Update the nodes
  const node = svg.selectAll('g.' + CHART_NODE_CLASS).data(nodes, n => n.data.id);
  const parentNode = sourceNode || nodes[0];

  // Enter any new nodes at the parent's previous position.
  const nodeEnter = node
    .enter()
    .append('g')
    .attr('class', CHART_NODE_CLASS)
    .attr('transform', () => {
      return `translate(${parentNode.x0 || parentNode.x}, ${parentNode.y0 || parentNode.y})`;
    })
    .on('click', onClick(config));

  // Entity Card Shadow
  nodeEnter
    .append('rect')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)
    .attr('rx', nodeBorderRadius)
    .attr('ry', nodeBorderRadius)
    .attr('fill-opacity', 0.05)
    .attr('stroke-opacity', 0.025)
    .attr('filter', 'url(#boxShadow)');

  // Entity Card Container
  nodeEnter
    .append('rect')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('id', d => d.data.id)
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)
    .attr('rx', nodeBorderRadius)
    .attr('ry', nodeBorderRadius)
    .style('cursor', helpers.getCursorForNode);

  const namePos = {
    x: nodeWidth / 2,
    y: nodePaddingY * 1.8 + avatarWidth,
  };

  const avatarPos = {
    x: nodeWidth / 2 - avatarWidth / 2,
    y: nodePaddingY / 2,
  };

  // Entity's Name
  nodeEnter
    .append('text')
    .attr('class', `${ENTITY_NAME_CLASS} unedited`)
    .attr('x', namePos.x)
    .attr('y', namePos.y)
    .attr('dy', '.3em')
    .style('cursor', 'pointer')
    .style('fill', nameColor)
    .style('font-size', nameFontSize)
    .text(d => (typeof getName === 'function' ? getName(d) : helpers.getName(d)))
    .on('click', helpers.customOnClick(onNameClick, onClick, config));

  // Title
  nodeEnter
    .append('text')
    .attr('class', `${ENTITY_TITLE_CLASS} unedited`)
    .attr('x', nodeWidth / 2)
    .attr('y', namePos.y + nodePaddingY + titleYTopDistance)
    .attr('dy', '0.1em')
    .style('font-size', titleFontSize)
    .style('cursor', 'pointer')
    .style('fill', titleColor)
    .text(d => (typeof getTitle === 'function' ? getTitle(d) : helpers.getTitle(d)));

  // Count
  nodeEnter
    .append('text')
    .attr('class', `${COUNTS_CLASS} unedited`)
    .attr('x', nodeWidth / 2)
    .attr('y', namePos.y + nodePaddingY + countYTopDistance)
    .attr('dy', '.9em')
    .style('font-size', countFontSize)
    .style('font-weight', 400)
    .style('cursor', 'pointer')
    .style('fill', reportsColor)
    .text(d => (typeof getCount === 'function' ? getCount(d) : helpers.getCount(d)))
    .on('click', helpers.customOnClick(onCountClick, onClick, config));

  // Entity's Avatar
  nodeEnter
    .append('image')
    .attr('id', d => `image-${d.data.id}`)
    .attr('width', avatarWidth)
    .attr('height', avatarWidth)
    .attr('x', avatarPos.x)
    .attr('y', avatarPos.y)
    .attr('stroke', borderColor)
    .attr('src', d => d.data.entity.avatar)
    .attr('href', d => d.data.entity.avatar)
    .attr('clip-path', 'url(#avatarClip)');

  // Entity's Link
  const nodeLink = nodeEnter
    .append('a')
    .attr('class', ENTITY_LINK_CLASS)
    .attr('display', d => (d.data.entity.link ? '' : 'none'))
    .attr('xlink:href', d => d.data.entity.link)
    .on('click', helpers.customOnClick(onEntityLinkClick, onClick, config));

  iconLink({
    svg: nodeLink,
    x: nodeWidth - 20,
    y: 8,
  });

  const nodeUpdate = nodeEnter.merge(node);

  // Transition nodes to their new position.
  nodeUpdate
    .transition()
    .duration(animationDuration)
    .attr('transform', d => {
      return `translate(${d.x},${d.y})`;
    });

  nodeUpdate.select('rect.box').attr('fill', backgroundColor).attr('stroke', borderColor);

  // Transition exiting nodes to the parent's new position.
  node
    .exit()
    .transition()
    .duration(animationDuration)
    .attr('transform', () => `translate(${parentNode.x},${parentNode.y})`)
    .remove();

  // Update the links
  svg.selectAll('path.link').data(links, function (d) {
    return d.id;
  });

  [
    { cls: ENTITY_NAME_CLASS, max: maxNameWordLength },
    { cls: ENTITY_TITLE_CLASS, max: maxTitleWordLength },
    { cls: COUNTS_CLASS, max: maxCountWordLength },
  ].forEach(({ cls, max }) => {
    // Svg.selectAll(`text.unedited.${cls}`).call(wrapText);
    svg.selectAll(`text.unedited.${cls}`).call(
      helpers.wrapText,
      nodeWidth - 12, // Adjust with some padding
      // name should wrap at 3 lines max
      cls === ENTITY_NAME_CLASS ? 3 : 2,
      max,
    );
  });

  // Add Tooltips
  svg
    .selectAll(`text.${ENTITY_NAME_CLASS}`)
    .append('svg:title')
    .text(d => (getName ? getName(d) : helpers.getName(d)));
  svg
    .selectAll(`text.${ENTITY_TITLE_CLASS}`)
    .append('svg:title')
    .text(d => (getTitle ? getTitle(d) : helpers.getTitle(d)));
  svg
    .selectAll(`text.${COUNTS_CLASS}`)
    .append('svg:title')
    .text(d => (getCount ? getCount(d) : helpers.getCount(d)));

  // Render lines connecting nodes
  renderLines(config);

  // Stash the old positions for transition.
  nodes.forEach(d => {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  let nodeLeftX = -70;
  let nodeRightX = 70;
  let nodeY = 200;
  nodes.forEach(d => {
    nodeLeftX = d.x < nodeLeftX ? d.x : nodeLeftX;
    nodeRightX = d.x > nodeRightX ? d.x : nodeRightX;
    nodeY = d.y > nodeY ? d.y : nodeY;
  });

  config.nodeRightX = nodeRightX;
  config.nodeY = nodeY;
  config.nodeLeftX = nodeLeftX * -1;
}
