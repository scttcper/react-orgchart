import React from 'react';

import { init } from '../chart';

class OrgChart extends React.PureComponent {
  static defaultProps = {
    id: 'react-org-chart',
    zoomInId: 'org-chart-zoom-in',
    zoomOutId: 'org-chart-zoom-out',
    resetId: 'org-chart-reset',
    disableCanvasMouseMove: false,
    disableCanvasMouseWheelZoom: false,
  };

  anchor = React.createRef();

  componentDidMount() {
    const {
      id,
      zoomInId,
      zoomOutId,
      resetId,
      disableCanvasMouseMove,
      disableCanvasMouseWheelZoom,
      tree,
      ...options
    } = this.props;

    init({
      id: `#${id}`,
      elem: this.anchor.current,
      zoomInId: zoomInId,
      zoomOutId: zoomOutId,
      resetId: resetId,
      data: tree,
      disableCanvasMouseMove,
      disableCanvasMouseWheelZoom,
      ...options,
    });
  }

  render() {
    const { id } = this.props;

    return React.createElement('div', {
      id,
      className: id,
      ref: this.anchor,
    });
  }
}

export default OrgChart;
