export type NavKeys = "home" | "game";

export interface IPage {
  id: NavKeys;
  title: string;
  path: string;
  element: React.ReactNode;
  is_visible: boolean;
  is_protected: boolean;
}

export interface CellData {
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export interface CellProps {
  row: number;
  col: number;
  size?: number;
  data?: CellData;
  onClick?: () => void;
  onRightClick?: (e: React.MouseEvent) => void;
}
