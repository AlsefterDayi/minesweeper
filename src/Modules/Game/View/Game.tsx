import { useLocation, Navigate } from "react-router-dom";

const Game = () => {
  const location = useLocation();
  const state = location.state as { playerName: string; level: string } | null;

  if (!state) return <Navigate to="/" replace />;

  const { playerName, level } = state;

  const rows = 8;
  const cols = 8;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Minesweeper</h1>
      <p className="mb-4 text-lg">Player: {playerName}</p>
      <p className="mb-6 text-lg">Level: {level}</p>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}
      >
        {Array.from({ length: rows * cols }).map((_, idx) => (
          <div
            key={idx}
            className="w-10 h-10 bg-gray-300 border border-gray-400 flex items-center justify-center cursor-pointer"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Game;
