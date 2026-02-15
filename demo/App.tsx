import { arrayToTree } from 'performant-array-to-tree';

import { OrgChart } from '../src';

import avatarPersonnel from './assets/avatar-personnel.svg';
import { data } from './testdata';

const tree = arrayToTree(
  data.map(x => ({ ...x, entity: { ...x, avatar: avatarPersonnel }, parentId: x.reportsTo?.id })),
  { dataField: null },
);

export default function App() {
  // For downloading org chart as image or pdf based on id
  return <OrgChart tree={tree[0]} />;
}
