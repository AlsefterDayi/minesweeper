import type { CellProps } from "../Models/Models";

interface CellPropsWithSize extends CellProps {
  size: number;
}

const Cell = ({ row, col, size }: CellPropsWithSize) => {
  return (
    <div
      className="bg-gray-300 border border-gray-400 flex items-center justify-center cursor-pointer select-none"
<<<<<<< HEAD
      style={{ width: size, height: size }}
=======
>>>>>>> 2b20f1d7717b455c9847d489db2ff440e82a39b3
      data-row={row}
      data-col={col}
    />
  );
};

export default Cell;
