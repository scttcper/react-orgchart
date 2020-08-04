import React from 'react';

import { init } from '../chart';

class OrgChart extends React.PureComponent {
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

    console.log('current', this.anchor.current);
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

module.exports = OrgChart;
