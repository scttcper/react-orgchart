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
/* Height of the line for child nodes */
const lineDepthY = 120;

// Colors
const backgroundColor = '#fff';
// Theme.borderlight
const borderColor = '#E7E1EC';
// Theme.gray800
const nameColor = '#302839';
// Theme.gray600
const titleColor = '#645574';
const reportsColor = '#92A0AD';

export interface Config {
  animationDuration: number;
  nodeWidth: number;
  nodeHeight: number;
  nodeSpacing: number;
  nodePaddingX: number;
  nodePaddingY: number;
  nodeBorderRadius: number;
  avatarWidth: number;
  lineDepthY: number;
  backgroundColor: string;
  borderColor: string;
  nameColor: string;
  titleColor: string;
  reportsColor: string;
  shouldResize: boolean;
  nameFontSize: number;
  titleFontSize: number;
  titleYTopDistance: number;
  countFontSize: number;
  countYTopDistance: number;
  maxNameWordLength: number;
  maxTitleWordLength: number;
  maxCountWordLength: number;
  onEntityLinkClick?: (data: any, event: any) => void;
  onNameClick?: (data: any, event: any) => void;
  onCountClick?: (data: any, event: any) => void;
  getName?: (data: any) => string;
  getTitle?: (data: any) => string;
  getCount?: (data: any) => string;
}

export const config: Config = {
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
  nameFontSize: 14,
  titleFontSize: 13,
  titleYTopDistance: 25,
  countFontSize: 14,
  countYTopDistance: 72,
  maxNameWordLength: 16,
  maxTitleWordLength: 17,
  maxCountWordLength: 17,
};
