# @ctrl/react-orgchart [![npm](https://badgen.net/npm/v/@ctrl/react-orgchart)](https://www.npmjs.com/package/@ctrl/react-orgchart) [![CircleCI](https://badgen.net/github/status/scttcper/react-orgchart)](https://circleci.com/gh/scttcper/react-orgchart)

Small react wrapper around a [d3](https://d3js.org/) based org chart.

This is based on [smartprocure/react-org-chart](https://github.com/smartprocure/react-org-chart) which itself is also a fork. This fork has been updated to use d3 v6 and expose typescript types.

DEMO: https://ctrl-react-orgchart.vercel.app

### Install

```console
npm install @ctrl/react-orgchart
```

### Use

```tsx
import { OrgChart } from '@ctrl/react-orgchart';

<OrgChart tree={tree} />;
```

#### Sample tree data

```js
{
  id: 1,
  entity: {
    id: 1,
    // base 64 image
    avatar: 'data:image/jpeg;base64,/9j....',
    name: 'Jane Doe',
    title: 'IT',
  },
  children: [
    {
      id: 2,
      entity: {
        id: 2,
        // svg example
        avatar: '<svg></svg>',
        name: 'John Foo',
        title: 'CTO',
      },
      children: [],
    },
  ],
}
```
