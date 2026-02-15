import { memo, useEffect, useRef } from 'react';

import { config as defaultConfig, type Config } from './chart/config';
import { initializeOrgChart } from './chart/index';
import type { TreeItem } from './types';

const defaultId = 'react-org-chart';

export type { TreeItem } from './types';

export type OrgChartProps = Partial<Config> & {
  id?: string;
  disableCanvasMouseMove?: boolean;
  disableCanvasMouseWheelZoom?: boolean;
  tree: TreeItem | TreeItem[];
};

function OrgChartComponent(props: OrgChartProps) {
  const {
    id = defaultId,
    disableCanvasMouseMove = false,
    disableCanvasMouseWheelZoom = false,
    tree,
  } = props;
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDestroy = initializeOrgChart({
      ...defaultConfig,
      ...props,
      id: `#${id}`,
      elem: anchor.current,
      data: tree,
      disableCanvasMouseMove,
      disableCanvasMouseWheelZoom,
    });

    return () => {
      onDestroy();
    };
  }, [props, id, tree, disableCanvasMouseMove, disableCanvasMouseWheelZoom]);

  return <div id={id} ref={anchor} style={{ width: '100%', height: '100%' }} />;
}

export const OrgChart = memo(OrgChartComponent);
