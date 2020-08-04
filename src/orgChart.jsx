import React from 'react';

import { init } from './chart';

const defaultId = 'react-org-chart';

export class OrgChart extends React.PureComponent {
  constructor() {
    super();
    this.anchor = React.createRef();
  }

  componentDidMount() {
    const {
      id = defaultId,
      disableCanvasMouseMove = false,
      disableCanvasMouseWheelZoom = false,
      tree,
      ...options
    } = this.props;

    init({
      id: `#${id}`,
      elem: this.anchor.current,
      data: tree,
      disableCanvasMouseMove,
      disableCanvasMouseWheelZoom,
      ...options,
    });
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
