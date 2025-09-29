import type { CellProps } from "../Models/Models";

const Cell = ({ row, col }: CellProps) => {
  return (
    <div
      className="w-10 h-10 bg-gray-300 border border-gray-400 flex items-center justify-center cursor-pointer select-none"
      data-row={row}
      data-col={col}
    >
    </div>
  );
};

export default Cell;
