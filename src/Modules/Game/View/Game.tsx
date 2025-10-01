import { useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cell from "../../../components/Cell";

type CellType = {
  row: number;
  col: number;
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  number: number;
};

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

const GAP = 4;
const BOARD_PADDING = 16;

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

const getNeighbors = (row: number, col: number, rows: number, cols: number) => {
  const neighbors: { row: number; col: number }[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push({ row: nr, col: nc });
      }
    }
  }
  return neighbors;
};

const placeMines = (
  board: CellType[][],
  rows: number,
  cols: number,
  mines: number,
  safeRow: number,
  safeCol: number
) => {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (newBoard[r][c].mine) continue;

    const safeZone = [
      { row: safeRow, col: safeCol },
      ...getNeighbors(safeRow, safeCol, rows, cols),
    ];
    if (safeZone.some((n) => n.row === r && n.col === c)) continue;

    newBoard[r][c].mine = true;
    placed++;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].mine) continue;
      const neighbors = getNeighbors(r, c, rows, cols);
      newBoard[r][c].number = neighbors.filter(
        (n) => newBoard[n.row][n.col].mine
      ).length;
    }
  }

  return newBoard;
};

const revealCell = (
  board: CellType[][],
  row: number,
  col: number,
  rows: number,
  cols: number
) => {
  const cell = board[row][col];
  if (cell.revealed || cell.flagged) return;
  cell.revealed = true;

  if (cell.number === 0 && !cell.mine) {
    getNeighbors(row, col, rows, cols).forEach((n) => {
      if (!board[n.row][n.col].revealed) {
        revealCell(board, n.row, n.col, rows, cols);
      }
    });
  }
};

const checkWin = (board: CellType[][], rows: number, cols: number) => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (!cell.mine && !cell.revealed) return false;
    }
  }
  return true;
};

const Game = () => {
  const location = useLocation();
  const state = location.state as { playerName: string; level: string } | null;

  if (!state) return <Navigate to="/" replace />;

  const { playerName, level } = state;
  const { rows, cols, mines } = getBoardConfig(level);

  const sidebarWidth = window.innerWidth * 0.25;
  const boardWidth = window.innerWidth - sidebarWidth - BOARD_PADDING * 2;
  const boardHeight = window.innerHeight - BOARD_PADDING * 2;

  const totalGapWidth = GAP * (cols - 1);
  const totalGapHeight = GAP * (rows - 1);
  const cellSize = Math.floor(
    Math.min(
      (boardWidth - totalGapWidth) / cols,
      (boardHeight - totalGapHeight) / rows
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
    if (timerActive) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || youWon) return;

    let newBoard = board.map((r) => r.map((c) => ({ ...c })));

    if (isFirstClick) {
      newBoard = placeMines(newBoard, rows, cols, mines, row, col);
      setIsFirstClick(false);
      setTimerActive(true);
    }

    const cell = newBoard[row][col];
    if (cell.mine) {
      setGameOver(true);
      setTimerActive(false);
      newBoard.forEach((r) =>
        r.forEach((c) => {
          if (c.mine) c.revealed = true;
        })
      );
      setBoard(newBoard);
      return;
    }

    revealCell(newBoard, row, col, rows, cols);
    setBoard(newBoard);

    if (checkWin(newBoard, rows, cols)) {
      setYouWon(true);
      setTimerActive(false);
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver || youWon) return;

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    const cell = newBoard[row][col];
    if (!cell.revealed) {
      cell.flagged = !cell.flagged;
      setBoard(newBoard);
    }
  };

  const handleDoubleClick = (row: number, col: number) => {
    if (gameOver || youWon) return;

    const cell = board[row][col];
    if (!cell.revealed || cell.number === 0) return;

    const neighbors = getNeighbors(row, col, rows, cols);
    const flaggedCount = neighbors.filter(
      (n) => board[n.row][n.col].flagged
    ).length;

    if (flaggedCount === cell.number) {
      const newBoard = board.map((r) => r.map((c) => ({ ...c })));
      for (let n of neighbors) {
        const neighborCell = newBoard[n.row][n.col];
        if (!neighborCell.revealed && !neighborCell.flagged) {
          if (neighborCell.mine) {
            setGameOver(true);
            setTimerActive(false);
            newBoard.forEach((r) =>
              r.forEach((c) => {
                if (c.mine) c.revealed = true;
              })
            );
            setBoard(newBoard);
            return;
          }
          revealCell(newBoard, n.row, n.col, rows, cols);
        }
      }
      setBoard(newBoard);

      if (checkWin(newBoard, rows, cols)) {
        setYouWon(true);
        setTimerActive(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 flex flex-col items-center justify-center border-r border-gray-300 p-4 bg-white shadow">
        <h1 className="text-3xl font-bold mb-6">Minesweeper</h1>
        <p className="mb-4 text-lg">Player: {playerName}</p>
        <p className="mb-4 text-lg capitalize">Level: {level}</p>
        <p className="text-lg font-semibold">⏱ Time: {time}s</p>
        <p className="text-lg font-semibold">💣 Mines: {mines}</p>
        {gameOver && <p className="text-red-600 text-2xl font-bold mt-4">GAME OVER</p>}
        {youWon && <p className="text-green-600 text-2xl font-bold mt-4">YOU WON!</p>}
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
          {board.flat().map((cell) => (
            <Cell
              key={`${cell.row}-${cell.col}`}
              row={cell.row}
              col={cell.col}
              size={cellSize}
              cell={cell}
              onClick={() => handleCellClick(cell.row, cell.col)}
              onContextMenu={(e) => handleRightClick(e, cell.row, cell.col)}
              onDoubleClick={() => handleDoubleClick(cell.row, cell.col)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
