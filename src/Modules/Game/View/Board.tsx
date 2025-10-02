import Cell from "../../../components/Cell";
import type { CellType } from "../Model/GameModel";

type Props = {
  board: CellType[][];
  setBoard: (b: CellType[][]) => void;
  cellSize: number;
  rows: number;
  cols: number;
  mines: number;
  isFirstClick: boolean;
  setIsFirstClick: (v: boolean) => void;
  setTimerActive: (v: boolean) => void;
  gameOver: boolean;
  setGameOver: (v: boolean) => void;
  setYouWon: (v: boolean) => void;
  checkWin: (b: CellType[][]) => boolean;
};

const getNeighbors = (row: number, col: number, rows: number, cols: number) => {
  const neighbors: { row: number; col: number }[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)
        neighbors.push({ row: nr, col: nc });
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
      if (!board[n.row][n.col].revealed)
        revealCell(board, n.row, n.col, rows, cols);
    });
  }
};

const Board = ({
  board,
  setBoard,
  cellSize,
  rows,
  cols,
  mines,
  isFirstClick,
  setIsFirstClick,
  setTimerActive,
  gameOver,
  setGameOver,
  setYouWon,
  checkWin,
}: Props) => {
  const handleCellClick = (row: number, col: number) => {
    if (gameOver) return;
    let newBoard = board.map((r) => r.map((c) => ({ ...c })));
    if (isFirstClick) {
      newBoard = placeMines(newBoard, rows, cols, mines, row, col);
      setIsFirstClick(false);
      setTimerActive(true);
    }
    if (newBoard[row][col].mine) {
      newBoard.forEach((r) =>
        r.forEach((c) => {
          if (c.mine) c.revealed = true;
        })
      );
      setBoard(newBoard);
      setGameOver(true);
      setTimerActive(false);
      return;
    }
    revealCell(newBoard, row, col, rows, cols);
    setBoard(newBoard);
    if (checkWin(newBoard)) {
      newBoard.forEach((r) =>
        r.forEach((c) => {
          if (c.mine) c.flagged = true;
        })
      );
      setBoard(newBoard);
      setYouWon(true);
      setTimerActive(false);
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver) return;
    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    const cell = newBoard[row][col];
    if (!cell.revealed) cell.flagged = !cell.flagged;
    setBoard(newBoard);
  };

  const handleDoubleClick = (row: number, col: number) => {
    const cell = board[row][col];
    if (!cell.revealed || cell.number === 0 ) return;

    const neighbors = getNeighbors(row, col, rows, cols);
    const flaggedCount = neighbors.filter(
      (n) => board[n.row][n.col].flagged
    ).length;

    if (flaggedCount === cell.number) {
      const newBoard = board.map((r) => r.map((c) => ({ ...c })));
      let mineClicked = false;

      neighbors.forEach((n) => {
        const neighbor = newBoard[n.row][n.col];
        if (!neighbor.revealed && !neighbor.flagged) {
          if (neighbor.mine) {
            mineClicked = true;
          } else {
            revealCell(newBoard, n.row, n.col, rows, cols);
          }
        }
      });

      if (mineClicked) {
        newBoard.forEach((r) =>
          r.forEach((c) => {
            if (c.mine) c.revealed = true;
          })
        );
        setBoard(newBoard);
        setGameOver(true);
        setTimerActive(false);
      } else {
        setBoard(newBoard);
        if (checkWin(newBoard)) {
          newBoard.forEach((r) =>
            r.forEach((c) => {
              if (c.mine) c.flagged = true;
            })
          );
          setBoard(newBoard);
          setYouWon(true);
          setTimerActive(false);
        }
      }
    }
  };

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-hidden"
      style={{
        width: board[0].length * cellSize + 32,
        padding: 16,
        margin: "16",
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: "4px",
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
  );
};

export default Board;
