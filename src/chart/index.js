import * as d3 from 'd3';
import { collapse } from '../utils';
import render from './render';
import defaultConfig from './config';

export function init(options) {
  // Merge options with the default config
  const config = {
    ...defaultConfig,
    ...options,
    treeData: options.data,
  };

  if (!config.id) {
    throw new Error('missing id for svg root');
  }

  const {
    id,
    elem,
    treeData,
    lineType,
    margin,
    nodeWidth,
    nodeHeight,
    nodeSpacing,
    shouldResize,
    zoomInId,
    zoomOutId,
    scaleToFitId,
    resetId,
    loadConfig,
    disableCanvasMouseWheelZoom,
    disableCanvasMouseMove,
  } = config;

  // Calculate how many pixel nodes to be spaced based on the
  // type of line that needs to be rendered
  if (lineType == 'angle') {
    config.lineDepthY = nodeHeight + 40;
  } else {
    config.lineDepthY = nodeHeight + 60;
  }

  if (!elem) {
    throw new Error('No root elem');
  }

  // Reset in case there's any existing DOM
  elem.innerHTML = '';
  const elemWidth = elem.offsetWidth;
  const elemHeight = elem.offsetHeight;

  // Setup the d3 tree layout
  config.tree = d3.layout.tree().nodeSize([nodeWidth + nodeSpacing, nodeHeight + nodeSpacing]);

  // Calculate width of a node with expanded children
  // const childrenWidth = parseInt((treeData.children.length * nodeWidth) / 2)

  // <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" xml:space="preserve" viewBox="0 0 193 260" enable-background=" new 0 0 193 260" height="260" width="193"
  // Add svg root for d3
  const svgroot = d3
    .select(id)
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
  const centerPoint = elemWidth / 2 - nodeWidth / 2 - margin.left / 2;

  // Add our base svg group to transform when a user zooms/pans
  const svg = svgroot.append('g').attr('transform', 'translate(' + centerPoint + ',' + 48 + ')');

  // Define box shadow and avatar border radius

  // Center the viewport on initial load
  treeData.x0 = 0;
  treeData.y0 = elemHeight / 2;

  // Collapse all of the children on initial load
  treeData.children.forEach(collapse);

  // Connect core variables to config so that they can be
  // used in internal rendering functions
  config.svg = svg;
  config.svgroot = svgroot;
  config.elemWidth = elemWidth;
  config.elemHeight = elemHeight;
  config.render = render;

  // Defined zoom behavior
  var zoom = d3.behavior.zoom().scaleExtent([0.1, 1.5]).duration(50).on('zoom', zoomed);

  let zoomedRoot = svgroot.call(zoom);

  // Disable the Mouse Wheel Zooming
  if (disableCanvasMouseWheelZoom) {
    zoomedRoot.on('wheel.zoom', null);
  }

  // Disable the Mouse Wheel Canvas Content Moving
  if (disableCanvasMouseMove) {
    zoomedRoot
      .on('mousedown.zoom', null)
      .on('touchstart.zoom', null)
      .on('touchmove.zoom', null)
      .on('touchend.zoom', null);
  }

  // Define the point of origin for zoom transformations
  zoom.translate([centerPoint, 20]);

  // Zoom update
  function zoomed() {
    svg.attr('transform', 'translate(' + zoom.translate() + ')' + 'scale(' + zoom.scale() + ')');
  }

  // To update translate and scale of zoom
  function interpolateZoom(translate, scale) {
    var self = this;
    return d3
      .transition()
      .duration(350)
      .tween('zoom', function () {
        var iTranslate = d3.interpolate(zoom.translate(), translate);
        var iScale = d3.interpolate(zoom.scale(), scale);
        return function (t) {
          zoom.scale(iScale(t)).translate(iTranslate(t));
          zoomed();
        };
      });
  }

  // Zoom extent to fit svg on the screen
  function scaleToFit() {
    const latestConfig = loadConfig();
    const { nodeLeftX, nodeRightX, nodeWidth, nodeY, margin, elemHeight, elemWidth } = latestConfig;

    const centerPoint = elemWidth / 2 - nodeWidth / 2 - margin.left / 2;
    const svgWidth = nodeLeftX + nodeRightX;
    const svgHeight = nodeY + nodeHeight * 2 + 48;

    let scaleX = elemWidth / svgWidth - 0.03;
    let scaleY = elemHeight / svgHeight - 0.06;
    const chooseScale = scaleX < scaleY ? scaleX : scaleY;
    let scale = svgWidth > elemWidth || svgHeight > elemHeight ? chooseScale : 1;
    let translateX = nodeLeftX * scale + nodeWidth / 2;

    if (svgWidth > elemWidth || svgHeight > elemHeight) {
      // If width is more than height
      if (scaleX < scaleY) {
        interpolateZoom([translateX, 48], scale);
        // If height is more than width
      } else if (scaleX > scaleY) {
        interpolateZoom([centerPoint, 48], scale);
      }
    } else {
      interpolateZoom([centerPoint, 48], scale);
    }
  }

  function reset() {
    // Center to the original center point
    interpolateZoom([centerPoint, 48], 1);

    // Collapse all of the children on initial load
    if (treeData && treeData.children) {
      treeData.children.forEach(collapse);
      render(config);
    }
  }

  // Zoom on button click
  function zoomClick() {
    var clicked = d3.event.target;
    var direction = 1;
    var factor = 0.2;
    var target_zoom = 1;
    var center = [elemWidth / 2, elemHeight / 2];
    var extent = zoom.scaleExtent();
    var translate = zoom.translate();
    var translate0 = [];
    var l = [];
    var view = { x: translate[0], y: translate[1], k: zoom.scale() };

    d3.event.preventDefault();
    direction = this.id === zoomInId ? 1 : -1;
    target_zoom = zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) {
      return false;
    }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
  }

  // d3 selects button on click
  d3.select(`#${zoomInId}`).on('click', zoomClick);
  d3.select(`#${zoomOutId}`).on('click', zoomClick);
  d3.select(`#${scaleToFitId}`).on('click', scaleToFit);
  d3.select(`#${resetId}`).on('click', reset);

  // Add listener for when the browser or parent node resizes
  const resize = () => {
    if (!elem) {
      global.removeEventListener('resize', resize);
      return;
    }

    svgroot.attr('width', elem.offsetWidth).attr('height', elem.offsetHeight);
  };

  if (shouldResize) {
    global.addEventListener('resize', resize);
  }

  // Start initial render
  render(config);

  // Update DOM root height
  d3.select(id).style('height', elemHeight + margin.top + margin.bottom);

  // Get the root
  const orgChart = d3.select('root');

  if (!d3.select(`${id}-canvas-container`)) {
    // Creating  canvas and duplicate svg for image and PDF download
    const canvasContainer = document.createElement('div');
    canvasContainer.setAttribute('id', `${id}-canvas-container`);
    canvasContainer.setAttribute('style', 'display:none;');
    orgChart.append(canvasContainer);
  }

  if (!d3.select(`${id}-svg-container`)) {
    // Duplicate svg container
    const svgContainer = document.createElement('div');
    svgContainer.setAttribute('id', `${id}-svg-container`);
    svgContainer.setAttribute('style', 'display:none;');
    orgChart.append(svgContainer);
  }
}
