import { useLocation, Navigate } from "react-router-dom";
import Cell from "../../../components/Cell";
// import tipini də lazım olsa əlavə edərsən

const Game = () => {
  const location = useLocation();
  const state = location.state as { playerName: string; level: string } | null;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { playerName, level } = state;

  let rows = 0;
  let cols = 0;

  switch (level) {
    case "easy":
      rows = 8;
      cols = 8;
      break;
    case "medium":
      rows = 12;
      cols = 12;
      break;
    case "hard":
      rows = 16;
      cols = 16;
      break;
    default:
      rows = 8;
      cols = 8;
  }

  // Dinamik cell ölçüsü
  const cellSize = `min(calc(80vh / ${rows}), calc(80vw / ${cols}))`;

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left sidebar */}
      <div className="w-1/4 flex flex-col items-center justify-center border-r border-gray-300 p-6 bg-white shadow">
        <h1 className="text-3xl font-bold mb-6">Minesweeper</h1>
        <p className="mb-4 text-lg">Player: {playerName}</p>
        <p className="mb-4 text-lg capitalize">Level: {level}</p>
        <p className="text-lg font-semibold">⏱ Time: 00:00</p>
      </div>

      {/* Right board area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize})`,
            gridTemplateRows: `repeat(${rows}, ${cellSize})`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            return <Cell key={idx} row={row} col={col} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Game;
