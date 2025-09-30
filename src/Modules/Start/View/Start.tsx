import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";

function Start() {
  const [playerName, setPlayerName] = useState("");
  const [level, setLevel] = useState("easy");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleStart = () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setError("");
    login();

    navigate(`/game/`, { state: { playerName, level } });
  };

  return (
    <section className="start">
      <div className="container">
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <h1 className="text-4xl font-bold mb-8">Minesweeper</h1>

          <div className="w-64 mb-6">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-400 focus:ring-blue-400"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex gap-4 mb-6">
            {["easy", "medium", "hard"].map((lvl) => (
              <label key={lvl} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="level"
                  value={lvl}
                  checked={level === lvl}
                  onChange={(e) => setLevel(e.target.value)}
                  className="accent-blue-500"
                />
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </label>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition cursor-pointer"
          >
            Start
          </button>
        </div>
      </div>
    </section>
  );
}

export default Start;
