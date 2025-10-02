import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Board from "./Board";
import Sidebar from "./Sidebar";
import ResultModal from "./ResultModal";
import type { CellType } from "../Model/GameModel";

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

const createEmptyBoard = (rows: number, cols: number): CellType[][] =>
  Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      mine: false,
      revealed: false,
      flagged: false,
      number: 0,
    }))
  );

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { playerName: string; level: string } | null;
  if (!state) return <Navigate to="/" replace />;

  const { playerName, level } = state;
  const { rows, cols, mines } = getBoardConfig(level);
  const sidebarWidth = window.innerWidth * 0.25;
  const boardWidth = window.innerWidth - sidebarWidth - 32;
  const boardHeight = window.innerHeight - 32;
  const cellSize = Math.floor(
    Math.min(
      (boardWidth - (cols - 1) * 4) / cols,
      (boardHeight - (rows - 1) * 4) / rows
    )
  );

  const [board, setBoard] = useState<CellType[][]>(() =>
    createEmptyBoard(rows, cols)
  );
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [youWon, setYouWon] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timerActive) interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const checkWin = (b: CellType[][]) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!b[r][c].mine && !b[r][c].revealed) return false;
      }
    }
    return true;
  };

  const resetGame = () => {
    const newBoard = createEmptyBoard(rows, cols);
    setBoard(newBoard);
    setIsFirstClick(true);
    setTime(0);
    setTimerActive(false);
    setGameOver(false);
    setYouWon(false);
  };

  const handleBackToStart = () => {
    navigate("/");
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar
          playerName={playerName}
          level={level}
          time={time}
          mines={mines}
          gameOver={gameOver}
          youWon={youWon}
        />
        <Board
          board={board}
          setBoard={setBoard}
          cellSize={cellSize}
          rows={rows}
          cols={cols}
          mines={mines}
          isFirstClick={isFirstClick}
          setIsFirstClick={setIsFirstClick}
          setTimerActive={setTimerActive}
          gameOver={gameOver}
          setGameOver={setGameOver}
          setYouWon={setYouWon}
          checkWin={checkWin}
        />
      </div>

      <ResultModal
        isOpen={gameOver || youWon}
        isWin={youWon}
        time={time}
        onPlayAgain={handlePlayAgain}
        onBackToStart={handleBackToStart}
      />
    </>
  );
};

export default Game;
