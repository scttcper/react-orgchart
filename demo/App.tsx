import React from 'react';
import { arrayToTree } from 'performant-array-to-tree';

import OrgChart from '../src/react/org-chart';
// import { tree } from './Tree';
import { data } from './testdata';

// @ts-expect-error
import avatarPersonnel from './assets/avatar-personnel.svg';

const tree = arrayToTree(
  data.map(x => ({ ...x, entity: { ...x, avatar: avatarPersonnel }, parentId: x.reportsTo?.id })),
  { dataField: null },
);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
    };
  }

  handleOnChangeConfig = config => {
    this.setState({ config: config });
  };

  handleLoadConfig = () => {
    const { config } = this.state;
    return config;
  };

  render() {
    // For downloading org chart as image or pdf based on id
    return (
      <>
        <div className="org-chart-zoom-buttons">
          <button className="btn btn-outline-primary org-chart-zoom-button" id="org-chart-zoom-in">
            Zoom In
          </button>
          <button className="btn btn-outline-primary org-chart-zoom-button" id="org-chart-zoom-out">
            Zoom Out
          </button>
          <button
            className="btn btn-outline-primary org-chart-zoom-button"
            id="org-chart-scale-to-fit"
          >
            Scale to Fit
          </button>
          <button className="btn btn-outline-primary org-chart-zoom-button" id="org-chart-reset">
            Reset
          </button>
        </div>
        <OrgChart
          tree={tree[0]}
          loadConfig={() => this.state.config}
          onConfigChange={config => this.setState({ config })}
        />
      </>
    );
  }
}
