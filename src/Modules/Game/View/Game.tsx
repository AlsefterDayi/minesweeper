import { useLocation, Navigate } from "react-router-dom";
import Cell from "../../../components/Cell";

const getBoardConfig = (level: string) => {
  switch (level) {
    case "easy":
      return { rows: 9, cols: 9, mines: 10 };
    case "medium":
      return { rows: 16, cols: 16, mines: 40 };
    case "hard":
      return { rows: 16, cols: 30, mines: 99 };
    default:
      return { rows: 9, cols: 9, mines: 10 };
  }
};

const GAP = 4; // px, grid gap
const BOARD_PADDING = 16; // px, board-un kənar boşluğu

const Game = () => {
  const location = useLocation();
  const state = location.state as { playerName: string; level: string } | null;

  if (!state) return <Navigate to="/" replace />;

  const { playerName, level } = state;
  const { rows, cols, mines } = getBoardConfig(level);

  // Sidebar width 25%
  const sidebarWidth = window.innerWidth * 0.25;

  // Board parent ölçüsü, padding əlavə edildi
  const boardWidth = window.innerWidth - sidebarWidth - BOARD_PADDING * 2;
  const boardHeight = window.innerHeight - BOARD_PADDING * 2;

  // Xanaların ölçüsü: width və height-ə uyğun minimum
  const totalGapWidth = GAP * (cols - 1);
  const totalGapHeight = GAP * (rows - 1);
  const cellSize = Math.floor(
    Math.min(
      (boardWidth - totalGapWidth) / cols,
      (boardHeight - totalGapHeight) / rows
    )
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 flex flex-col items-center justify-center border-r border-gray-300 p-4 bg-white shadow">
        <h1 className="text-3xl font-bold mb-6">Minesweeper</h1>
        <p className="mb-4 text-lg">Player: {playerName}</p>
        <p className="mb-4 text-lg capitalize">Level: {level}</p>
        <p className="text-lg font-semibold">⏱ Time: 00:00</p>
        <p className="text-lg font-semibold">💣 Mines: {mines}</p>
      </div>

      {/* Board */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        style={{
          width: boardWidth + BOARD_PADDING * 2,
          height: boardHeight + BOARD_PADDING * 2,
          padding: `${BOARD_PADDING}px`,
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gap: `${GAP}px`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            return <Cell key={idx} row={row} col={col} size={cellSize} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Game;
