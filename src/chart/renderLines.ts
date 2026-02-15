import { curveLinear, line } from 'd3-shape';

import type { ChartConfig, ChartLink } from './types';

const margin = 10;

type LinePoint = { x: number; y: number };

type RenderLinesConfig = Pick<
  ChartConfig,
  'svg' | 'links' | 'nodeWidth' | 'nodeHeight' | 'borderColor' | 'sourceNode' | 'animationDuration'
>;

export function renderLines(config: RenderLinesConfig): void {
  const { svg, links, nodeWidth, nodeHeight, borderColor, sourceNode, animationDuration } = config;

  // Select all the links to render the lines
  const link = svg
    .selectAll<SVGPathElement, ChartLink>('path.link')
    .data(links, ({ source, target }) => {
      return `${source.data.id ?? ''}-${target.data.id ?? ''}`;
    });

  // Define the angled line function
  const angle = line<LinePoint>()
    .x(point => point.x)
    .y(point => point.y)
    .curve(curveLinear);
  const halfNodeWidth = nodeWidth / 2;

  // Enter new links at the parent's previous position.
  const linkEnter = link
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', borderColor)
    .attr('stroke-opacity', 1)
    .attr('stroke-width', 1.25)
    .attr('d', linkDatum => {
      const linePoints: LinePoint[] = [
        {
          x: linkDatum.source.x + halfNodeWidth,
          y: linkDatum.source.y + margin,
        },
        {
          x: linkDatum.source.x + halfNodeWidth,
          y: linkDatum.source.y + margin,
        },
        {
          x: linkDatum.source.x + halfNodeWidth,
          y: linkDatum.source.y + margin,
        },
        {
          x: linkDatum.source.x + halfNodeWidth,
          y: linkDatum.source.y + margin,
        },
      ];

      return angle(linePoints);
    });

  const linkUpdate = linkEnter.merge(link);

  // Transition links to their new position.
  linkUpdate
    .transition()
    .duration(animationDuration)
    .attr('d', linkDatum => {
      const linePoints: LinePoint[] = [
        {
          x: linkDatum.source.x + halfNodeWidth,
          y: linkDatum.source.y + nodeHeight,
        },
        {
          x: linkDatum.source.x + halfNodeWidth,
          y: linkDatum.target.y - margin,
        },
        {
          x: linkDatum.target.x + halfNodeWidth,
          y: linkDatum.target.y - margin,
        },
        {
          x: linkDatum.target.x + halfNodeWidth,
          y: linkDatum.target.y,
        },
      ];

      return angle(linePoints);
    });

  // Animate existing links to the parent's new position
  link
    .exit()
    .transition()
    .duration(animationDuration)
    .attr('d', () => {
      const lineNodeX = sourceNode?.x ?? 0;
      const lineNodeY = sourceNode?.y ?? 0;
      const linePoints: LinePoint[] = [
        {
          x: lineNodeX + halfNodeWidth,
          y: lineNodeY + nodeHeight + 2,
        },
        {
          x: lineNodeX + halfNodeWidth,
          y: lineNodeY + nodeHeight + 2,
        },
        {
          x: lineNodeX + halfNodeWidth,
          y: lineNodeY + nodeHeight + 2,
        },
        {
          x: lineNodeX + halfNodeWidth,
          y: lineNodeY + nodeHeight + 2,
        },
      ];

      return angle(linePoints);
    })
    .remove();
}
