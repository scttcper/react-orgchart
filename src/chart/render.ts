import * as helpers from '../utils/index';

import { iconLink } from './components/iconLink';
import { onClick } from './onClick';
import { renderLines } from './renderLines';
import type { ChartConfig, ChartLink, ChartNode } from './types';

const CHART_NODE_CLASS = 'org-chart-node';
const ENTITY_LINK_CLASS = 'org-chart-entity-link';
const ENTITY_NAME_CLASS = 'org-chart-entity-name';
const ENTITY_TITLE_CLASS = 'org-chart-entity-title';
const COUNTS_CLASS = 'org-chart-counts';

export function render(config: ChartConfig): void {
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
  const nodes = data.descendants() as ChartNode[];
  const links = data.links() as ChartLink[];

  config.links = links;
  config.nodes = nodes;

  // Normalize for fixed-depth.
  nodes.forEach(node => {
    node.y = node.depth * lineDepthY;
  });

  // Update the nodes
  const node = svg
    .selectAll<SVGGElement, ChartNode>(`g.${CHART_NODE_CLASS}`)
    .data(nodes, nodeDatum => nodeDatum.data.id ?? '');
  const parentNode = sourceNode ?? nodes[0];

  // Enter new nodes at the parent's previous position.
  const nodeEnter = node
    .enter()
    .append('g')
    .attr('class', CHART_NODE_CLASS)
    .attr('transform', () => {
      return `translate(${parentNode.x0 ?? parentNode.x}, ${parentNode.y0 ?? parentNode.y})`;
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
    .attr('id', nodeDatum => `${nodeDatum.data.id ?? ''}`)
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
    .text(nodeDatum =>
      typeof getName === 'function' ? getName(nodeDatum) : helpers.getName(nodeDatum),
    )
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
    .text(nodeDatum =>
      typeof getTitle === 'function' ? getTitle(nodeDatum) : helpers.getTitle(nodeDatum),
    );

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
    .text(nodeDatum =>
      typeof getCount === 'function' ? getCount(nodeDatum) : helpers.getCount(nodeDatum),
    )
    .on('click', helpers.customOnClick(onCountClick, onClick, config));

  // Entity's Avatar
  nodeEnter
    .append('image')
    .attr('id', nodeDatum => `image-${nodeDatum.data.id ?? ''}`)
    .attr('width', avatarWidth)
    .attr('height', avatarWidth)
    .attr('x', avatarPos.x)
    .attr('y', avatarPos.y)
    .attr('stroke', borderColor)
    .attr('src', nodeDatum => nodeDatum.data.entity?.avatar ?? '')
    .attr('href', nodeDatum => nodeDatum.data.entity?.avatar ?? '')
    .attr('clip-path', 'url(#avatarClip)');

  // Entity's Link
  const nodeLink = nodeEnter
    .append('a')
    .attr('class', ENTITY_LINK_CLASS)
    .attr('display', nodeDatum => (nodeDatum.data.entity?.link ? '' : 'none'))
    .attr('xlink:href', nodeDatum => nodeDatum.data.entity?.link ?? '')
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
    .attr('transform', nodeDatum => {
      return `translate(${nodeDatum.x},${nodeDatum.y})`;
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
  svg
    .selectAll<SVGPathElement, ChartLink>('path.link')
    .data(links, linkDatum => linkDatum.target.data.id ?? '');

  [
    { cls: ENTITY_NAME_CLASS, max: maxNameWordLength },
    { cls: ENTITY_TITLE_CLASS, max: maxTitleWordLength },
    { cls: COUNTS_CLASS, max: maxCountWordLength },
  ].forEach(({ cls, max }) => {
    svg.selectAll<SVGTextElement, ChartNode>(`text.unedited.${cls}`).call(
      helpers.wrapText,
      nodeWidth - 12, // Adjust with some padding
      // Name should wrap at 3 lines max
      cls === ENTITY_NAME_CLASS ? 3 : 2,
      max,
    );
  });

  // Add tooltips
  svg
    .selectAll<SVGTextElement, ChartNode>(`text.${ENTITY_NAME_CLASS}`)
    .append('svg:title')
    .text(nodeDatum => (getName ? getName(nodeDatum) : helpers.getName(nodeDatum)));
  svg
    .selectAll<SVGTextElement, ChartNode>(`text.${ENTITY_TITLE_CLASS}`)
    .append('svg:title')
    .text(nodeDatum => (getTitle ? getTitle(nodeDatum) : helpers.getTitle(nodeDatum)));
  svg
    .selectAll<SVGTextElement, ChartNode>(`text.${COUNTS_CLASS}`)
    .append('svg:title')
    .text(nodeDatum => (getCount ? getCount(nodeDatum) : helpers.getCount(nodeDatum)));

  // Render lines connecting nodes
  renderLines(config);

  // Stash the old positions for transition.
  nodes.forEach(nodeDatum => {
    nodeDatum.x0 = nodeDatum.x;
    nodeDatum.y0 = nodeDatum.y;
  });

  let nodeLeftX = -70;
  let nodeRightX = 70;
  let nodeY = 200;
  nodes.forEach(nodeDatum => {
    nodeLeftX = nodeDatum.x < nodeLeftX ? nodeDatum.x : nodeLeftX;
    nodeRightX = nodeDatum.x > nodeRightX ? nodeDatum.x : nodeRightX;
    nodeY = nodeDatum.y > nodeY ? nodeDatum.y : nodeY;
  });

  config.nodeRightX = nodeRightX;
  config.nodeY = nodeY;
  config.nodeLeftX = nodeLeftX * -1;
}
