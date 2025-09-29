import type { CellProps } from "../Models/Models";

interface CellPropsWithSize extends CellProps {
  size: number;
}

const Cell = ({ row, col, size }: CellPropsWithSize) => {
  return (
    <div
      className="bg-gray-300 border border-gray-400 flex items-center justify-center cursor-pointer select-none"
      style={{ width: size, height: size }}
      data-row={row}
      data-col={col}
    />
  );
};

export default Cell;
