const animationDuration = 350;
const shouldResize = true;

// Nodes
const nodeWidth = 140;
const nodeHeight = 190;
const nodeSpacing = 12;
const nodePaddingX = 16;
const nodePaddingY = 16;
const avatarWidth = 48;
const nodeBorderRadius = 4;

// Lines
const lineDepthY = 120; /* Height of the line for child nodes */

// Colors
const backgroundColor = '#fff';
// Theme.borderlight
const borderColor = '#E7E1EC';
// Theme.gray800
const nameColor = '#302839';
// Theme.gray600
const titleColor = '#645574';
const reportsColor = '#92A0AD';

const config = {
  animationDuration,
  nodeWidth,
  nodeHeight,
  nodeSpacing,
  nodePaddingX,
  nodePaddingY,
  nodeBorderRadius,
  avatarWidth,
  lineDepthY,
  backgroundColor,
  borderColor,
  nameColor,
  titleColor,
  reportsColor,
  shouldResize,
};

module.exports = config;
