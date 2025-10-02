type Props = {
  playerName: string;
  level: string;
  time: number;
  mines: number;
  gameOver: boolean;
  youWon: boolean;
};

const Sidebar = ({ playerName, level, time, mines, gameOver, youWon }: Props) => {
  return (
    <div className="w-1/4 flex flex-col items-center justify-center border-r border-gray-300 p-4 bg-white shadow">
      <h1 className="text-3xl font-bold mb-6">Minesweeper</h1>
      <p className="mb-4 text-lg">Player: {playerName}</p>
      <p className="mb-4 text-lg capitalize">Level: {level}</p>
      <p className="text-lg font-semibold">⏱ Time: {time}s</p>
      <p className="text-lg font-semibold">💣 Mines: {mines}</p>
      {gameOver && <p className="text-3xl font-bold text-red-600 mt-4">GAME OVER</p>}
      {youWon && <p className="text-3xl font-bold text-green-600 mt-4">YOU WON</p>}
    </div>
  );
};

export default Sidebar;
