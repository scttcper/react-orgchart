import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const { initializeOrgChartSpy, destroySpy } = vi.hoisted(() => {
  const destroy = vi.fn();
  const initializeOrgChart = vi.fn(() => destroy);
  return {
    initializeOrgChartSpy: initializeOrgChart,
    destroySpy: destroy,
  };
});

vi.mock('../src/chart/index', () => ({
  initializeOrgChart: initializeOrgChartSpy,
}));

import { OrgChart, type TreeItem } from '../src/orgChart';

const tree: TreeItem = {
  id: 'root',
  entity: {
    name: 'Root',
    title: 'CEO',
    avatar: '',
    link: '',
  },
  children: [
    {
      id: 'child-1',
      entity: {
        name: 'Child',
        title: 'Engineer',
        avatar: '',
        link: '',
      },
      children: [],
    },
  ],
};

describe('OrgChart smoke test', () => {
  it('renders and unmounts cleanly', () => {
    const { unmount } = render(<OrgChart id="smoke-org-chart" tree={tree} />);

    expect(document.getElementById('smoke-org-chart')).toBeInTheDocument();
    expect(initializeOrgChartSpy).toHaveBeenCalledTimes(1);
    expect(initializeOrgChartSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '#smoke-org-chart',
        data: tree,
        elem: expect.any(HTMLElement),
      }),
    );

    expect(() => unmount()).not.toThrow();
    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(document.getElementById('smoke-org-chart')).not.toBeInTheDocument();
  });
});
