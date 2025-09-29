import type { ReactNode } from "react";

export type NavKeys = "home" | "game";

export interface IPage {
  id: NavKeys;
  title: string;
  path: string;
  element: ReactNode;
  is_visible: boolean;
  is_protected: boolean;
}

export interface CellProps {
  row: number;
  col: number;
}