import { hierarchy, tree } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { zoom as zoomer, zoomIdentity, type D3ZoomEvent } from 'd3-zoom';

import type { TreeItem } from '../types';
import { collapse } from '../utils/index';

import { config as defaultChartConfig, type Config } from './config';
import { render } from './render';
import type { ChartConfig, ChartNode } from './types';

export type OrgChartInitOptions = Partial<Config> & {
  id: string;
  elem: HTMLElement | null;
  data: TreeItem | TreeItem[];
  disableCanvasMouseWheelZoom?: boolean;
  disableCanvasMouseMove?: boolean;
};

export function initializeOrgChart(options: OrgChartInitOptions): () => void {
  if (!options.id) {
    throw new Error('missing id for svg root');
  }

  const mergedConfig = {
    ...defaultChartConfig,
    ...options,
  };

  const { elem, nodeWidth, nodeHeight, nodeSpacing, shouldResize } = mergedConfig;
  const treeData = mergedConfig.data as TreeItem;

  // Calculate how many pixel nodes to be spaced based on the
  // type of line that needs to be rendered
  const lineDepthY = nodeHeight + 40;

  if (!elem) {
    throw new Error('No root elem');
  }

  // Reset in case there's pre-existing DOM
  elem.innerHTML = '';
  const elemWidth = elem.offsetWidth;
  const elemHeight = elem.offsetHeight;

  // Setup the d3 tree layout
  const treeRoot = hierarchy(treeData, d => d.children ?? undefined);
  const treeMap = tree<TreeItem>().nodeSize([nodeWidth + nodeSpacing, nodeHeight + nodeSpacing]);

  // Collapse tree on load
  treeMap(treeRoot)
    .descendants()
    .slice(1)
    .forEach(node => collapse(node as ChartNode));

  // Calculate width of a node with expanded children
  // const childrenWidth = parseInt((treeData.children.length * nodeWidth) / 2)

  // <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" xml:space="preserve" viewBox="0 0 193 260" enable-background=" new 0 0 193 260" height="260" width="193"
  // Add svg root for d3
  const svgroot = select(elem)
    .append('svg')
    .attr('id', 'svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('x', '0px')
    .attr('y', '0px')
    .attr('xml:space', 'preserve')
    .attr('viewBox', `0 0 ${elemWidth} ${elemHeight}`)
    .attr('enable-background', ` new 0 0 ${elemWidth} ${elemHeight}`)
    .attr('width', elemWidth)
    .attr('height', elemHeight);

  // Graph center point
  const centerPoint = elemWidth / 2 - nodeWidth / 2 + 15;

  // Add our base svg group to transform when a user zooms/pans
  const svg = svgroot.append('g');

  const config: ChartConfig = {
    ...mergedConfig,
    data: treeData,
    lineDepthY,
    treeData,
    tree: treeRoot,
    treeMap,
    svg,
    svgroot,
    render,
    links: [],
    nodes: [],
    elemWidth,
    elemHeight,
  };

  // Defined zoom behavior
  const zoom = zoomer<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 1.5])
    .duration(50)
    .on('zoom', (zoomEvent: D3ZoomEvent<SVGSVGElement, unknown>) => {
      svg.attr('transform', zoomEvent.transform.toString());
    });

  svgroot.call(zoom.transform, zoomIdentity.translate(centerPoint, 48).scale(0.8));

  const zoomedRoot = svgroot.call(zoom);

  // Disable the Mouse Wheel Zooming
  if (config.disableCanvasMouseWheelZoom) {
    zoomedRoot.on('wheel.zoom', null);
  }

  // Disable the Mouse Wheel Canvas Content Moving
  if (config.disableCanvasMouseMove) {
    zoomedRoot
      .on('mousedown.zoom', null)
      .on('touchstart.zoom', null)
      .on('touchmove.zoom', null)
      .on('touchend.zoom', null);
  }

  // Add avatar clip path
  const defs = svgroot.append('svg:defs');
  defs
    .append('clipPath')
    .attr('id', 'avatarClip')
    .append('circle')
    .attr('cx', 70)
    .attr('cy', 32)
    .attr('r', 24);

  // Add boxshadow
  const filter = svgroot
    .append('svg:defs')
    .append('svg:filter')
    .attr('id', 'boxShadow')
    .attr('height', '150%')
    .attr('width', '150%');

  filter
    .append('svg:feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', 1) // blur amount
    .attr('result', 'blurOut');

  filter
    .append('svg:feOffset')
    .attr('in', 'blurOut')
    .attr('dx', 0)
    .attr('dy', 2)
    .attr('result', 'offsetOut');

  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'offsetOut');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Add listener for when the browser or parent node resizes
  const resize = () => {
    if (!elem) {
      window.removeEventListener('resize', resize);
      return;
    }

    svgroot.attr('width', elem.offsetWidth).attr('height', elem.offsetHeight);
  };

  if (shouldResize) {
    window.addEventListener('resize', resize);
  }

  // Start initial render
  render(config);

  // return OnDestroy fn
  return () => {
    svgroot.remove();
    if (shouldResize) {
      window.removeEventListener('resize', resize);
    }
  };
}
