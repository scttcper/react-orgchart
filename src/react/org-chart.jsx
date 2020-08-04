import React from 'react';

import { init } from '../chart';

export class OrgChart extends React.PureComponent {
  anchor = React.createRef();

  static defaultProps = {
    id: 'react-org-chart',
    disableCanvasMouseMove: false,
    disableCanvasMouseWheelZoom: false,
  };

  componentDidMount() {
    const {
      id,
      disableCanvasMouseMove,
      disableCanvasMouseWheelZoom,
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
    const { id } = this.props;

    return React.createElement('div', {
      id,
      ref: this.anchor,
    });
  }
}
