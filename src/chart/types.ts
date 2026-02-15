import type {
  HierarchyNode,
  HierarchyPointLink,
  HierarchyPointNode,
  TreeLayout,
} from 'd3-hierarchy';
import type { Selection } from 'd3-selection';

import type { TreeItem } from '../types';

import type { Config } from './config';

export interface ChartNode extends HierarchyPointNode<TreeItem> {
  _children?: ChartNode[];
  x0?: number;
  y0?: number;
}

export interface ChartLink extends Omit<HierarchyPointLink<TreeItem>, 'source' | 'target'> {
  source: ChartNode;
  target: ChartNode;
}

export type SvgRootSelection = Selection<SVGSVGElement, unknown, null, undefined>;
export type SvgGroupSelection = Selection<SVGGElement, unknown, null, undefined>;

export interface ChartConfig extends Config {
  id: string;
  elem: HTMLElement | null;
  data: TreeItem;
  treeData: TreeItem;
  tree: HierarchyNode<TreeItem>;
  treeMap: TreeLayout<TreeItem>;
  svg: SvgGroupSelection;
  svgroot: SvgRootSelection;
  render: (config: ChartConfig) => void;
  sourceNode?: ChartNode | null;
  callerNode?: ChartNode | null;
  links: ChartLink[];
  nodes: ChartNode[];
  elemWidth: number;
  elemHeight: number;
  nodeRightX?: number;
  nodeLeftX?: number;
  nodeY?: number;
  disableCanvasMouseWheelZoom?: boolean;
  disableCanvasMouseMove?: boolean;
}
