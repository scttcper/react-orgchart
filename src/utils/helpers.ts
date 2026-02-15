import type { ChartConfig, ChartNode } from '../chart/types';

type CustomClickHandler = ((data: unknown, event: Event) => boolean | void) | undefined;
type OnClickFactory = (config: ChartConfig) => (event: Event, datum: ChartNode) => void;

export const getName = (data: ChartNode): string => data.data.entity?.name ?? '';

export const getTitle = (data: ChartNode): string => data.data.entity?.title ?? '';

export const getCount = (data: ChartNode): string => {
  const visibleChildren = data.children?.length ?? 0;
  const collapsedChildren = data._children?.length ?? 0;
  const children = visibleChildren > 0 ? visibleChildren : collapsedChildren;

  if (!children) {
    return '';
  }

  return `Team (${children})`;
};

export const getCursorForNode = (data: ChartNode): string =>
  data.children || data._children || data.data.children || data.data._children
    ? 'pointer'
    : 'default';

export const customOnClick =
  (fn: CustomClickHandler, onClick: OnClickFactory, config: ChartConfig) =>
  (event: Event, data: ChartNode): void => {
    if (typeof fn === 'function') {
      if (fn(data, event)) {
        onClick(config);
      } else {
        event.stopPropagation();
      }
    }
  };
