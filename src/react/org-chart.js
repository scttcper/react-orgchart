const { createElement, PureComponent } = require('react');
const { init } = require('../chart');

class OrgChart extends PureComponent {
  render() {
    const { id } = this.props;

    return createElement('div', { id });
  }

  static defaultProps = {
    id: 'react-org-chart',
    zoomInId: 'org-chart-zoom-in',
    zoomOutId: 'org-chart-zoom-out',
    scaleToFitId: 'org-chart-scale-to-fit',
    resetId: 'org-chart-reset',
    disableCanvasMouseMove: false,
    disableCanvasMouseWheelZoom: false,
    tree: {},
  };

  componentDidMount() {
    const {
      id,
      zoomInId,
      zoomOutId,
      scaleToFitId,
      resetId,
      disableCanvasMouseMove,
      disableCanvasMouseWheelZoom,
      tree,
      ...options
    } = this.props;

    init({
      id: `#${id}`,
      zoomInId: zoomInId,
      zoomOutId: zoomOutId,
      scaleToFitId: scaleToFitId,
      resetId: resetId,
      data: tree,
      disableCanvasMouseMove,
      disableCanvasMouseWheelZoom,
      ...options,
    });
  }
}

module.exports = OrgChart;
