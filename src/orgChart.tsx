import React from 'react';

import { init } from './chart/index';
import { Config, config as defaultConfig } from './chart/config';

const defaultId = 'react-org-chart';

export interface TreeItem {
  [key: string]: TreeItem[] | any;
  id?: string | number;
  parentId?: string | number | null;
  children?: TreeItem[] | null;
  entity?: {
    [key: string]: any;
    avatar?: string;
    link?: string;
    name?: string;
    title?: string;
  };
}

type Props = Partial<Config> & {
  id?: string;
  disableCanvasMouseMove?: boolean;
  disableCanvasMouseWheelZoom?: boolean;
  tree: TreeItem[] | TreeItem;
};

export class OrgChart extends React.PureComponent<Props> {
  anchor = React.createRef();
  onDestroy!: () => void;

  componentDidMount() {
    const {
      id = defaultId,
      disableCanvasMouseMove = false,
      disableCanvasMouseWheelZoom = false,
      tree,
      ...options
    } = this.props;

    this.onDestroy = init({
      ...defaultConfig,
      id: `#${id}`,
      elem: this.anchor.current,
      data: tree,
      disableCanvasMouseMove,
      disableCanvasMouseWheelZoom,
      ...options,
    });
  }

  componentWillUnmount() {
    this.onDestroy();
  }

  render() {
    const { id = defaultId } = this.props;

    return React.createElement('div', {
      id,
      ref: this.anchor,
      style: { width: '100%', height: '100%' },
    });
  }
}
