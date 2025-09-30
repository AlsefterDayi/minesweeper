import type { CellProps } from "../Models/Models";

const Cell = ({ row, col }: CellProps) => {
  return (
    <div className="bg-gray-300 border border-gray-400 flex items-center justify-center cursor-pointer select-none w-full h-full" 
         data-row={row} data-col={col} />
  );
};

export default Cell;
