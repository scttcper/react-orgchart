export interface TreeItemEntity {
  avatar?: string;
  link?: string;
  name?: string;
  title?: string;
  [key: string]: unknown;
}

export interface TreeItem {
  id?: string | number;
  parentId?: string | number | null;
  children?: TreeItem[] | null;
  _children?: TreeItem[] | null;
  entity?: TreeItemEntity;
  [key: string]: unknown;
}
