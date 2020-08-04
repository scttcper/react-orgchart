export const iconLink = ({ svg, x = 5, y = 5 }) => {
  const container = svg
    .append('g')
    .attr('stroke', 'none')
    .attr('fill', 'none')
    .style('cursor', 'pointer')
    .append('g');

  const icon = container
    .append('g')
    .attr('id', 'icon')
    .attr('fill', '#9585A3')
    .attr('transform', `translate(${x}, ${y})`);

  const arrow = icon
    .append('g')
    .attr('id', 'arrow')
    .attr(
      'transform',
      'translate(7.000000, 7.000000) scale(-1, 1) translate(-7.000000, -7.000000)',
    );

  arrow
    .append('path')
    .attr(
      'd',
      'M3.41421356,2 L8.70710678,7.29289322 C9.09763107,7.68341751 9.09763107,8.31658249 8.70710678,8.70710678 C8.31658249,9.09763107 7.68341751,9.09763107 7.29289322,8.70710678 L2,3.41421356 L2,7 C2,7.55228475 1.55228475,8 1,8 C0.44771525,8 0,7.55228475 0,7 L0,1.49100518 C0,0.675320548 0.667758414,0 1.49100518,0 L7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 L3.41421356,2 Z',
    );

  arrow
    .append('path')
    // .attr('opacity', 0.7)
    .attr(
      'd',
      'M12,2 L12,12 L2,12 L2,11 C2,10.4477153 1.55228475,10 1,10 C0.44771525,10 0,10.4477153 0,11 L0,12.4953156 C0,13.3242086 0.674596865,14 1.50034732,14 L12.4996527,14 C13.3281027,14 14,13.3234765 14,12.4996527 L14,1.50034732 C14,0.669321781 13.3358906,0 12.4953156,0 L11,0 C10.4477153,0 10,0.44771525 10,1 C10,1.55228475 10.4477153,2 11,2 L12,2 Z',
    );

  icon
    .append('rect')
    .attr('id', 'bounds')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 24)
    .attr('height', 24)
    .attr('fill', 'transparent');
};
