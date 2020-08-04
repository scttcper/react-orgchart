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

console.log(tree);

export default class App extends React.Component {
  render() {
    // For downloading org chart as image or pdf based on id
    return (
      <OrgChart
        tree={tree[0]}
      />
    );
  }
}
