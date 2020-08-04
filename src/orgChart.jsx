import React from 'react';

import { init } from './chart';

export class OrgChart extends React.PureComponent {
  constructor() {
    super();
    this.anchor = React.createRef();

    this.defaultProps = {
      id: 'react-org-chart',
      disableCanvasMouseMove: false,
      disableCanvasMouseWheelZoom: false,
    };
  }

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
      style: { width: '100%', height: '100%' },
    });
  }
}
