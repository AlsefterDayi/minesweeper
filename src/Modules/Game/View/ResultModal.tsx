import React from "react";

interface ResultModalProps {
  isOpen: boolean;
  isWin: boolean;
  time: number;
  onPlayAgain: () => void;
  onBackToStart: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  isWin,
  time,
  onPlayAgain,
  onBackToStart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-60 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {isWin ? "🎉 You Won!" : "💥 Game Over"}
        </h2>

        {isWin && <p className="mb-4 text-lg">Your time: {time} seconds</p>}

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onPlayAgain}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Play Again
          </button>
          <button
            onClick={onBackToStart}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
