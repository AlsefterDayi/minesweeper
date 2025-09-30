import type { CellProps } from "../Models/Models";

type Props = {
  row: number;
  col: number;
  size: number;
  cell: CellProps & {
    mine: boolean;
    revealed: boolean;
    flagged: boolean;
    number: number;
  };
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
};

const Cell = ({ size, cell, onClick, onContextMenu, onDoubleClick }: Props) => {
  let content = "";
  let bg = "bg-gray-300";

  if (cell.revealed) {
    bg = "bg-gray-200";
    if (cell.mine) {
      content = "💣";
    } else if (cell.number > 0) {
      content = String(cell.number);
    }
  } else if (cell.flagged) {
    content = "🚩";
  }

  return (
    <div
      className={`${bg} border border-gray-400 flex items-center justify-center cursor-pointer select-none`}
      style={{ width: size, height: size, fontWeight: "bold", fontSize: size * 0.5 }}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
    >
      {content}
    </div>
  );
};

export default Cell;
